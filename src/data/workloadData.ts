import type { NamespaceGroup, Workload } from "@/types";

export const BASE_WORKLOADS: Workload[] = [
  {
    id: "w1",
    podName: "api-server-7d8f",
    namespace: "team-a",
    status: "Running",
    cpu: 18,
    memory: 22,
    restarts: 0,
    age: "3d",
    replicas: 3,
  },
  {
    id: "w2",
    podName: "frontend-3c2a",
    namespace: "team-a",
    status: "Running",
    cpu: 12,
    memory: 18,
    restarts: 0,
    age: "3d",
    replicas: 2,
  },
  {
    id: "w3",
    podName: "worker-55ab",
    namespace: "team-b",
    status: "Running",
    cpu: 43,
    memory: 48,
    restarts: 1,
    age: "2d",
    replicas: 4,
  },
  {
    id: "w4",
    podName: "cache-proxy-9f1e",
    namespace: "team-b",
    status: "Running",
    cpu: 28,
    memory: 41,
    restarts: 0,
    age: "5d",
    replicas: 2,
  },
  {
    id: "w5",
    podName: "payment-api",
    namespace: "team-c",
    status: "Running",
    cpu: 22,
    memory: 28,
    restarts: 0,
    age: "8h",
    replicas: 3,
  },
  {
    id: "w6",
    podName: "billing-worker-2a",
    namespace: "team-c",
    status: "Running",
    cpu: 19,
    memory: 24,
    restarts: 0,
    age: "1d",
    replicas: 2,
  },
  {
    id: "w7",
    podName: "analytics-job",
    namespace: "team-d",
    status: "Running",
    cpu: 14,
    memory: 16,
    restarts: 0,
    age: "4d",
    replicas: 1,
  },
  {
    id: "w8",
    podName: "report-svc-1c",
    namespace: "team-d",
    status: "Running",
    cpu: 10,
    memory: 12,
    restarts: 0,
    age: "6d",
    replicas: 1,
  },
];

export const ANOMALY_WORKLOADS: Workload[] = buildAnomalousWorkloads("team-c");

export const BASE_NAMESPACE_GROUPS: NamespaceGroup[] = [
  {
    namespace: "team-a",
    tenantName: "Team A",
    status: "Running",
    cpu: 24,
    memory: 31,
    replicas: 3,
    pods: ["pod-a1", "pod-a2", "pod-a3"],
  },
  {
    namespace: "team-b",
    tenantName: "Team B",
    status: "Running",
    cpu: 46,
    memory: 52,
    replicas: 4,
    pods: ["pod-b1", "pod-b2", "pod-b3", "pod-b4"],
  },
  {
    namespace: "team-c",
    tenantName: "Team C",
    status: "Running",
    cpu: 25,
    memory: 30,
    replicas: 3,
    pods: ["pod-c1", "pod-c2", "pod-c3"],
  },
  {
    namespace: "team-d",
    tenantName: "Team D",
    status: "Running",
    cpu: 18,
    memory: 22,
    replicas: 2,
    pods: ["pod-d1", "pod-d2"],
  },
];

export function buildAnomalousWorkloads(teamId: string): Workload[] {
  const others = BASE_WORKLOADS.filter((w) => w.namespace !== teamId);
  const boosted = BASE_WORKLOADS.filter((w) => w.namespace === teamId).map((w) => ({
    ...w,
    cpu: Math.min(98, w.cpu + 55),
    memory: Math.min(96, w.memory + 50),
    restarts: w.restarts + 4,
    replicas: w.replicas + 4,
  }));

  const extra: Workload = {
    id: `anom-extra-${teamId}`,
    podName: `${teamId}-spike-replica`,
    namespace: teamId,
    status: "Running",
    cpu: 88,
    memory: 84,
    restarts: 3,
    age: "12m",
    replicas: 2,
  };

  return [...others, ...boosted, extra];
}

export function buildAnomalousNamespaceGroups(teamId: string): NamespaceGroup[] {
  const profileName =
    teamId === "team-a" ? "Team A" : teamId === "team-b" ? "Team B" : "Team C";
  const finalCpu = teamId === "team-a" ? 93 : teamId === "team-b" ? 95 : 91;
  const finalMem = teamId === "team-a" ? 90 : teamId === "team-b" ? 93 : 87;
  const replicas = teamId === "team-a" ? 12 : teamId === "team-b" ? 16 : 14;
  const prefix = teamId.replace("team-", "");

  return BASE_NAMESPACE_GROUPS.map((g) => {
    if (g.namespace !== teamId) return g;
    return {
      namespace: teamId,
      tenantName: profileName,
      status: "Running" as const,
      cpu: finalCpu,
      memory: finalMem,
      replicas,
      pods: Array.from({ length: replicas }, (_, i) => `pod-${prefix}${i + 1}`),
    };
  });
}

export const ANOMALY_NAMESPACE_GROUPS = buildAnomalousNamespaceGroups("team-c");
