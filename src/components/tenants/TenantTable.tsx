"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { Tenant } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatPercent } from "@/services/costService";
import { cn } from "@/lib/utils";

interface TenantTableProps {
  tenants: Tenant[];
  onViewDetails?: (tenant: Tenant) => void;
  showActions?: boolean;
  detailed?: boolean;
}

export function TenantTable({
  tenants,
  onViewDetails,
  showActions,
  detailed,
}: TenantTableProps) {
  const total = tenants.reduce((s, t) => s + t.estimatedCost, 0) || 1;

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#0c1220]/90">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.1em] text-slate-600">
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Namespace</th>
              {detailed ? (
                <>
                  <th className="px-4 py-3 font-medium">CPU Cost</th>
                  <th className="px-4 py-3 font-medium">Memory Cost</th>
                  <th className="px-4 py-3 font-medium">Storage Cost</th>
                  <th className="px-4 py-3 font-medium">Network Cost</th>
                  <th className="px-4 py-3 font-medium">Total Cost</th>
                  <th className="px-4 py-3 font-medium">Percentage</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 font-medium">CPU</th>
                  <th className="px-4 py-3 font-medium">Memory</th>
                  <th className="px-4 py-3 font-medium">Est. Cost</th>
                  <th className="px-4 py-3 font-medium">Trend</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </>
              )}
              {showActions && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr
                key={t.id}
                className={cn(
                  "border-b border-white/[0.04] transition-colors hover:bg-white/[0.025]",
                  t.status === "Anomaly" && "bg-rose-500/[0.04]"
                )}
              >
                <td className="px-4 py-3 font-medium text-slate-200">{t.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                  {t.namespace}
                </td>
                {detailed ? (
                  <>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {formatINR(t.cpuCost)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {formatINR(t.memoryCost)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {formatINR(t.storageCost)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {formatINR(t.networkCost)}
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums text-slate-100">
                      {formatINR(t.estimatedCost)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {((t.estimatedCost / total) * 100).toFixed(1)}%
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {t.cpuUsage}%
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-400">
                      {t.memoryUsage}%
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums text-slate-100">
                      {formatINR(t.estimatedCost)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] font-medium tabular-nums",
                          t.trend >= 0 ? "text-rose-400" : "text-emerald-400"
                        )}
                      >
                        {t.trend >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercent(t.trend, true)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </>
                )}
                {showActions && (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails?.(t)}
                      className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-sky-300 transition hover:border-sky-400/30 hover:bg-sky-500/10"
                    >
                      View Details
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
