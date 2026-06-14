type JobRow = {
  match_score: number;
  match_reason: string | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
};

type Props = {
  job: JobRow;
};

function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info";
  return "bg-warning";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 50) return "Moderate Match";
  return "Low Match";
}

export function MatchScore({ job }: Props) {
  const hasMatchedSkills =
    Array.isArray(job.matched_skills) && job.matched_skills.length > 0;
  const hasMissingSkills =
    Array.isArray(job.missing_skills) && job.missing_skills.length > 0;
  const hasSkills = hasMatchedSkills || hasMissingSkills;

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            AI Match Reasoning
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-2 bg-border-light rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getScoreBarColor(job.match_score)}`}
                style={{ width: `${job.match_score}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-text-primary tabular-nums shrink-0">
              {job.match_score}%
            </span>
            <span className="text-sm font-medium text-text-secondary shrink-0">
              {getScoreLabel(job.match_score)}
            </span>
          </div>
        </div>

        {job.match_reason && (
          <p className="text-sm text-text-primary leading-relaxed">
            {job.match_reason}
          </p>
        )}

        {hasSkills && (
          <div className="flex flex-col gap-4">
            {hasMatchedSkills && (
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                  Required Skills Matched
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.matched_skills!.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-lightest text-success-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hasMissingSkills && (
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                  Skills to Develop
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.missing_skills!.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-muted text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
