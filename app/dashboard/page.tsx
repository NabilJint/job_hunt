import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CompanyResearchChart } from "@/components/dashboard/CompanyResearchChart";
import { JobsOverTimeChart } from "@/components/dashboard/JobsOverTimeChart";
import { MatchScoreChart } from "@/components/dashboard/MatchScoreChart";
import { createInsforgeServer } from "@/lib/insforge-server";
import { formatRelativeTime } from "@/lib/utils";

function toDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

async function getDashboardData(userId: string) {
  const insforge = await createInsforgeServer();

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: allJobs } = await insforge.database
    .from("jobs")
    .select("match_score, company_research, found_at")
    .eq("user_id", userId);

  const jobs = allJobs || [];

  const totalJobs = jobs.length;
  const avgMatchRate =
    totalJobs > 0
      ? Math.round(
          jobs.reduce((sum, j) => sum + (j.match_score || 0), 0) / totalJobs,
        )
      : 0;
  const companiesResearched = jobs.filter(
    (j) =>
      j.company_research &&
      typeof j.company_research === "object" &&
      Object.keys(j.company_research).length > 0,
  ).length;
  const jobsThisWeek = jobs.filter(
    (j) => j.found_at && j.found_at >= oneWeekAgo,
  ).length;

  const jobsOverTimeMap = new Map<string, number>();
  for (const job of jobs) {
    if (!job.found_at) continue;
    const date = new Date(job.found_at).toISOString().slice(0, 10);
    jobsOverTimeMap.set(date, (jobsOverTimeMap.get(date) || 0) + 1);
  }
  const jobsOverTime = Array.from(jobsOverTimeMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day: toDayLabel(day), count }));

  const researchMap = new Map<string, number>();
  for (const job of jobs) {
    if (
      !job.found_at ||
      !job.company_research ||
      typeof job.company_research !== "object" ||
      Object.keys(job.company_research).length === 0
    )
      continue;
    const date = new Date(job.found_at).toISOString().slice(0, 10);
    researchMap.set(date, (researchMap.get(date) || 0) + 1);
  }
  const companyResearchActivity = Array.from(researchMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day: toDayLabel(day), count }));

  const scores = jobs
    .map((j) => j.match_score)
    .filter((s): s is number => s !== null);
  const bins = [
    { range: "50-60%", min: 50, max: 60 },
    { range: "60-70%", min: 60, max: 70 },
    { range: "70-80%", min: 70, max: 80 },
    { range: "80-90%", min: 80, max: 90 },
    { range: "90-100%", min: 90, max: 100 },
  ];
  const matchScoreDistribution = bins.map(({ range, min, max }) => ({
    range,
    count: scores.filter(
      (s) => s >= min && (max === 100 ? s <= max : s < max),
    ).length,
  }));

  return {
    stats: { totalJobs, avgMatchRate, companiesResearched, jobsThisWeek },
    jobsOverTime,
    companyResearchActivity,
    matchScoreDistribution,
  };
}




async function getRecentActivity(userId: string) {
  const insforge = await createInsforgeServer();

  const [agentRuns, recentJobs] = await Promise.all([
    insforge.database
      .from("agent_runs")
      .select("job_title_searched, jobs_found, completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(10),
    insforge.database
      .from("jobs")
      .select("company, found_at, company_research")
      .eq("user_id", userId)
      .order("found_at", { ascending: false })
      .limit(20),
  ]);

  const activities: Array<{
    type: "job_search" | "company_research";
    text: string;
    timestamp: string;
    date: Date;
  }> = [];

  for (const run of agentRuns.data || []) {
    if (run.completed_at) {
      activities.push({
        type: "job_search",
        text: `Found ${run.jobs_found} jobs for ${run.job_title_searched}`,
        timestamp: formatRelativeTime(run.completed_at),
        date: new Date(run.completed_at),
      });
    }
  }

  for (const job of recentJobs.data || []) {
    if (
      job.company_research &&
      typeof job.company_research === "object" &&
      Object.keys(job.company_research).length > 0
    ) {
      activities.push({
        type: "company_research",
        text: `Researched ${job.company}`,
        timestamp: formatRelativeTime(job.found_at),
        date: new Date(job.found_at),
      });
    }
  }

  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  return activities.slice(0, 10);
}

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [dashboard, activities] = await Promise.all([
    getDashboardData(user.id),
    getRecentActivity(user.id),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6">
        <StatsBar
          totalJobs={dashboard.stats.totalJobs}
          avgMatchRate={dashboard.stats.avgMatchRate}
          companiesResearched={dashboard.stats.companiesResearched}
          jobsThisWeek={dashboard.stats.jobsThisWeek}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities} />
          <CompanyResearchChart data={dashboard.companyResearchActivity} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <JobsOverTimeChart data={dashboard.jobsOverTime} />
          </div>
          <div className="lg:col-span-2">
            <MatchScoreChart data={dashboard.matchScoreDistribution} />
          </div>
        </div>
      </main>
    </div>
  );
}
