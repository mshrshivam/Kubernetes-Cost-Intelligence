"use client";

import { useEffect, useState } from "react";
import { Boxes, Cpu, Network, Server } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { LiveMetricChart } from "@/components/charts/LiveMetricChart";
import { ClusterHealth } from "@/components/monitoring/ClusterHealth";
import { PageHeader, LoadingBlock } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";
import { relativeTimeLabel } from "@/lib/utils";

export default function LiveMonitoringPage() {
  const { metrics, nodes, loading } = useCluster();
  const [secondsAgo, setSecondsAgo] = useState(10);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo((s) => (s >= 12 ? 3 : s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Cluster Monitoring"
        subtitle="Real-time view of node health, pod density, and resource pressure."
        actions={
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Nodes"
          value={String(metrics.nodes)}
          icon={<Server className="h-4 w-4" />}
          accent="cyan"
        />
        <MetricCard
          title="Pods"
          value={String(metrics.pods)}
          icon={<Boxes className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          title="Namespaces"
          value={String(metrics.namespaces)}
          icon={<Network className="h-4 w-4" />}
          accent="amber"
        />
        <MetricCard
          title="Cluster Health"
          value={metrics.health}
          icon={<Cpu className="h-4 w-4" />}
          accent="emerald"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <LiveMetricChart
          label="CPU Usage"
          baseValue={metrics.cpuUtilization}
          color="#38bdf8"
        />
        <LiveMetricChart
          label="Memory"
          baseValue={metrics.memoryUtilization}
          color="#34d399"
        />
        <LiveMetricChart
          label="Pod Count"
          baseValue={metrics.pods}
          unit=""
          color="#fbbf24"
        />
        <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">
            Network
          </p>
          <p className="mt-5 text-xl font-semibold tabular-nums tracking-tight text-slate-100">
            {metrics.networkThroughput}
          </p>
          <p className="mt-2 text-[11px] text-slate-600">Aggregate ingress + egress</p>
        </div>
      </div>

      <ClusterHealth
        nodes={nodes}
        health={metrics.health}
        lastUpdated={relativeTimeLabel(secondsAgo)}
      />
    </div>
  );
}
