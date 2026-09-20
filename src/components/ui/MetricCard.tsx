"use client";

import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  accent?: "cyan" | "emerald" | "amber" | "rose" | "slate";
  pulse?: boolean;
  sparkline?: number[];
}

const accentStyles = {
  cyan: {
    icon: "text-sky-400 bg-sky-500/10 ring-sky-400/20",
    spark: "#38bdf8",
  },
  emerald: {
    icon: "text-emerald-400 bg-emerald-500/10 ring-emerald-400/20",
    spark: "#34d399",
  },
  amber: {
    icon: "text-amber-400 bg-amber-500/10 ring-amber-400/20",
    spark: "#fbbf24",
  },
  rose: {
    icon: "text-rose-400 bg-rose-500/10 ring-rose-400/20",
    spark: "#f87171",
  },
  slate: {
    icon: "text-slate-300 bg-white/[0.04] ring-white/10",
    spark: "#94a3b8",
  },
};

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-80" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  accent = "cyan",
  pulse,
  sparkline,
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-4 transition-all duration-200 hover:border-white/[0.1] hover:bg-[#111827]",
        pulse && "animate-pulse-soft border-rose-500/30 shadow-glow-danger"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-slate-50 tabular-nums">
            {value}
          </p>
          {(trend !== undefined || subtitle) && (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
              {trend !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium tabular-nums",
                    trend >= 0 ? "text-rose-400" : "text-emerald-400"
                  )}
                >
                  {trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
              )}
              {(trendLabel || subtitle) && (
                <span className="text-slate-600">{trendLabel || subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md ring-1",
              styles.icon
            )}
          >
            {icon}
          </div>
          {sparkline && sparkline.length > 1 && (
            <MiniSpark data={sparkline} color={styles.spark} />
          )}
        </div>
      </div>
    </div>
  );
}
