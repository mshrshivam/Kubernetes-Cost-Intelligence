"use client";

import type { Anomaly } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnomalyCardProps {
  anomaly: Anomaly;
  onViewDetails: (anomaly: Anomaly) => void;
  highlight?: boolean;
}

export function AnomalyCard({ anomaly, onViewDetails, highlight }: AnomalyCardProps) {
  const critical = anomaly.severity === "CRITICAL";

  return (
    <div
      className={cn(
        "rounded-lg border bg-[#0c1220]/90 p-4 transition-all duration-200 hover:bg-[#111827]",
        critical
          ? "border-rose-500/25 shadow-[0_0_0_1px_rgba(248,113,113,0.08)]"
          : "border-white/[0.06]",
        highlight && "animate-pulse-soft border-rose-500/40"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 items-center justify-center rounded-md ring-1",
              critical
                ? "bg-rose-500/10 text-rose-400 ring-rose-400/20"
                : "bg-amber-500/10 text-amber-400 ring-amber-400/20"
            )}
          >
            {critical ? (
              <Zap className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
          </div>
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <StatusBadge status={anomaly.severity} />
              <span className="text-[13px] font-semibold text-slate-100">
                {anomaly.tenantName}
              </span>
              <span className="font-mono text-[11px] text-slate-600">
                / {anomaly.namespace}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-400">
              {anomaly.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
              <span>
                Resource{" "}
                <span className="text-slate-400">{anomaly.resource}</span>
              </span>
              <span>
                Current{" "}
                <span className="tabular-nums text-slate-300">
                  {anomaly.currentValue}
                </span>
              </span>
              <span>
                Expected{" "}
                <span className="tabular-nums text-slate-400">
                  {anomaly.expectedValue}
                </span>
              </span>
              <span>
                Impact{" "}
                <span className="tabular-nums text-rose-400">{anomaly.costImpact}</span>
              </span>
            </div>
            <p className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-slate-600">
              <Clock className="h-3 w-3" />
              Detected {anomaly.detectedAt}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onViewDetails(anomaly)}
          className="rounded-md border border-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-sky-300 transition hover:border-sky-400/30 hover:bg-sky-500/10"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
