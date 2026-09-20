"use client";

import type { Tenant } from "@/types";
import { formatINR } from "@/services/costService";

export function CostBreakdown({ tenant }: { tenant: Tenant }) {
  const rows = [
    { label: "CPU", value: tenant.cpuCost },
    { label: "Memory", value: tenant.memoryCost },
    { label: "Storage", value: tenant.storageCost },
    { label: "Network", value: tenant.networkCost },
  ];
  const total = tenant.estimatedCost || 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 text-[13px]">
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Namespace
          </p>
          <p className="mt-1 font-mono text-[12px] text-slate-200">{tenant.namespace}</p>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">Pods</p>
          <p className="mt-1 font-semibold tabular-nums text-slate-200">{tenant.pods}</p>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            CPU Usage
          </p>
          <p className="mt-1 font-semibold tabular-nums text-slate-200">
            {tenant.cpuUsage}%
          </p>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Memory Usage
          </p>
          <p className="mt-1 font-semibold tabular-nums text-slate-200">
            {tenant.memoryUsage}%
          </p>
        </div>
      </div>

      <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[12px] font-medium text-slate-400">Estimated Cost</p>
          <p className="text-lg font-semibold tabular-nums text-sky-300">
            {formatINR(tenant.estimatedCost)}
          </p>
        </div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          Cost Breakdown
        </p>
        <ul className="space-y-2.5">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                <span>
                  {row.label} → {formatINR(row.value)}
                </span>
                <span className="tabular-nums">
                  {((row.value / total) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-sky-400/70"
                  style={{ width: `${(row.value / total) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
