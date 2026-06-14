import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

function isTransientError(err: any): boolean {
  const status = err?.status ?? err?.statusText;
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

type ResumeProfile = {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio?: string;
  current_job_title?: string;
  current_company?: string;
  current_start_date?: string;
  current_end_date?: string;
  current_is_active?: boolean;
  current_responsibilities?: string;
  highest_degree?: string;
  field_of_study?: string;
  institution?: string;
  graduation_year?: string;
  skills?: string[];
};

type GeneratedResume = {
  summary: string;
  experienceBullets: string[];
  skills: string[];
};

export async function generateResumeContent(
  profile: ResumeProfile,
): Promise<{ success: boolean; data?: GeneratedResume; error?: string; retryable?: boolean }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are a professional resume writer. Given the following candidate profile, generate polished resume content.

Return ONLY valid JSON matching this exact shape. No markdown, no explanation, no wrapping:

{
  "summary": "2-3 sentence professional summary paragraph",
  "experienceBullets": ["Polished bullet point 1", "Polished bullet point 2", ...],
  "skills": ["Skill 1", "Skill 2", ...]
}

Rules:
- summary: Write a concise professional summary based on the candidate's title, experience, and skills. Make it specific to what they actually do — no generic filler.
- experienceBullets: Take the raw responsibilities text and rewrite as 3-5 strong resume bullet points. Start each with an action verb. Quantify where possible. Remove fluff.
- skills: Return the skills array as-is, cleaned up (trim whitespace, consistent casing).
- If a field is missing or empty, work with what is available. Do not invent details not present in the profile.
- Keep the tone professional but not stiff. This is a modern tech resume.
- Return ONLY the JSON object, nothing else.

CANDIDATE PROFILE:
Name: ${profile.full_name}
Title: ${profile.current_job_title || "Not specified"}
Company: ${profile.current_company || "Not specified"}
Employment: ${profile.current_start_date || "Unknown"} – ${profile.current_is_active ? "Present" : profile.current_end_date || "Unknown"}
Responsibilities: ${profile.current_responsibilities || "Not provided"}
Education: ${profile.highest_degree || "Not specified"} in ${profile.field_of_study || "N/A"} from ${profile.institution || "N/A"} (${profile.graduation_year || "N/A"})
Skills: ${(profile.skills || []).join(", ") || "None listed"}`;

    let lastError: any;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await withTimeout(model.generateContent(prompt), TIMEOUT_MS);
        const response = result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return {
            success: false,
            error: "Failed to parse resume generation result.",
          };
        }

        const parsed = JSON.parse(jsonMatch[0]) as GeneratedResume;

        if (!parsed.summary || !Array.isArray(parsed.experienceBullets)) {
          return {
            success: false,
            error: "Generated content was incomplete. Please try again.",
          };
        }

        return { success: true, data: parsed };
      } catch (err: any) {
        lastError = err;
        if (isTransientError(err) && attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** attempt, 8000);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        break;
      }
    }

    console.error("[agent/generator]", lastError);
    if (isTransientError(lastError)) {
      return {
        success: false,
        error: "AI service is temporarily unavailable. Please try again in a moment.",
        retryable: true,
      };
    }
    return {
      success: false,
      error: "Resume generation failed. Please try again.",
    };
  } catch (error) {
    console.error("[agent/generator]", error);
    return {
      success: false,
      error: "Resume generation failed. Please try again.",
    };
  }
}
