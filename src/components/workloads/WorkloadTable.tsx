"use client";

import type { Workload } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface WorkloadTableProps {
  workloads: Workload[];
  search: string;
  namespace: string;
}

export function WorkloadTable({ workloads, search, namespace }: WorkloadTableProps) {
  const filtered = workloads.filter((w) => {
    const matchNs = namespace === "all" || w.namespace === namespace;
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      w.podName.toLowerCase().includes(q) ||
      w.namespace.toLowerCase().includes(q);
    return matchNs && matchQ;
  });

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.08] bg-[#0c1220]/40 px-6 py-16 text-center">
        <p className="text-[13px] font-medium text-slate-400">No workloads found</p>
        <p className="mt-1 text-[12px] text-slate-600">
          Try adjusting search or namespace filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#0c1220]/90">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.1em] text-slate-600">
              <th className="px-4 py-3 font-medium">Pod Name</th>
              <th className="px-4 py-3 font-medium">Namespace</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">CPU</th>
              <th className="px-4 py-3 font-medium">Memory</th>
              <th className="px-4 py-3 font-medium">Restarts</th>
              <th className="px-4 py-3 font-medium">Age</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr
                key={w.id}
                className="border-b border-white/[0.04] transition hover:bg-white/[0.025]"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-slate-200">
                  {w.podName}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                  {w.namespace}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={w.status} />
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-400">{w.cpu}%</td>
                <td className="px-4 py-3 tabular-nums text-slate-400">{w.memory}%</td>
                <td className="px-4 py-3 tabular-nums text-slate-400">{w.restarts}</td>
                <td className="px-4 py-3 text-slate-500">{w.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
