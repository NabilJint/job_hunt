"use client";

type JobRow = {
  about_role: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  nice_to_have: string[] | null;
  benefits: string[] | null;
  about_company: string | null;
  external_apply_url: string | null;
};

type Props = {
  job: JobRow;
};

function SectionList({
  title,
  items,
}: {
  title: string;
  items: string[] | null;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDescription({ job }: Props) {
  const hasContent =
    job.about_role ||
    (job.responsibilities && job.responsibilities.length > 0) ||
    (job.requirements && job.requirements.length > 0) ||
    (job.nice_to_have && job.nice_to_have.length > 0) ||
    (job.benefits && job.benefits.length > 0) ||
    job.about_company;

  if (!hasContent) {
    return (
      <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
        <h2 className="text-base font-semibold text-text-primary">
          Job Description
        </h2>
        <p className="text-sm text-text-muted mt-3">
          No description available for this job.
        </p>
      </div>
    );
  }

  const aboutRoleLong = job.about_role && job.about_role.length > 400;

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-base font-semibold text-text-primary">
          Job Description
        </h2>

        {job.about_role && (
          <div>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
              {job.about_role}
            </p>
            {aboutRoleLong && job.external_apply_url && (
              <a
                href={job.external_apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-sm font-medium text-accent hover:text-accent-dark transition-colors inline-flex items-center gap-1"
              >
                Show full description →
              </a>
            )}
          </div>
        )}

        <SectionList
          title="Responsibilities"
          items={job.responsibilities}
        />
        <SectionList title="Requirements" items={job.requirements} />
        <SectionList title="Nice to Have" items={job.nice_to_have} />
        <SectionList title="Benefits" items={job.benefits} />

        {job.about_company && (
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              About the Company
            </h3>
            <p className="text-sm text-text-primary leading-relaxed">
              {job.about_company}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
