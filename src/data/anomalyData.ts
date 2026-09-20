import type { Anomaly } from "@/types";
import {
  SIM_TEAM_PROFILES,
  type SimTeamId,
  buildAnomalousTenant,
} from "@/data/tenantData";

export const BASE_ANOMALIES: Anomaly[] = [
  {
    id: "anom-warn-b",
    severity: "WARNING",
    tenantId: "team-b",
    tenantName: "Team B",
    namespace: "team-b",
    resource: "Memory",
    title: "Memory usage above normal threshold",
    description: "Memory usage above normal threshold",
    currentValue: "52%",
    expectedValue: "38%",
    costImpact: "+₹340",
    detectedAt: "22 minutes ago",
    expectedMemory: 38,
    currentMemory: 52,
    expectedCost: 3780,
    currentCost: 4120,
    possibleCauses: [
      "Elevated cache footprint",
      "Memory-intensive batch jobs",
      "Missing resource limits on sidecar",
    ],
    recommendation:
      "Inspect running workloads in namespace team-b and review memory requests/limits.",
  },
  {
    id: "anom-warn-a",
    severity: "WARNING",
    tenantId: "team-a",
    tenantName: "Team A",
    namespace: "team-a",
    resource: "Pods",
    title: "Unexpected pod scaling",
    description: "Unexpected pod scaling",
    currentValue: "6 pods",
    expectedValue: "3 pods",
    costImpact: "+₹180",
    detectedAt: "1 hour ago",
    expectedCost: 2160,
    currentCost: 2340,
    possibleCauses: [
      "HPA scale-out event",
      "Burst traffic on API endpoints",
      "Misconfigured replica count",
    ],
    recommendation: "Review HPA events and recent deployments in namespace team-a.",
  },
];

export function buildCriticalAnomaly(teamId: SimTeamId): Anomaly {
  const profile = SIM_TEAM_PROFILES[teamId];
  const anomalous = buildAnomalousTenant(teamId);
  const costDelta = anomalous.estimatedCost - profile.baselineCost;
  const costPct = Math.round((costDelta / profile.baselineCost) * 100);

  return {
    id: `anom-crit-${teamId}`,
    severity: "CRITICAL",
    tenantId: profile.id,
    tenantName: profile.name,
    namespace: profile.namespace,
    resource: "CPU",
    title: `CPU usage increased from ${profile.baselineCpu}% to ${anomalous.cpuUsage}%`,
    description: `CPU usage increased from ${profile.baselineCpu}% to ${anomalous.cpuUsage}%. Cost increased by ${costPct}%.`,
    currentValue: `${anomalous.cpuUsage}%`,
    expectedValue: `${profile.baselineCpu}%`,
    costImpact: `+₹${costDelta.toLocaleString("en-IN")}`,
    detectedAt: "Just now",
    expectedCpu: profile.baselineCpu,
    currentCpu: anomalous.cpuUsage,
    expectedMemory: profile.baselineMemory,
    currentMemory: anomalous.memoryUsage,
    expectedCost: profile.baselineCost,
    currentCost: anomalous.estimatedCost,
    possibleCauses: profile.causes,
    recommendation: profile.recommendation,
  };
}

export const TEAM_C_CRITICAL_ANOMALY = buildCriticalAnomaly("team-c");
