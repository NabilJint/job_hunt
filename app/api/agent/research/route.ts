import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { researchCompany } from "@/agent/research";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body as { jobId?: string };

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
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

    const { data: job, error: jobError } = await insforge
      .database.from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 },
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

    const result = await researchCompany(
      {
        company: job.company,
        source_url: job.source_url,
        title: job.title,
        about_role: job.about_role,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        nice_to_have: job.nice_to_have,
        benefits: job.benefits,
        about_company: job.about_company,
        matched_skills: job.matched_skills,
        missing_skills: job.missing_skills,
      },
      {
        current_job_title: profile.current_job_title,
        years_experience: profile.years_experience,
        experience_level: profile.experience_level,
        skills: profile.skills,
        work_experience: profile.work_experience,
      },
    );

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Research failed" },
        { status: 500 },
      );
    }

    const { error: saveError } = await insforge
      .database.from("jobs")
      .update({ company_research: result.data })
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (saveError) {
      console.error("[api/agent/research] Failed to save dossier:", saveError);
    }

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "company_researched",
      properties: {
        userId: user.id,
        jobId,
        company: job.company,
      },
    });

    await shutdownPostHog();

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[api/agent/research]", error);
    try {
      await shutdownPostHog();
    } catch {
      // ignore shutdown errors
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
