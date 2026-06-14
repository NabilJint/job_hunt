import { Building2 } from "lucide-react";

type JobRow = {
  company: string;
  title: string;
  match_score: number;
  salary: string | null;
  location: string | null;
  job_type: string | null;
  found_at: string;
  external_apply_url: string | null;
};

type Props = {
  job: JobRow;
};

function getScoreBadgeStyle(score: number): string {
  if (score >= 90) return "bg-success-lightest text-success";
  if (score >= 70) return "bg-success-light text-success";
  if (score >= 50) return "bg-warning/10 text-warning";
  return "bg-surface-secondary text-text-muted";
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

function formatJobType(type: string | null): string {
  if (!type) return "Not specified";
  const map: Record<string, string> = {
    fulltime: "Full-time",
    parttime: "Part-time",
    contract: "Contract",
    permanent: "Permanent",
    internship: "Internship",
  };
  return map[type] || type;
}

export function JobInfo({ job }: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-12 h-12 bg-surface-secondary border border-border rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-text-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-text-primary truncate">
              {job.title}
            </h1>
            <p className="text-sm text-text-secondary mt-1">{job.company}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeStyle(job.match_score)}`}
            >
              {job.match_score}% Match
            </span>
            {job.external_apply_url && (
              <a
                href={job.external_apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent-dark transition-colors"
              >
                View Job Post
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface-secondary rounded-xl px-4 py-3">
            <p className="text-xs text-text-muted font-medium">SALARY EST.</p>
            <p className="text-sm font-medium text-text-primary mt-1">
              {job.salary || "Not specified"}
            </p>
          </div>
          <div className="bg-surface-secondary rounded-xl px-4 py-3">
            <p className="text-xs text-text-muted font-medium">LOCATION</p>
            <p className="text-sm font-medium text-text-primary mt-1">
              {job.location || "Not specified"}
            </p>
          </div>
          <div className="bg-surface-secondary rounded-xl px-4 py-3">
            <p className="text-xs text-text-muted font-medium">JOB TYPE</p>
            <p className="text-sm font-medium text-text-primary mt-1">
              {formatJobType(job.job_type)}
            </p>
          </div>
          <div className="bg-surface-secondary rounded-xl px-4 py-3">
            <p className="text-xs text-text-muted font-medium">DATE FOUND</p>
            <p className="text-sm font-medium text-text-primary mt-1">
              {formatTimeAgo(job.found_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
