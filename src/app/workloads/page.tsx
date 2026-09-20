"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { WorkloadTable } from "@/components/workloads/WorkloadTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageHeader, LoadingBlock } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";

export default function WorkloadsPage() {
  const { workloads, namespaceGroups, loading } = useCluster();
  const [search, setSearch] = useState("");
  const [namespace, setNamespace] = useState("all");

  const namespaces = useMemo(
    () => Array.from(new Set(workloads.map((w) => w.namespace))),
    [workloads]
  );

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kubernetes Workloads"
        subtitle="Cluster workloads grouped by namespace with live CPU and memory attribution."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {namespaceGroups.map((g) => (
          <div
            key={g.namespace}
            className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-4 transition hover:border-white/[0.1]"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold tracking-tight text-slate-100">
                {g.namespace}
              </p>
              <StatusBadge status={g.status} />
            </div>
            <p className="mb-3 text-[11px] text-slate-500">{g.tenantName}</p>
            <p className="text-[11px] text-slate-500">
              Pods:{" "}
              <span className="font-mono text-slate-400">
                {g.pods.slice(0, 4).join(", ")}
                {g.pods.length > 4 ? ` +${g.pods.length - 4}` : ""}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <p className="text-slate-600">CPU</p>
                <p className="font-semibold tabular-nums text-slate-200">{g.cpu}%</p>
              </div>
              <div>
                <p className="text-slate-600">Memory</p>
                <p className="font-semibold tabular-nums text-slate-200">{g.memory}%</p>
              </div>
              <div>
                <p className="text-slate-600">Replicas</p>
                <p className="font-semibold tabular-nums text-slate-200">{g.replicas}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pods or namespaces…"
            className="w-full rounded-md border border-white/[0.08] bg-[#0c1220] py-2 pl-9 pr-3 text-[13px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-500/40"
          />
        </div>
        <select
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          className="rounded-md border border-white/[0.08] bg-[#0c1220] px-3 py-2 text-[13px] text-slate-200 outline-none focus:border-sky-500/40"
        >
          <option value="all">All namespaces</option>
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>
              {ns}
            </option>
          ))}
        </select>
      </div>

      <WorkloadTable workloads={workloads} search={search} namespace={namespace} />
    </div>
  );
}
