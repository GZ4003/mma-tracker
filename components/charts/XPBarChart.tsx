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

interface XPBarChartProps {
  data: Array<{ date: string; xp: number }>;
}

export default function XPBarChart({ data }: XPBarChartProps) {
  const abbreviatedData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="w-full h-64 bg-goat-surface rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={abbreviatedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(107, 114, 128, 0.1)"
          />
          <XAxis
            dataKey="dateLabel"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#12121A",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              borderRadius: "8px",
              color: "#F5F5F5",
            }}
            cursor={{ fill: "rgba(232, 255, 0, 0.1)" }}
          />
          <Bar dataKey="xp" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
