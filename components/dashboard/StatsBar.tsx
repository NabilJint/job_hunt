type StatCard = {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
};

type StatsBarProps = {
  totalJobs: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
};

export function StatsBar({
  totalJobs,
  avgMatchRate,
  companiesResearched,
  jobsThisWeek,
}: StatsBarProps) {
  const stats: StatCard[] = [
    {
      label: "Total Jobs Found",
      value: totalJobs,
      subtitle: "All time",
    },
    {
      label: "Avg. Match Rate",
      value: `${avgMatchRate}%`,
      subtitle: "Across all jobs",
    },
    {
      label: "Companies Researched",
      value: companiesResearched,
      subtitle: "Total researched",
    },
    {
      label: "Jobs This Week",
      value: jobsThisWeek,
      subtitle: "Last 7 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface border border-border rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
        >
          <p className="text-text-secondary text-[14px] font-medium leading-[20px]">
            {stat.label}
          </p>
          <p className="text-text-primary text-[30px] font-semibold leading-[36px] mt-2 tabular-nums">
            {stat.value}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {stat.trend && (
              <span className="inline-block px-2 py-0.5 text-success-darker text-[12px] font-medium leading-[16px] bg-success-lightest rounded">
                {stat.trend}
              </span>
            )}
            {stat.subtitle && (
              <span className="text-text-muted text-[12px] font-normal leading-[16px]">
                {stat.subtitle}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
