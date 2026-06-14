import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

function isTransientError(err: unknown): boolean {
  const status =
    (err as Record<string, unknown>)?.status ??
    (err as Record<string, unknown>)?.statusText;
  return status === 503 || status === 429 || status === 500;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`LLM call timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
}

export type Dossier = {
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

type ResearchJob = {
  company: string;
  source_url: string | null;
  title: string;
  about_role: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  nice_to_have: string[] | null;
  benefits: string[] | null;
  about_company: string | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
};

type ResearchProfile = {
  current_job_title: string | null;
  years_experience: number | null;
  experience_level: string | null;
  skills: string[] | null;
  work_experience: unknown[] | null;
};

export async function researchCompany(
  job: ResearchJob,
  profile: ResearchProfile,
): Promise<{
  success: boolean;
  data?: Dossier;
  error?: string;
  retryable?: boolean;
}> {
  try {
    const homepageUrl = await deriveHomepageUrl(
      job.source_url,
      job.company,
    );

    const companyContent = await fetchCompanyContent(homepageUrl);
    const jobPosting = buildJobPosting(job);
    const profileStr = buildProfileString(profile);

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const prompt = buildSynthesisPrompt(companyContent, jobPosting, profileStr);

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await withTimeout(
          model.generateContent(prompt),
          TIMEOUT_MS,
        );
        const response = result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return {
            success: false,
            error: "Failed to parse dossier. Please try again.",
            retryable: true,
          };
        }

        const dossier = JSON.parse(jsonMatch[0]) as Dossier;

        if (!dossier.companyOverview) {
          return {
            success: false,
            error: "Generated dossier is incomplete. Please try again.",
            retryable: true,
          };
        }

        dossier.sources = companyContent.url ? [companyContent.url] : [];

        return { success: true, data: dossier };
      } catch (err: unknown) {
        lastError = err;
        if (isTransientError(err) && attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** attempt, 8000);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }

    console.error("[agent/research]", lastError);
    return {
      success: false,
      error: "Research failed. Please try again.",
      retryable: isTransientError(lastError),
    };
  } catch (error) {
    console.error("[agent/research]", error);
    return {
      success: false,
      error: "Research failed. Please try again.",
      retryable: false,
    };
  }
}

async function deriveHomepageUrl(
  sourceUrl: string | null,
  companyName: string,
): Promise<string> {
  if (sourceUrl) {
    try {
      const response = await fetch(sourceUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
      });

      const finalUrl = response.url;

      if (finalUrl && !finalUrl.includes("adzuna")) {
        try {
          const url = new URL(finalUrl);
          const hostParts = url.hostname.split(".");
          // Strip subdomain prefix (jobs.stripe.com → stripe.com, sub.example.co.uk → example.co.uk)
          if (hostParts.length >= 3) {
            return `https://${hostParts.slice(1).join(".")}`;
          }
          if (hostParts.length === 2) {
            return `https://${hostParts.join(".")}`;
          }
        } catch {
          // URL parsing failed, fall through
        }
      }
    } catch {
      // Fetch failed, fall through
    }
  }

  const cleanName = companyName
    .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  return `https://www.${cleanName}.com`;
}

async function fetchCompanyContent(
  homepageUrl: string,
): Promise<{ content: string; url: string }> {
  try {
    const jinaUrl = `https://r.jina.ai/${homepageUrl}`;
    const response = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(
        "[agent/research] Jina Reader returned",
        response.status,
      );
      return { content: "", url: homepageUrl };
    }

    const text = await response.text();

    if (!text || text.trim().length < 100) {
      return { content: "", url: homepageUrl };
    }

    let combined = `=== Homepage ===\n${text.trim()}`;

    try {
      const aboutUrl = new URL("/about", homepageUrl).href;
      const aboutResponse = await fetch(
        `https://r.jina.ai/${aboutUrl}`,
        { signal: AbortSignal.timeout(8000) },
      );

      if (aboutResponse.ok) {
        const aboutText = await aboutResponse.text();
        if (aboutText && aboutText.trim().length > 100) {
          combined += `\n\n=== About Page ===\n${aboutText.trim()}`;
        }
      }
    } catch {
      // About page fetch failed, homepage content is enough
    }

    return { content: combined, url: homepageUrl };
  } catch (error) {
    console.warn("[agent/research] Jina Reader error:", error);
    return { content: "", url: homepageUrl };
  }
}

