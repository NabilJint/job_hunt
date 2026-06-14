"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";

type CompanyResearchData = {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
};

type Props = {
  jobId: string;
  companyResearch: CompanyResearchData | null;
  matchScore?: number | null;
  matchReason?: string | null;
  matchedSkills?: string[] | null;
  missingSkills?: string[] | null;
};

export function CompanyResearch({
  jobId,
  companyResearch,
  matchScore,
  matchReason,
  matchedSkills,
  missingSkills,
}: Props) {
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasExistingResearch =
    companyResearch !== null &&
    typeof companyResearch.companyOverview === "string" &&
    companyResearch.companyOverview.length > 0;
  const [researchData, setResearchData] = useState<CompanyResearchData | null>(
    hasExistingResearch ? companyResearch : null,
  );

  async function handleResearch() {
    setIsResearching(true);
    setError(null);

    try {
      const response = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(
          result.error || "Research failed. Please try again.",
        );
        return;
      }

      setResearchData(result.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsResearching(false);
    }
  }

  if (researchData) {
    return (
      <DossierView
        data={researchData}
        onReResearch={handleResearch}
        isResearching={isResearching}
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-muted rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Company Research
            </h2>
            <p className="text-sm text-text-muted">
              Research this company to get a structured dossier with overview,
              tech stack, culture, and interview prep tailored to your profile.
            </p>
          </div>
        </div>

        {matchReason && (
          <div className="bg-accent-muted/30 rounded-xl p-4 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Why this role fits you
            </h3>
            <p className="text-sm text-text-primary leading-relaxed">
              {matchReason}
            </p>
            {(matchedSkills && matchedSkills.length > 0) && (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {(missingSkills && missingSkills.length > 0) && (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20"
                  >
                    Missing: {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleResearch}
          disabled={isResearching}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Researching...
            </>
          ) : (
            "Research Company"
          )}
        </button>
        {error && (
          <p className="text-sm text-error mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}

function DossierView({
  data,
  onReResearch,
  isResearching,
}: {
  data: CompanyResearchData;
  onReResearch: () => void;
  isResearching: boolean;
}) {
  const techStack = data.techStack || [];
  const culture = data.culture || [];
  const yourEdge = data.yourEdge || [];
  const gapsToAddress = data.gapsToAddress || [];
  const smartQuestions = data.smartQuestions || [];
  const interviewPrep = data.interviewPrep || [];
  const sources = data.sources || [];

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            Company Research
          </h2>
          <button
            onClick={onReResearch}
            disabled={isResearching}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-surface-secondary text-text-secondary hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResearching ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Researching...
              </>
            ) : (
              "Research Again"
            )}
          </button>
        </div>

        <Section title="Company Overview">
          <p className="text-sm text-text-primary leading-relaxed">
            {data.companyOverview || ""}
          </p>
        </Section>

        {techStack.length > 0 && (
          <Section title="Tech Stack">
            <div className="flex flex-wrap gap-2">
              {techStack.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary text-text-primary border border-border"
                >
                  {item}
                </span>
              ))}
            </div>
          </Section>
        )}

        {culture.length > 0 && (
          <Section title="Culture">
            <ul className="space-y-1.5">
              {culture.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Why This Role">
          <p className="text-sm text-text-primary leading-relaxed">
            {data.whyThisRole || ""}
          </p>
        </Section>

        {yourEdge.length > 0 && (
          <Section title="Your Edge">
            <ul className="space-y-1.5">
              {yourEdge.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {gapsToAddress.length > 0 && (
          <Section title="Gaps to Address">
            <ul className="space-y-1.5">
              {gapsToAddress.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {smartQuestions.length > 0 && (
          <Section title="Smart Questions">
            <ul className="space-y-1.5">
              {smartQuestions.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {interviewPrep.length > 0 && (
          <Section title="Interview Prep">
            <ul className="space-y-1.5">
              {interviewPrep.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {sources.length > 0 && (
          <Section title="Sources">
            <div className="flex flex-col gap-1">
              {sources.map((source, i) => (
                <p
                  key={i}
                  className="text-xs text-text-muted"
                >
                  {source}
                </p>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
