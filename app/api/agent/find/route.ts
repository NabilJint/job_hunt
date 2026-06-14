import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { searchJobs } from "@/lib/adzuna";
import { scoreJobs } from "@/agent/matcher";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";
import { MATCH_THRESHOLD } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, location } = body as { jobTitle?: string; location?: string };

    if (!jobTitle || !jobTitle.trim()) {
      return NextResponse.json(
        { success: false, error: "Job title is required" },
        { status: 400 },
      );
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await insforge
      .database.from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const { data: run, error: runError } = await insforge
      .database.from("agent_runs")
      .insert({
        user_id: user.id,
        status: "running",
        job_title_searched: jobTitle.trim(),
        location_searched: location?.trim() || null,
        started_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (runError || !run) {
      console.error("[api/agent/find] Failed to create agent run:", runError);
      return NextResponse.json(
        { success: false, error: "Failed to start search" },
        { status: 500 },
      );
    }

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "job_search_started",
      properties: { userId: user.id, jobTitle: jobTitle.trim(), location: location?.trim() || "" },
    });

    let adzunaJobs;
    try {
      adzunaJobs = await searchJobs(jobTitle.trim(), location?.trim() || "");
    } catch (error) {
      console.error("[api/agent/find] Adzuna API error:", error);
      await insforge
        .database.from("agent_runs")
        .update({ status: "failed", completed_at: new Date().toISOString() })
        .eq("id", run.id);
      await shutdownPostHog();
      return NextResponse.json(
        { success: false, error: "Job search failed. Please try again." },
        { status: 502 },
      );
    }

    if (adzunaJobs.length === 0) {
      await insforge
        .database.from("agent_runs")
        .update({
          status: "completed",
          jobs_found: 0,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);
      await shutdownPostHog();
      return NextResponse.json({
        success: true,
        data: { jobsFound: 0, strongMatches: 0 },
      });
    }

    const jobsForScoring = adzunaJobs.map((job) => ({
      title: job.title,
      company: job.company.display_name,
      description: job.description,
    }));

    const scoringResult = await scoreJobs(jobsForScoring, {
      skills: profile.skills || [],
      current_title: profile.current_title || "",
      experience_level: profile.experience_level || "",
      years_experience: profile.years_experience || 0,
      work_experience: profile.work_experience || [],
      job_titles_seeking: profile.job_titles_seeking || [],
    });

    let savedCount = 0;
    let strongMatchCount = 0;

    for (let i = 0; i < adzunaJobs.length; i++) {
      const job = adzunaJobs[i];
      const score = scoringResult.data?.find((s) => s.jobIndex === i);

      const salary = job.salary_min
        ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round((job.salary_max || job.salary_min) / 1000)}k`
        : null;

      const jobRecord = {
        user_id: user.id,
        run_id: run.id,
        source: "search" as const,
        source_url: job.redirect_url,
        external_apply_url: job.redirect_url,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        salary,
        job_type: job.contract_type || "fulltime",
        about_role: job.description,
        match_score: score?.matchScore ?? 50,
        match_reason: score?.matchReason ?? "Scoring unavailable for this job.",
        matched_skills: score?.matchedSkills ?? [],
        missing_skills: score?.missingSkills ?? [],
        found_at: new Date().toISOString(),
      };

      const { error: insertError } = await insforge
        .database.from("jobs")
        .insert(jobRecord);

      if (insertError) {
        console.error("[api/agent/find] Failed to save job:", insertError);
        continue;
      }

      console.log("[api/agent/find] Saved job:", job.title, "at", job.company.display_name, "for user:", user.id);

      savedCount++;
      if ((score?.matchScore ?? 0) >= MATCH_THRESHOLD) {
        strongMatchCount++;
      }

      posthog.capture({
        distinctId: user.id,
        event: "job_found",
        properties: {
          userId: user.id,
          source: "search",
          matchScore: score?.matchScore ?? 50,
        },
      });
    }

    await insforge
      .database.from("agent_runs")
      .update({
        status: "completed",
        jobs_found: savedCount,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    await shutdownPostHog();

    return NextResponse.json({
      success: true,
      data: { jobsFound: savedCount, strongMatches: strongMatchCount },
    });
  } catch (error) {
    console.error("[api/agent/find]", error);
    await shutdownPostHog();
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
