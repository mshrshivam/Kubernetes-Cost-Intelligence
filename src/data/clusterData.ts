import type { ClusterMetrics, ClusterNode, CostPoint, ValidationData } from "@/types";

export const CLUSTERS = [
  { id: "prod-mumbai-01", name: "prod-mumbai-01" },
  { id: "staging-01", name: "staging-01" },
  { id: "dev-sandbox", name: "dev-sandbox" },
] as const;

export const BASE_CLUSTER_METRICS: ClusterMetrics = {
  totalCost: 9520,
  previousMonthCost: 8800,
  activeTenants: 4,
  cpuUtilization: 52,
  memoryUtilization: 42,
  anomaliesDetected: 2,
  nodes: 3,
  pods: 24,
  namespaces: 4,
  health: "Healthy",
  networkThroughput: "1.4 GB/s",
  computeCost: 5820,
  memoryCost: 2280,
  storageNetworkCost: 1420,
};

/** Metrics when Team C is anomalous (post-simulation) */
export const ANOMALY_CLUSTER_METRICS: ClusterMetrics = {
  totalCost: 12450,
  previousMonthCost: 11480,
  activeTenants: 4,
  cpuUtilization: 68,
  memoryUtilization: 54,
  anomaliesDetected: 3,
  nodes: 3,
  pods: 27,
  namespaces: 4,
  health: "Healthy",
  networkThroughput: "1.8 GB/s",
  computeCost: 7820,
  memoryCost: 2930,
  storageNetworkCost: 1700,
};

export const COST_OVER_TIME_7D: CostPoint[] = [
  { label: "Mon", cost: 1420 },
  { label: "Tue", cost: 1580 },
  { label: "Wed", cost: 1620 },
  { label: "Thu", cost: 1890 },
  { label: "Fri", cost: 2010 },
  { label: "Sat", cost: 1950 },
  { label: "Sun", cost: 1980 },
];

export const COST_OVER_TIME_7D_SPIKE: CostPoint[] = [
  { label: "Mon", cost: 1420 },
  { label: "Tue", cost: 1580 },
  { label: "Wed", cost: 1620 },
  { label: "Thu", cost: 1890 },
  { label: "Fri", cost: 2010 },
  { label: "Sat", cost: 1950 },
  { label: "Sun", cost: 2890 },
];

export const COST_OVER_TIME_30D: CostPoint[] = [
  { label: "W1", cost: 9800 },
  { label: "W2", cost: 10420 },
  { label: "W3", cost: 11150 },
  { label: "W4", cost: 10120 },
];

export const COST_OVER_TIME_90D: CostPoint[] = [
  { label: "Jan", cost: 9200 },
  { label: "Feb", cost: 9800 },
  { label: "Mar", cost: 10500 },
  { label: "Apr", cost: 11200 },
  { label: "May", cost: 10850 },
  { label: "Jun", cost: 10120 },
];

export const BASE_NODES: ClusterNode[] = [
  { id: "n1", name: "node-01", cpu: 48, memory: 41, pods: 8, status: "Healthy" },
  { id: "n2", name: "node-02", cpu: 55, memory: 46, pods: 8, status: "Healthy" },
  { id: "n3", name: "node-03", cpu: 53, memory: 39, pods: 8, status: "Healthy" },
];

export const ANOMALY_NODES: ClusterNode[] = [
  { id: "n1", name: "node-01", cpu: 62, memory: 51, pods: 9, status: "Healthy" },
  { id: "n2", name: "node-02", cpu: 71, memory: 57, pods: 10, status: "Healthy" },
  { id: "n3", name: "node-03", cpu: 70, memory: 54, pods: 8, status: "Healthy" },
];

export const VALIDATION_DATA: ValidationData = {
  calculatedCost: 12450,
  openCostReference: 12620,
  difference: 170,
  reconciliationError: 1.35,
};

export const VALIDATION_DATA_BASELINE: ValidationData = {
  calculatedCost: 9520,
  openCostReference: 9680,
  difference: 160,
  reconciliationError: 1.65,
};
