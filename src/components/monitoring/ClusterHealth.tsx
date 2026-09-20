"use client";

import type { ClusterNode } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Activity } from "lucide-react";

interface ClusterHealthProps {
  nodes: ClusterNode[];
  health: string;
  lastUpdated: string;
}

export function ClusterHealth({ nodes, health, lastUpdated }: ClusterHealthProps) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Activity className="h-3.5 w-3.5 text-sky-400" />
          <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
            Cluster Nodes
          </h3>
          <StatusBadge status={health} />
        </div>
        <p className="text-[11px] text-slate-600">Last updated: {lastUpdated}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.1em] text-slate-600">
              <th className="px-3 py-2 font-medium">Node</th>
              <th className="px-3 py-2 font-medium">CPU</th>
              <th className="px-3 py-2 font-medium">Memory</th>
              <th className="px-3 py-2 font-medium">Pods</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n) => (
              <tr key={n.id} className="border-b border-white/[0.04]">
                <td className="px-3 py-2.5 font-mono text-[11px] text-slate-200">
                  {n.name}
                </td>
                <td className="px-3 py-2.5 tabular-nums text-slate-400">{n.cpu}%</td>
                <td className="px-3 py-2.5 tabular-nums text-slate-400">{n.memory}%</td>
                <td className="px-3 py-2.5 tabular-nums text-slate-400">{n.pods}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={n.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
