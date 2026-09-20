"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Tenant } from "@/types";
import { computeTenantPercentages, formatINR } from "@/services/costService";

const COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#a78bfa"];

interface TenantDonutChartProps {
  tenants: Tenant[];
  title?: string;
  size?: "md" | "lg";
}

export function TenantDonutChart({
  tenants,
  title = "Tenant Cost Distribution",
  size = "md",
}: TenantDonutChartProps) {
  const data = computeTenantPercentages(tenants).map((t) => ({
    name: t.name,
    value: t.estimatedCost,
    percentage: t.percentage,
  }));
  const total = data.reduce((s, d) => s + d.value, 0);
  const height = size === "lg" ? 300 : 240;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
      <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
        {title}
      </h3>
      <p className="mt-0.5 text-[11px] text-slate-500">
        Share of attributed cluster cost
      </p>
      <div className="relative mt-2 flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={size === "lg" ? 72 : 58}
                outerRadius={size === "lg" ? 100 : 84}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0c1220",
                  border: "1px solid rgba(148,163,184,0.12)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, name, item) => {
                  const pct = (item?.payload as { percentage?: number })?.percentage;
                  return [`${formatINR(Number(value ?? 0))} (${pct}%)`, String(name)];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">Total</p>
            <p className="text-sm font-semibold tabular-nums text-slate-100">
              {formatINR(total)}
            </p>
          </div>
        </div>
        <ul className="w-full space-y-2 sm:max-w-[170px]">
          {data.map((d, i) => (
            <li
              key={d.name}
              className="flex items-center justify-between gap-2 rounded-md px-1 py-1 text-[11px] transition hover:bg-white/[0.03]"
            >
              <span className="flex items-center gap-2 text-slate-400">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                {d.name}
              </span>
              <span className="font-medium tabular-nums text-slate-200">
                {d.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
