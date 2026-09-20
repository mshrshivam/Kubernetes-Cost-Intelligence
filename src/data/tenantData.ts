import type { Tenant } from "@/types";

export type SimTeamId = "team-a" | "team-b" | "team-c";

export interface SimStage {
  cpu: number;
  memory: number;
  cost: number;
}

export interface SimTeamProfile {
  id: SimTeamId;
  name: string;
  namespace: string;
  baselineCpu: number;
  baselineMemory: number;
  baselineCost: number;
  stages: readonly SimStage[];
  anomalyPods: number;
  causes: string[];
  recommendation: string;
}

/** Baseline — all teams normal (demo start / reset state) */
export const BASE_TENANTS: Tenant[] = [
  {
    id: "team-a",
    name: "Team A",
    namespace: "team-a",
    cpuUsage: 24,
    memoryUsage: 31,
    estimatedCost: 2340,
    trend: 4.2,
    status: "Normal",
    pods: 6,
    cpuCost: 1280,
    memoryCost: 620,
    storageCost: 280,
    networkCost: 160,
  },
  {
    id: "team-b",
    name: "Team B",
    namespace: "team-b",
    cpuUsage: 46,
    memoryUsage: 52,
    estimatedCost: 4120,
    trend: 8.7,
    status: "Normal",
    pods: 8,
    cpuCost: 2280,
    memoryCost: 1100,
    storageCost: 420,
    networkCost: 320,
  },
  {
    id: "team-c",
    name: "Team C",
    namespace: "team-c",
    cpuUsage: 25,
    memoryUsage: 30,
    estimatedCost: 2300,
    trend: 1.8,
    status: "Normal",
    pods: 7,
    cpuCost: 1180,
    memoryCost: 680,
    storageCost: 260,
    networkCost: 180,
  },
  {
    id: "team-d",
    name: "Team D",
    namespace: "team-d",
    cpuUsage: 18,
    memoryUsage: 22,
    estimatedCost: 760,
    trend: -2.1,
    status: "Normal",
    pods: 3,
    cpuCost: 380,
    memoryCost: 220,
    storageCost: 100,
    networkCost: 60,
  },
];

export const SIM_TEAM_PROFILES: Record<SimTeamId, SimTeamProfile> = {
  "team-a": {
    id: "team-a",
    name: "Team A",
    namespace: "team-a",
    baselineCpu: 24,
    baselineMemory: 31,
    baselineCost: 2340,
    stages: [
      { cpu: 24, memory: 31, cost: 2340 },
      { cpu: 48, memory: 55, cost: 3400 },
      { cpu: 72, memory: 78, cost: 4800 },
      { cpu: 93, memory: 90, cost: 6100 },
    ],
    anomalyPods: 12,
    causes: [
      "Unexpected HPA scale-out",
      "CPU-heavy API traffic spike",
      "Missing resource quotas",
    ],
    recommendation: "Inspect running workloads in namespace team-a.",
  },
  "team-b": {
    id: "team-b",
    name: "Team B",
    namespace: "team-b",
    baselineCpu: 46,
    baselineMemory: 52,
    baselineCost: 4120,
    stages: [
      { cpu: 46, memory: 52, cost: 4120 },
      { cpu: 62, memory: 68, cost: 5200 },
      { cpu: 78, memory: 84, cost: 6800 },
      { cpu: 95, memory: 93, cost: 8450 },
    ],
    anomalyPods: 16,
    causes: [
      "Memory leak in worker pods",
      "Cache footprint explosion",
      "Batch job over-provisioning",
    ],
    recommendation: "Inspect running workloads in namespace team-b.",
  },
  "team-c": {
    id: "team-c",
    name: "Team C",
    namespace: "team-c",
    baselineCpu: 25,
    baselineMemory: 30,
    baselineCost: 2300,
    stages: [
      { cpu: 25, memory: 30, cost: 2300 },
      { cpu: 45, memory: 50, cost: 3100 },
      { cpu: 70, memory: 72, cost: 4200 },
      { cpu: 91, memory: 87, cost: 5230 },
    ],
    anomalyPods: 14,
    causes: [
      "High CPU consumption",
      "Excessive pod replicas",
      "Memory-intensive workload",
    ],
    recommendation: "Inspect running workloads in namespace team-c.",
  },
};

export const SIMULATABLE_TEAMS = Object.values(SIM_TEAM_PROFILES);

/** @deprecated use SIM_TEAM_PROFILES["team-c"].stages */
export const TEAM_C_SIM_STAGES = SIM_TEAM_PROFILES["team-c"].stages;

export function buildAnomalousTenant(teamId: SimTeamId): Tenant {
  const profile = SIM_TEAM_PROFILES[teamId];
  const final = profile.stages[profile.stages.length - 1];
  const baseline = BASE_TENANTS.find((t) => t.id === teamId)!;
  const trend =
    Math.round(((final.cost - profile.baselineCost) / profile.baselineCost) * 1000) / 10;

  return {
    ...baseline,
    cpuUsage: final.cpu,
    memoryUsage: final.memory,
    estimatedCost: final.cost,
    trend,
    status: "Anomaly",
    pods: profile.anomalyPods,
    cpuCost: Math.round(final.cost * 0.55),
    memoryCost: Math.round(final.cost * 0.29),
    storageCost: Math.round(final.cost * 0.1),
    networkCost: Math.round(final.cost * 0.06),
  };
}

export const TEAM_C_ANOMALY = buildAnomalousTenant("team-c");

export function applySimStageToTenant(
  baseline: Tenant,
  teamId: SimTeamId,
  stageIndex: number
): Tenant {
  const profile = SIM_TEAM_PROFILES[teamId];
  const stage = profile.stages[stageIndex];
  const isFinal = stageIndex === profile.stages.length - 1;
  const trend =
    Math.round(((stage.cost - profile.baselineCost) / profile.baselineCost) * 1000) / 10;

  return {
    ...baseline,
    cpuUsage: stage.cpu,
    memoryUsage: stage.memory,
    estimatedCost: stage.cost,
    trend: isFinal ? trend : trend,
    status: isFinal || stage.cpu >= 70 ? "Anomaly" : stage.cpu >= 50 ? "Warning" : "Normal",
    pods: isFinal
      ? profile.anomalyPods
      : Math.min(profile.anomalyPods, baseline.pods + stageIndex * 2),
    cpuCost: Math.round(stage.cost * 0.55),
    memoryCost: Math.round(stage.cost * 0.29),
    storageCost: Math.round(stage.cost * 0.1),
    networkCost: Math.round(stage.cost * 0.06),
  };
}
