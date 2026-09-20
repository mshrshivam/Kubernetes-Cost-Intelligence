"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CostPoint, TimeRange } from "@/types";
import { formatINR } from "@/services/costService";
import { cn } from "@/lib/utils";

interface CostChartProps {
  data: CostPoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  spike?: boolean;
}

const ranges: { id: TimeRange; label: string }[] = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
];

export function CostChart({ data, timeRange, onTimeRangeChange, spike }: CostChartProps) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
            Cost Over Time
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Estimated Kubernetes infrastructure cost
            {spike ? (
              <span className="text-rose-400"> · spike detected</span>
            ) : null}
          </p>
        </div>
        <div className="flex rounded-md border border-white/[0.06] bg-[#070b14]/80 p-0.5">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onTimeRangeChange(r.id)}
              className={cn(
                "rounded px-2.5 py-1 text-[11px] font-medium transition",
                timeRange === r.id
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="rgba(148,163,184,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `₹${v}`}
              width={52}
            />
            <Tooltip
              cursor={{ stroke: "rgba(56,189,248,0.25)", strokeWidth: 1 }}
              contentStyle={{
                background: "#0c1220",
                border: "1px solid rgba(148,163,184,0.12)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
              }}
              labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value) => [formatINR(Number(value ?? 0)), "Cost"]}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#costFill)"
              animationDuration={700}
              dot={false}
              activeDot={{ r: 4, fill: "#38bdf8", stroke: "#0c1220", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
