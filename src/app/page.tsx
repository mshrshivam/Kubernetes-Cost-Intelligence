"use client";

import {
  AlertTriangle,
  Cpu,
  IndianRupee,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { CostChart } from "@/components/charts/CostChart";
import { TenantDonutChart } from "@/components/charts/TenantDonutChart";
import { TenantTable } from "@/components/tenants/TenantTable";
import { PageHeader, LoadingBlock } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";
import { formatINR, formatPercent } from "@/services/costService";

export default function DashboardPage() {
  const {
    metrics,
    tenants,
    costSeries,
    timeRange,
    setTimeRange,
    isAnomalyActive,
    isSimulating,
    activeSimTeam,
    selectedSimTeam,
    loading,
  } = useCluster();

  const simTeamId = activeSimTeam ?? selectedSimTeam;
  const simTenant = tenants.find((t) => t.id === simTeamId);
  const simName = simTenant?.name ?? "Team C";

  const monthDelta =
    metrics.previousMonthCost > 0
      ? Math.round(
          ((metrics.totalCost - metrics.previousMonthCost) /
            metrics.previousMonthCost) *
            1000
        ) / 10
      : 0;

  const costSpark = costSeries.map((p) => p.cost);
  const cpuSpark = [48, 52, 50, 55, 58, 54, metrics.cpuUtilization];
  const anomalySpark = [1, 1, 2, 2, 2, metrics.anomaliesDetected];

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kubernetes Cost Intelligence"
        subtitle="Monitor shared infrastructure costs and resource anomalies."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Cost"
          value={formatINR(metrics.totalCost)}
          trend={monthDelta}
          trendLabel="/ month vs prior"
          icon={<IndianRupee className="h-4 w-4" />}
          accent="cyan"
          pulse={isAnomalyActive || isSimulating}
          sparkline={costSpark.length > 1 ? costSpark : undefined}
        />
        <MetricCard
          title="Active Tenants"
          value={String(metrics.activeTenants)}
          subtitle="namespaces monitored"
          icon={<Users className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          title="CPU Utilization"
          value={`${metrics.cpuUtilization}%`}
          subtitle="cluster average"
          icon={<Cpu className="h-4 w-4" />}
          accent="amber"
          pulse={isSimulating}
          sparkline={cpuSpark}
        />
        <MetricCard
          title="Anomalies"
          value={String(metrics.anomaliesDetected)}
          subtitle={
            isAnomalyActive ? "1 Critical" : "active alerts"
          }
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={metrics.anomaliesDetected > 2 ? "rose" : "amber"}
          pulse={isAnomalyActive}
          sparkline={anomalySpark}
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CostChart
            data={costSeries}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            spike={isAnomalyActive}
          />
        </div>
        <div className="xl:col-span-2">
          <TenantDonutChart tenants={tenants} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
            Tenant Overview
          </h3>
          <p className="text-[11px] text-slate-600">
            Live attributed cost · trends vs baseline
          </p>
        </div>
        <TenantTable tenants={tenants} />
      </div>

      {(isAnomalyActive || isSimulating) && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-500/25 bg-rose-500/[0.07] px-4 py-3 text-[13px] text-rose-200 shadow-glow-danger">
          <span className="mt-0.5 h-2 w-2 shrink-0 animate-pulse-dot rounded-full bg-rose-400" />
          <div>
            {isSimulating
              ? `Simulation in progress — ${simName} resource consumption is climbing above baseline.`
              : `ANOMALY DETECTED — ${simName} cost ${formatPercent(
                  simTenant?.trend ?? 0,
                  true
                )} vs baseline. Inspect Anomaly Detection for details.`}
          </div>
        </div>
      )}
    </div>
  );
}
