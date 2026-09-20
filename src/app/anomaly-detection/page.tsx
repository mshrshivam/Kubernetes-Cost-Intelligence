"use client";

import { useMemo, useState } from "react";
import { AnomalyCard } from "@/components/anomalies/AnomalyCard";
import { SimulationControls } from "@/components/anomalies/SimulationControls";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageHeader, LoadingBlock } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";
import { formatINR } from "@/services/costService";
import type { Anomaly } from "@/types";
import { cn } from "@/lib/utils";
import { SIM_TEAM_PROFILES } from "@/data/tenantData";

export default function AnomalyDetectionPage() {
  const {
    anomalies,
    tenants,
    metrics,
    loading,
    isSimulating,
    isAnomalyActive,
    simStage,
    selectedSimTeam,
    setSelectedSimTeam,
    activeSimTeam,
    simulateAnomaly,
    resetSimulation,
  } = useCluster();
  const [selected, setSelected] = useState<Anomaly | null>(null);

  const watchTeamId = activeSimTeam ?? selectedSimTeam;
  const profile = SIM_TEAM_PROFILES[watchTeamId];
  const watched = tenants.find((t) => t.id === watchTeamId);
  const critical = anomalies.filter((a) => a.severity === "CRITICAL").length;
  const warning = anomalies.filter((a) => a.severity === "WARNING").length;

  const liveMeters = useMemo(
    () => [
      { label: "CPU", value: watched?.cpuUsage ?? profile.baselineCpu },
      { label: "Memory", value: watched?.memoryUsage ?? profile.baselineMemory },
    ],
    [watched, profile]
  );

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anomaly Detection"
        subtitle="Identify unusual resource consumption and unexpected cost increases."
      />

      <SimulationControls
        isSimulating={isSimulating}
        isAnomalyActive={isAnomalyActive}
        selectedSimTeam={selectedSimTeam}
        onSelectTeam={setSelectedSimTeam}
        activeSimTeam={activeSimTeam}
        onSimulate={simulateAnomaly}
        onReset={resetSimulation}
        simStage={simStage}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Anomalies Detected" value={String(metrics.anomaliesDetected)} />
        <Stat label="Critical" value={String(critical)} tone="rose" />
        <Stat label="Warning" value={String(warning)} tone="amber" />
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
              {profile.name} — Live Resource Trace
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Namespace {profile.namespace} · baseline CPU {profile.baselineCpu}% · Memory{" "}
              {profile.baselineMemory}% · Cost {formatINR(profile.baselineCost)}
            </p>
          </div>
          <StatusBadge status={watched?.status ?? "Normal"} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {liveMeters.map((m) => (
            <div key={m.label}>
              <div className="mb-1.5 flex justify-between text-[11px] text-slate-500">
                <span>{m.label}</span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    m.value >= 70 ? "text-rose-400" : "text-slate-200"
                  )}
                >
                  {m.value}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    m.value >= 70
                      ? "bg-rose-500"
                      : m.value >= 45
                        ? "bg-amber-400"
                        : "bg-sky-400"
                  )}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
          <div>
            <div className="mb-1.5 flex justify-between text-[11px] text-slate-500">
              <span>Estimated Cost</span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  (watched?.estimatedCost ?? 0) > profile.baselineCost * 1.3
                    ? "text-rose-400"
                    : "text-slate-200"
                )}
              >
                {formatINR(watched?.estimatedCost ?? profile.baselineCost)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  (watched?.estimatedCost ?? 0) > profile.baselineCost * 1.8
                    ? "bg-rose-500"
                    : (watched?.estimatedCost ?? 0) > profile.baselineCost * 1.3
                      ? "bg-amber-400"
                      : "bg-sky-400"
                )}
                style={{
                  width: `${Math.min(
                    100,
                    ((watched?.estimatedCost ?? profile.baselineCost) /
                      (profile.baselineCost * 3)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
        {(isAnomalyActive || (isSimulating && (simStage ?? 0) >= 2)) && (
          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-rose-500/25 bg-rose-500/[0.08] px-3.5 py-3 text-[13px] text-rose-100">
            <span className="mt-1 h-2 w-2 shrink-0 animate-pulse-dot rounded-full bg-rose-400" />
            <span>
              ANOMALY DETECTED — {profile.name} is consuming significantly more resources
              than its normal baseline.
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
          Anomaly List
        </h3>
        {anomalies.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/[0.08] px-6 py-12 text-center text-[13px] text-slate-600">
            No anomalies detected. Cluster consumption is within baseline.
          </div>
        ) : (
          anomalies.map((a) => (
            <AnomalyCard
              key={a.id}
              anomaly={a}
              onViewDetails={setSelected}
              highlight={a.severity === "CRITICAL" && isAnomalyActive}
            />
          ))
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Anomaly Details"
        wide
      >
        {selected && <AnomalyDetails anomaly={selected} />}
      </Modal>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string;
  tone?: "slate" | "rose" | "amber";
}) {
  const tones = {
    slate: "text-slate-100",
    rose: "text-rose-400",
    amber: "text-amber-400",
  };
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-600">
        {label}
      </p>
      <p className={`mt-2 text-[26px] font-semibold tabular-nums tracking-tight ${tones[tone]}`}>
        {value}
      </p>
    </div>
  );
}

function AnomalyDetails({ anomaly }: { anomaly: Anomaly }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={anomaly.severity} />
        <span className="font-semibold text-slate-100">{anomaly.tenantName}</span>
        <span className="font-mono text-xs text-slate-500">/ {anomaly.namespace}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {anomaly.expectedCpu !== undefined && (
          <>
            <Detail label="Expected CPU" value={`${anomaly.expectedCpu}%`} />
            <Detail label="Current CPU" value={`${anomaly.currentCpu}%`} danger />
          </>
        )}
        {anomaly.expectedMemory !== undefined && (
          <>
            <Detail label="Expected Memory" value={`${anomaly.expectedMemory}%`} />
            <Detail
              label="Current Memory"
              value={`${anomaly.currentMemory}%`}
              danger
            />
          </>
        )}
        {anomaly.expectedCost !== undefined && (
          <>
            <Detail label="Expected Cost" value={formatINR(anomaly.expectedCost)} />
            <Detail
              label="Current Cost"
              value={formatINR(anomaly.currentCost ?? 0)}
              danger
            />
          </>
        )}
      </div>

      {anomaly.expectedCost && anomaly.currentCost && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3">
          <p className="text-xs text-slate-400">Cost Increase</p>
          <p className="text-lg font-semibold text-rose-300">
            +
            {Math.round(
              ((anomaly.currentCost - anomaly.expectedCost) / anomaly.expectedCost) * 100
            )}
            %
          </p>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Possible Causes
        </p>
        <ul className="list-inside list-disc space-y-1 text-slate-300">
          {anomaly.possibleCauses.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Recommended investigation
        </p>
        <p className="mt-1 text-slate-300">{anomaly.recommendation}</p>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-1 font-semibold ${danger ? "text-rose-400" : "text-slate-200"}`}
      >
        {value}
      </p>
    </div>
  );
}
