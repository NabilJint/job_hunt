import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function GET(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const matchFilter = searchParams.get("matchFilter") || "all";
    const sortBy = searchParams.get("sortBy") || "score";
    const q = searchParams.get("q") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)),
    );

    let query = insforge
      .database.from("jobs")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (matchFilter === "high") {
      query = query.gte("match_score", 70);
    } else if (matchFilter === "low") {
      query = query.lt("match_score", 70);
    }

    if (q.trim()) {
      const searchTerm = q.trim().replace(/'/g, "''");
      query = query.or(
        `company.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`,
      );
    }

    if (sortBy === "score") {
      query = query.order("match_score", { ascending: false });
    } else if (sortBy === "newest") {
      query = query.order("found_at", { ascending: false });
    } else if (sortBy === "oldest") {
      query = query.order("found_at", { ascending: true });
    }

    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data: jobs, count, error: jobsError } = await query;

    if (jobsError) {
      console.error("[api/agent/jobs] Query failed:", jobsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch jobs" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: jobs || [],
      total: count || 0,
    });
  } catch (error) {
    console.error("[api/agent/jobs]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
