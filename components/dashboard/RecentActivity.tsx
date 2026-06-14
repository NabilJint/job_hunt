type ActivityItem = {
  type: "job_search" | "company_research";
  text: string;
  timestamp: string;
};

const dotStyles: Record<
  ActivityItem["type"],
  { dotColor: string; dotBg: string }
> = {
  job_search: {
    dotColor: "bg-success-alt",
    dotBg: "bg-success-light",
  },
  company_research: {
    dotColor: "bg-info",
    dotBg: "bg-info-light",
  },
};

export function RecentActivity({
  activities,
}: {
  activities: ActivityItem[];
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] h-full">
      <h3 className="text-text-primary text-[16px] font-semibold leading-[24px]">
        Recent Activity
      </h3>
      <div className="mt-6 flex flex-col gap-5">
        {activities.length === 0 && (
          <p className="text-text-muted text-[14px]">
            No recent activity yet
          </p>
        )}
        {activities.map((item, i) => {
          const styles = dotStyles[item.type];
          return (
            <div key={i} className="flex items-start gap-3">
              <span className="relative mt-1 flex-shrink-0">
                <span
                  className={`block w-4 h-4 rounded-full ${styles.dotBg} flex items-center justify-center`}
                >
                  <span
                    className={`block w-2 h-2 rounded-full ${styles.dotColor}`}
                  />
                </span>
              </span>
              <div className="flex flex-col">
                <p className="text-text-primary text-[14px] font-medium leading-[20px]">
                  {item.text}
                </p>
                <p className="text-text-muted text-[12px] font-normal leading-[16px]">
                  {item.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
