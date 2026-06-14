import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL!;
    const apiKey = process.env.INSFORGE_ADMIN_KEY!;

    const storageUrl = `${baseUrl}/api/storage/buckets/resumes/objects/${encodeURIComponent(key)}`;
    const response = await fetch(storageUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      console.error("Resume fetch failed:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch resume" },
        { status: 502 },
      );
    }

    const buffer = await response.arrayBuffer();
    const filename = (key.split("/").pop() || "resume.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error("Resume view error:", err?.message || err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