function buildJobPosting(job: ResearchJob): string {
  const parts: string[] = [];

  parts.push(`Title: ${job.title}`);
  parts.push(`Company: ${job.company}`);

  if (job.about_role) {
    parts.push(`\nAbout the role: ${job.about_role}`);
  }
  if (job.responsibilities?.length) {
    parts.push(
      `\nResponsibilities:\n${job.responsibilities.map((r) => `- ${r}`).join("\n")}`,
    );
  }
  if (job.requirements?.length) {
    parts.push(
      `\nRequirements:\n${job.requirements.map((r) => `- ${r}`).join("\n")}`,
    );
  }
  if (job.nice_to_have?.length) {
    parts.push(
      `\nNice to have:\n${job.nice_to_have.map((n) => `- ${n}`).join("\n")}`,
    );
  }
  if (job.benefits?.length) {
    parts.push(
      `\nBenefits:\n${job.benefits.map((b) => `- ${b}`).join("\n")}`,
    );
  }
  if (job.about_company) {
    parts.push(`\nAbout company: ${job.about_company}`);
  }

  return parts.join("\n");
}

function buildProfileString(profile: ResearchProfile): string {
  const parts: string[] = [];

  if (profile.current_job_title) {
    parts.push(`Current title: ${profile.current_job_title}`);
  }
  if (profile.years_experience) {
    parts.push(`Years experience: ${profile.years_experience}`);
  }
  if (profile.experience_level) {
    parts.push(`Experience level: ${profile.experience_level}`);
  }
  if (profile.skills?.length) {
    parts.push(`Skills: ${profile.skills.join(", ")}`);
  }
  if (profile.work_experience?.length) {
    const workStr = (profile.work_experience as Record<string, unknown>[])
      .map((w) => {
        const title = w.title || "";
        const company = w.company || "";
        const responsibilities = w.responsibilities || "";
        return `${title} at ${company}: ${responsibilities}`;
      })
      .join("; ");
    parts.push(`Work history: ${workStr}`);
  }

  return parts.join("\n");
}

function buildSynthesisPrompt(
  companyContent: { content: string; url: string },
  jobPosting: string,
  profile: string,
): string {
  const hasCompanyContent = companyContent.content.length > 0;

  const companySection = hasCompanyContent
    ? `COMPANY RESEARCH (from their website at ${companyContent.url}):\n${companyContent.content}`
    : "COMPANY RESEARCH: No company website content could be fetched. Rely on the job posting and candidate profile to build the dossier.";

  return `You are a sharp career strategist preparing a candidate to apply for a specific role.
You are given (a) research collected from the company's own website, (b) the job posting,
and (c) the candidate's profile. Produce a concise, concrete briefing that gives this
specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent
  funding, customers, headcount, or facts. If research was thin, infer carefully from
  the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this
  company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly
  and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind
  of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.

Return ONLY valid JSON matching this exact shape. No markdown, no explanation, no wrapping:

{
  "companyOverview": "string — 2-3 sentence overview of what the company does and who it's for",
  "techStack": ["string — specific technologies, languages, frameworks mentioned"],
  "culture": ["string — company values, working style, team norms"],
  "whyThisRole": "string — why this role exists and what success looks like",
  "yourEdge": ["string — specific advantages this candidate has for this role"],
  "gapsToAddress": ["string — honest gaps and how to frame them"],
  "smartQuestions": ["string — questions to ask that show research"],
  "interviewPrep": ["string — talking points and preparation advice"],
  "sources": ["string"]
}

${companySection}

JOB POSTING:
${jobPosting}

CANDIDATE PROFILE:
${profile}`;
}
