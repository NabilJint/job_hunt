import Link from "next/link";
import { notFound } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { JobInfo } from "@/components/job-details/JobInfo";
import { MatchScore } from "@/components/job-details/MatchScore";
import { JobDescription } from "@/components/job-details/JobDescription";
import { CompanyResearch } from "@/components/job-details/CompanyResearch";
import { JobActions } from "@/components/job-details/JobActions";

type Params = Promise<{ id: string }>;

export default async function JobDetailsPage({ params }: { params: Params }) {
  const { id } = await params;

  const insforge = await createInsforgeServer();
  const {
    data: { user },
    error: authError,
  } = await insforge.auth.getCurrentUser();

  if (authError || !user) {
    notFound();
  }

  const { data: job, error } = await insforge
    .database.from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6">
        <Link
          href="/find-jobs"
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors w-fit"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>
        <JobInfo job={job} />
        <MatchScore job={job} />
        <JobDescription job={job} />
        <CompanyResearch
          jobId={job.id}
          companyResearch={job.company_research}
          matchScore={job.match_score}
          matchReason={job.match_reason}
          matchedSkills={job.matched_skills}
          missingSkills={job.missing_skills}
        />
        <JobActions externalApplyUrl={job.external_apply_url} />
      </main>
    </div>
  );
}
