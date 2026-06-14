"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  day: string;
  count: number;
};

type Props = {
  data: ChartData[];
};

export function CompanyResearchChart({ data }: Props) {
  const hasData = data.length > 0 && data.some((d) => d.count > 0);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] h-full">
      <h3 className="text-text-primary text-[16px] font-semibold leading-[24px]">
        Company Research Activity
      </h3>
      <div className="mt-6 h-[250px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E7EAF3"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E7EAF3",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="count"
              fill="#61A8FF"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary text-sm">
            No data yet
          </div>
        )}
      </div>
    </div>
  );
}
