import Link from "next/link";
import { Building2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type Job = {
  id: string;
  company: string;
  title: string;
  matchScore: number;
  salary: string;
  foundAt: string;
};

type JobsTableProps = {
  jobs: Job[];
  isLoading?: boolean;
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info";
  return "bg-warning";
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
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function JobsTable({ jobs, isLoading }: JobsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">COMPANY</th>
                <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">ROLE</th>
                <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">MATCH SCORE</th>
                <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">SALARY EST.</th>
                <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">DATE FOUND</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-6 py-4"><div className="h-4 bg-surface-secondary rounded animate-pulse w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-surface-secondary rounded animate-pulse w-32" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-surface-secondary rounded animate-pulse w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-surface-secondary rounded animate-pulse w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-surface-secondary rounded animate-pulse w-14" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-12 flex flex-col items-center justify-center gap-4">
        <Search className="w-10 h-10 text-text-muted" />
        <p className="text-text-muted text-sm text-center">
          No jobs found. Search above to discover opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">
                COMPANY
              </th>
              <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">
                ROLE
              </th>
              <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">
                MATCH SCORE
              </th>
              <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">
                SALARY EST.
              </th>
              <th className="text-left text-text-secondary text-xs font-medium uppercase tracking-wider px-6 py-3">
                DATE FOUND
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-border last:border-b-0 hover:bg-surface-secondary transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/find-jobs/${job.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 bg-surface-secondary border border-border rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-text-muted" />
                    </div>
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                      {job.company}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/find-jobs/${job.id}`}
                    className="text-sm text-text-primary hover:text-accent transition-colors"
                  >
                    {job.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/find-jobs/${job.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-24 h-1 bg-border-light rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          getScoreColor(job.matchScore)
                        )}
                        style={{ width: `${job.matchScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-primary tabular-nums">
                      {job.matchScore}%
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">
                    {job.salary}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-muted">
                    {formatTimeAgo(job.foundAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
