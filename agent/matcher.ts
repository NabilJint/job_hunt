import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

function isTransientError(err: unknown): boolean {
  const status = (err as Record<string, unknown>)?.status ?? (err as Record<string, unknown>)?.statusText;
  return status === 503 || status === 429 || status === 500;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`LLM call timed out after ${ms}ms`)), ms),
    ),
  ]);
}

type ScoredJob = {
  jobIndex: number;
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};

type AdzunaJobInput = {
  title: string;
  company: string;
  description: string;
};

type UserProfile = {
  skills: string[];
  current_title: string;
  experience_level: string;
  years_experience: number;
  work_experience: Array<{
    company: string;
    title: string;
    responsibilities: string;
  }>;
  job_titles_seeking: string[];
};

export async function scoreJobs(
  jobs: AdzunaJobInput[],
  profile: UserProfile,
): Promise<{ success: boolean; data?: ScoredJob[]; error?: string }> {
  try {
    if (jobs.length === 0) {
      return { success: true, data: [] };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const jobsDescription = jobs
      .map(
        (job, i) =>
          `Job ${i}: ${job.title} at ${job.company}\nDescription: ${job.description}`,
      )
      .join("\n\n");

    const prompt = `You are a job matching assistant. Score each job against the candidate's profile.

Return ONLY valid JSON matching this exact shape. No markdown, no explanation, no wrapping:

{
  "scores": [
    {
      "jobIndex": 0,
      "matchScore": 85,
      "matchReason": "One paragraph explaining why this job matches or doesn't match the candidate.",
      "matchedSkills": ["Skill 1", "Skill 2"],
      "missingSkills": ["Skill 3", "Skill 4"]
    }
  ]
}

Rules:
- matchScore is an integer 0-100. Higher means better fit.
- matchReason is one specific paragraph — not generic. Reference actual skills and experience.
- matchedSkills: skills the candidate HAS that this job requires. Be specific.
- missingSkills: skills this job requires that the candidate LACKS. Be specific.
- Score fairly. Don't inflate scores. A 70+ means genuinely strong fit.
- Return exactly ${jobs.length} score objects, one per job, in the same order.
- Return ONLY the JSON object, nothing else.

CANDIDATE PROFILE:
Current title: ${profile.current_title}
Experience: ${profile.years_experience} years, level ${profile.experience_level}
Skills: ${profile.skills.join(", ")}
Job titles seeking: ${profile.job_titles_seeking.join(", ")}
Work history: ${profile.work_experience.map((w) => `${w.title} at ${w.company}: ${w.responsibilities}`).join("; ")}

JOBS TO SCORE:
${jobsDescription}`;

    let lastError: unknown;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await withTimeout(model.generateContent(prompt), TIMEOUT_MS);
        const response = result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return {
            success: false,
            error: "Failed to parse scoring result.",
          };
        }

        const parsed = JSON.parse(jsonMatch[0]) as { scores: ScoredJob[] };

        if (!Array.isArray(parsed.scores) || parsed.scores.length === 0) {
          return {
            success: false,
            error: "Scoring returned empty results.",
          };
        }

        return { success: true, data: parsed.scores };
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

    console.error("[agent/matcher]", lastError);
    if (isTransientError(lastError)) {
      return {
        success: false,
        error: "AI service is temporarily unavailable. Please try again.",
      };
    }
    return {
      success: false,
      error: "Job scoring failed. Please try again.",
    };
  } catch (error) {
    console.error("[agent/matcher]", error);
    return {
      success: false,
      error: "Job scoring failed. Please try again.",
    };
  }
}
