export type TenantStatus = "Normal" | "Warning" | "Anomaly";
export type AnomalySeverity = "CRITICAL" | "WARNING" | "INFO";
export type PodStatus = "Running" | "Pending" | "Failed" | "CrashLoopBackOff";
export type NodeStatus = "Healthy" | "Degraded" | "Unhealthy";
export type ClusterStatus = "Healthy" | "Degraded" | "Critical";
export type TimeRange = "7d" | "30d" | "90d";

export interface Tenant {
  id: string;
  name: string;
  namespace: string;
  cpuUsage: number;
  memoryUsage: number;
  estimatedCost: number;
  trend: number;
  status: TenantStatus;
  pods: number;
  cpuCost: number;
  memoryCost: number;
  storageCost: number;
  networkCost: number;
}

export interface CostPoint {
  label: string;
  cost: number;
}

export interface Anomaly {
  id: string;
  severity: AnomalySeverity;
  tenantId: string;
  tenantName: string;
  namespace: string;
  resource: string;
  title: string;
  description: string;
  currentValue: string;
  expectedValue: string;
  costImpact: string;
  detectedAt: string;
  expectedCpu?: number;
  currentCpu?: number;
  expectedMemory?: number;
  currentMemory?: number;
  expectedCost?: number;
  currentCost?: number;
  possibleCauses: string[];
  recommendation: string;
}

export interface Workload {
  id: string;
  podName: string;
  namespace: string;
  status: PodStatus;
  cpu: number;
  memory: number;
  restarts: number;
  age: string;
  replicas: number;
}

export interface NamespaceGroup {
  namespace: string;
  tenantName: string;
  status: PodStatus;
  cpu: number;
  memory: number;
  replicas: number;
  pods: string[];
}

export interface ClusterNode {
  id: string;
  name: string;
  cpu: number;
  memory: number;
  pods: number;
  status: NodeStatus;
}

export interface ClusterMetrics {
  totalCost: number;
  previousMonthCost: number;
  activeTenants: number;
  cpuUtilization: number;
  memoryUtilization: number;
  anomaliesDetected: number;
  nodes: number;
  pods: number;
  namespaces: number;
  health: ClusterStatus;
  networkThroughput: string;
  computeCost: number;
  memoryCost: number;
  storageNetworkCost: number;
}

export interface ValidationData {
  calculatedCost: number;
  openCostReference: number;
  difference: number;
  reconciliationError: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "critical";
}

export interface SimulationState {
  isSimulating: boolean;
  isAnomalyActive: boolean;
  stage: number;
}
