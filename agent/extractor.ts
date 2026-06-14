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

type ExtractedProfile = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio: string;
  work_auth: "citizen" | "permanent_resident" | "visa_required";
  current_job_title: string;
  current_company: string;
  current_start_date: string;
  current_end_date: string;
  current_is_active: boolean;
  current_responsibilities: string;
  highest_degree: "high_school" | "bachelors" | "masters" | "phd";
  field_of_study: string;
  institution: string;
  graduation_year: string;
  seeking_titles: string;
  remote_preference: "any" | "remote" | "hybrid" | "onsite";
  salary_expectation: string;
  preferred_locations: string;
  skills: string[];
};

export async function extractProfileFromText(
  rawText: string,
): Promise<{ success: boolean; data?: ExtractedProfile; error?: string; retryable?: boolean }> {
  try {
    if (!rawText || rawText.trim().length < 50) {
      return {
        success: false,
        error:
          "Could not extract text from this PDF. Please try a different file.",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are a resume parser. Extract structured profile data from the resume text below.

Return ONLY valid JSON matching this exact shape. No markdown, no explanation, no wrapping:

{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin_url": "string",
  "portfolio": "string",
  "work_auth": "citizen" | "permanent_resident" | "visa_required",
  "current_job_title": "string",
  "current_company": "string",
  "current_start_date": "YYYY-MM format or empty string",
  "current_end_date": "YYYY-MM format or empty string",
  "current_is_active": boolean,
  "current_responsibilities": "string",
  "highest_degree": "high_school" | "bachelors" | "masters" | "phd",
  "field_of_study": "string",
  "institution": "string",
  "graduation_year": "YYYY or empty string",
  "seeking_titles": "string",
  "remote_preference": "any" | "remote" | "hybrid" | "onsite",
  "salary_expectation": "string",
  "preferred_locations": "string",
  "skills": ["string"]
}

Rules:
- If a field is not found in the resume, use empty string (or empty array for skills).
- For work_auth, infer from context if possible, otherwise use "citizen".
- For highest_degree, infer from education section.
- For current_is_active, set true if the most recent role has no end date or says "Present".
- For skills, extract all technical skills, tools, languages, and frameworks mentioned.
- Do NOT invent information not present in the resume.
- Return ONLY the JSON object, nothing else.

RESUME TEXT:
${rawText}`;

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
            error: "Failed to parse extraction result. Please try again.",
          };
        }

        const parsed = JSON.parse(jsonMatch[0]) as ExtractedProfile;
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

    console.error("[agent/extractor]", lastError);
    if (isTransientError(lastError)) {
      return {
        success: false,
        error: "AI service is temporarily unavailable. Please try again in a moment.",
        retryable: true,
      };
    }
    return {
      success: false,
      error: "Extraction failed. Please try again or fill in manually.",
    };
  } catch (error) {
    console.error("[agent/extractor]", error);
    return {
      success: false,
      error: "Extraction failed. Please try again or fill in manually.",
    };
  }
}
