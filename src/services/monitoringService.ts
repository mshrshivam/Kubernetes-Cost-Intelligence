import type { ClusterMetrics, ClusterNode, NamespaceGroup, Workload } from "@/types";
import {
  ANOMALY_CLUSTER_METRICS,
  ANOMALY_NODES,
  BASE_CLUSTER_METRICS,
  BASE_NODES,
} from "@/data/clusterData";
import {
  BASE_NAMESPACE_GROUPS,
  BASE_WORKLOADS,
  buildAnomalousNamespaceGroups,
  buildAnomalousWorkloads,
} from "@/data/workloadData";
import type { SimTeamId } from "@/data/tenantData";

/**
 * Monitoring service — mock layer for Kubernetes / Prometheus metrics.
 * Swap with real K8s API / Prometheus queries when backend is ready.
 */
export async function fetchClusterMetrics(anomalyActive: boolean): Promise<ClusterMetrics> {
  await delay(50);
  return anomalyActive ? ANOMALY_CLUSTER_METRICS : BASE_CLUSTER_METRICS;
}

export async function fetchNodes(anomalyActive: boolean): Promise<ClusterNode[]> {
  await delay(50);
  return anomalyActive ? ANOMALY_NODES : BASE_NODES;
}

export async function fetchWorkloads(
  anomalyActive: boolean,
  teamId: SimTeamId | null = "team-c"
): Promise<Workload[]> {
  await delay(50);
  if (anomalyActive && teamId) return buildAnomalousWorkloads(teamId);
  return BASE_WORKLOADS;
}

export async function fetchNamespaceGroups(
  anomalyActive: boolean,
  teamId: SimTeamId | null = "team-c"
): Promise<NamespaceGroup[]> {
  await delay(50);
  if (anomalyActive && teamId) return buildAnomalousNamespaceGroups(teamId);
  return BASE_NAMESPACE_GROUPS;
}

/** Simulate live jitter for monitoring charts */
export function jitter(base: number, range = 3): number {
  const delta = (Math.random() - 0.5) * 2 * range;
  return Math.max(0, Math.min(100, Math.round((base + delta) * 10) / 10));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
