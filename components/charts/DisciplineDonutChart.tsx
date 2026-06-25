"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DISCIPLINES } from "@/lib/constants";
import type { Discipline } from "@/types";

interface DisciplineDonutChartProps {
  data: Record<Discipline, number>;
}

export default function DisciplineDonutChart({
  data,
}: DisciplineDonutChartProps) {
  const chartData = DISCIPLINES.filter((d) => data[d.value] > 0).map((d) => ({
    name: d.label,
    value: data[d.value],
    fill: d.color,
  }));

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 bg-goat-surface rounded-lg p-4 flex items-center justify-center">
        <p className="text-goat-muted text-sm">No training data yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-goat-surface rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#12121A",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              borderRadius: "8px",
              color: "#F5F5F5",
            }}
          />
          <Legend wrapperStyle={{ color: "#6B7280", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
