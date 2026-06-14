import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { generateResumeContent } from "@/agent/generator";

const DEGREE_LABELS: Record<string, string> = {
  high_school: "High School Diploma",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  phd: "Ph.D.",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  contactLine: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  jobMeta: {
    fontSize: 9,
    color: "#555",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.4,
    marginLeft: 12,
    marginBottom: 3,
  },
  bulletDot: {
    fontSize: 10,
    marginRight: 6,
  },
  educationRow: {
    marginBottom: 4,
  },
  educationText: {
    fontSize: 10,
  },
  skillsLine: {
    fontSize: 10,
    lineHeight: 1.5,
  },
});

type ProfileRow = {
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

type GeneratedContent = {
  summary: string;
  experienceBullets: string[];
  skills: string[];
};

function ResumePDF({
  profile,
  content,
}: {
  profile: ProfileRow;
  content: GeneratedContent;
}) {
  const contactParts = [profile.email, profile.phone, profile.location].filter(
    Boolean,
  );
  const links = [profile.linkedin_url, profile.portfolio].filter(Boolean);
  const degreeLabel = profile.highest_degree
    ? DEGREE_LABELS[profile.highest_degree] || profile.highest_degree
    : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name}</Text>
          {contactParts.length > 0 && (
            <Text style={styles.contactLine}>{contactParts.join(" | ")}</Text>
          )}
          {links.length > 0 && (
            <Text style={styles.contactLine}>{links.join(" | ")}</Text>
          )}
        </View>

        {/* Professional Summary */}
        {content.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{content.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {(profile.current_job_title || content.experienceBullets.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {profile.current_job_title && (
              <>
                <Text style={styles.jobTitle}>{profile.current_job_title}</Text>
                <Text style={styles.jobMeta}>
                  {[profile.current_company, profile.current_start_date && `${profile.current_start_date} – ${profile.current_is_active ? "Present" : profile.current_end_date || ""}`]
                    .filter(Boolean)
                    .join(" • ")}
                </Text>
              </>
            )}
            {content.experienceBullets.map((bullet, i) => (
              <View key={i} style={{ flexDirection: "row" }}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bullet}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {degreeLabel && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.educationRow}>
              <Text style={styles.educationText}>
                {degreeLabel}
                {profile.field_of_study ? ` in ${profile.field_of_study}` : ""}
                {profile.institution ? ` — ${profile.institution}` : ""}
                {profile.graduation_year ? ` (${profile.graduation_year})` : ""}
              </Text>
            </View>
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsLine}>{content.skills.join(" • ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function POST() {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await insforge
      .database.from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "No profile found. Please save your profile first." },
        { status: 404 },
      );
    }

    const genResult = await generateResumeContent(profile as ProfileRow);
    if (!genResult.success) {
      const status = genResult.retryable ? 503 : 500;
      return NextResponse.json(
        { success: false, error: genResult.error },
        { status },
      );
    }

    const pdfBuffer = await renderToBuffer(
      <ResumePDF profile={profile as ProfileRow} content={genResult.data!} />,
    );

    const storagePath = `resumes/${user.id}/resume.pdf`;
    const blob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });

    await insforge.storage.from("resumes").remove(storagePath).catch(() => {});

    const { error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(storagePath, blob);

    if (uploadError) {
      console.error("[api/resume/generate] Storage upload failed:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to save generated resume" },
        { status: 500 },
      );
    }

    const resumeUrl = insforge.storage
      .from("resumes")
      .getPublicUrl(storagePath);

    const { error: updateError } = await insforge
      .database.from("profiles")
      .update({
        resume_url: resumeUrl,
        resume_key: storagePath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("[api/resume/generate] Profile update failed:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to link generated resume to your profile" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      resumeUrl,
      resumeKey: storagePath,
    });
  } catch (error) {
    console.error("[api/resume/generate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
