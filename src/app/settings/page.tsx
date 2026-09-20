"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";
import { CLUSTERS } from "@/data/clusterData";

export default function SettingsPage() {
  const {
    clusterId,
    setClusterId,
    isAnomalyActive,
    activeSimTeam,
    resetSimulation,
  } = useCluster();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Demo configuration for KubeCost Intelligence. API endpoints can be wired here later."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
          <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
            Cluster
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Active cluster used across dashboard views.
          </p>
          <label className="mt-4 block text-[11px] text-slate-500">
            Selected cluster
            <select
              value={clusterId}
              onChange={(e) => setClusterId(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-white/[0.08] bg-[#070b14] px-3 py-2 text-[13px] text-slate-200 outline-none focus:border-sky-500/40"
            >
              {CLUSTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
          <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
            Future API Integration
          </h3>
          <ul className="mt-3 space-y-2 text-[12px] text-slate-500">
            <li className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              Prometheus API — metrics scrape endpoint
            </li>
            <li className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              Kubernetes API — workloads & namespaces
            </li>
            <li className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              OpenCost API — reference cost validation
            </li>
            <li className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              Anomaly Detection API — custom Python/Node service
            </li>
          </ul>
          <p className="mt-3 text-[11px] text-slate-600">
            Current data is mock-backed via{" "}
            <code className="text-slate-400">/services</code> and can be swapped without
            rewriting UI components.
          </p>
        </section>

        <section className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5 lg:col-span-2">
          <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
            Demo State
          </h3>
          <p className="mt-1 text-[12px] text-slate-500">
            Simulation status:{" "}
            <span className="text-slate-300">
              {isAnomalyActive && activeSimTeam
                ? `Anomaly active (${activeSimTeam})`
                : "Baseline (normal) — select Team A, B, or C on Anomaly Detection"}
            </span>
          </p>
          {isAnomalyActive && (
            <button
              type="button"
              onClick={resetSimulation}
              className="mt-4 rounded-md border border-white/[0.1] px-3 py-2 text-[12px] font-medium text-slate-200 transition hover:bg-white/[0.04]"
            >
              Reset Simulation from Settings
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
