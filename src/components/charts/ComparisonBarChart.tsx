"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINR } from "@/services/costService";

interface ComparisonBarChartProps {
  ourCost: number;
  openCost: number;
}

export function ComparisonBarChart({ ourCost, openCost }: ComparisonBarChartProps) {
  const data = [
    { name: "Our Method", cost: ourCost },
    { name: "OpenCost", cost: openCost },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke="rgba(148,163,184,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `₹${v}`}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "#0c1220",
              border: "1px solid rgba(148,163,184,0.12)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => [formatINR(Number(value ?? 0)), "Cost"]}
          />
          <Bar dataKey="cost" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={64} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
