import { NextRequest, NextResponse } from "next/server";
import { extractProfileFromText } from "@/agent/extractor";
import { PDFParse } from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeKey } = body as { resumeKey?: string };

    if (!resumeKey) {
      return NextResponse.json(
        { success: false, error: "Missing resumeKey" },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL!;
    const apiKey = process.env.INSFORGE_ADMIN_KEY!;
    const storageUrl = `${baseUrl}/api/storage/buckets/resumes/objects/${encodeURIComponent(resumeKey)}`;

    const pdfResponse = await fetch(storageUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!pdfResponse.ok) {
      console.error(
        "[api/resume/extract] PDF fetch failed:",
        pdfResponse.status,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Failed to download resume from storage",
        },
        { status: 502 },
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const parser = new PDFParse({ data: Buffer.from(pdfBuffer) });
    const textResult = await parser.getText();
    const rawText = textResult.pages.map((p) => p.text).join("\n");

    const result = await extractProfileFromText(rawText);

    if (!result.success) {
      const status = result.retryable ? 503 : 422;
      return NextResponse.json(
        { success: false, error: result.error },
        { status },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[api/resume/extract]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
