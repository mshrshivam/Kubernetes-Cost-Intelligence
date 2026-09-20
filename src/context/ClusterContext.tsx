"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Anomaly,
  ClusterMetrics,
  ClusterNode,
  CostPoint,
  NamespaceGroup,
  NotificationItem,
  Tenant,
  TimeRange,
  ValidationData,
  Workload,
} from "@/types";
import {
  fetchAnomalies,
  fetchTenants,
  getSimTeamProfile,
  getSimulationStages,
} from "@/services/anomalyService";
import {
  fetchClusterMetrics,
  fetchNamespaceGroups,
  fetchNodes,
  fetchWorkloads,
} from "@/services/monitoringService";
import { fetchCostOverTime, fetchValidationData } from "@/services/costService";
import { useToast } from "@/context/ToastContext";
import type { SimTeamId } from "@/data/tenantData";

interface ClusterContextValue {
  clusterId: string;
  setClusterId: (id: string) => void;
  metrics: ClusterMetrics;
  tenants: Tenant[];
  anomalies: Anomaly[];
  workloads: Workload[];
  namespaceGroups: NamespaceGroup[];
  nodes: ClusterNode[];
  costSeries: CostPoint[];
  timeRange: TimeRange;
  setTimeRange: (r: TimeRange) => void;
  validation: ValidationData;
  isSimulating: boolean;
  isAnomalyActive: boolean;
  simStage: number | null;
  selectedSimTeam: SimTeamId;
  setSelectedSimTeam: (id: SimTeamId) => void;
  activeSimTeam: SimTeamId | null;
  notifications: NotificationItem[];
  markNotificationsRead: () => void;
  simulateAnomaly: () => void;
  resetSimulation: () => void;
  loading: boolean;
}

const ClusterContext = createContext<ClusterContextValue | null>(null);

export function ClusterProvider({ children }: { children: ReactNode }) {
  const { pushToast } = useToast();
  const [clusterId, setClusterId] = useState("prod-mumbai-01");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAnomalyActive, setIsAnomalyActive] = useState(false);
  const [simStage, setSimStage] = useState<number | null>(null);
  const [selectedSimTeam, setSelectedSimTeam] = useState<SimTeamId>("team-c");
  const [activeSimTeam, setActiveSimTeam] = useState<SimTeamId | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ClusterMetrics | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [namespaceGroups, setNamespaceGroups] = useState<NamespaceGroup[]>([]);
  const [nodes, setNodes] = useState<ClusterNode[]>([]);
  const [costSeries, setCostSeries] = useState<CostPoint[]>([]);
  const [validation, setValidation] = useState<ValidationData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "Memory threshold warning",
      message: "Team B memory usage is above baseline.",
      timestamp: "22m ago",
      read: false,
      type: "warning",
    },
    {
      id: "n2",
      title: "Unexpected pod scaling",
      message: "Team A scaled from 3 to 6 pods.",
      timestamp: "1h ago",
      read: false,
      type: "warning",
    },
  ]);

  const simTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeTeamRef = useRef<SimTeamId | null>(null);

  const refresh = useCallback(
    async (
      anomalyActive: boolean,
      stage: number | null,
      teamId: SimTeamId | null
    ) => {
      const [m, t, a, w, ng, n, c, v] = await Promise.all([
        fetchClusterMetrics(anomalyActive),
        fetchTenants(anomalyActive, stage, teamId),
        fetchAnomalies(anomalyActive, teamId),
        fetchWorkloads(anomalyActive, teamId),
        fetchNamespaceGroups(anomalyActive, teamId),
        fetchNodes(anomalyActive),
        fetchCostOverTime(timeRange, anomalyActive),
        fetchValidationData(anomalyActive),
      ]);

      if (stage !== null && !anomalyActive && teamId) {
        const stages = getSimulationStages(teamId);
        const progress = stage / (stages.length - 1);
        const tenantTotal = t.reduce((sum, tenant) => sum + tenant.estimatedCost, 0);
        setMetrics({
          ...m,
          totalCost: tenantTotal,
          cpuUtilization: Math.round(m.cpuUtilization + progress * 16),
          memoryUtilization: Math.round(m.memoryUtilization + progress * 12),
          pods: Math.round(m.pods + progress * 3),
          anomaliesDetected:
            stage >= stages.length - 1 ? m.anomaliesDetected + 1 : m.anomaliesDetected,
          computeCost: Math.round(m.computeCost + progress * (7820 - m.computeCost)),
          memoryCost: Math.round(m.memoryCost + progress * (2930 - m.memoryCost)),
        });
      } else if (anomalyActive) {
        const tenantTotal = t.reduce((sum, tenant) => sum + tenant.estimatedCost, 0);
        setMetrics({
          ...m,
          totalCost: tenantTotal,
        });
      } else {
        setMetrics(m);
      }

      setTenants(t);
      setAnomalies(a);
      setWorkloads(w);
      setNamespaceGroups(ng);
      setNodes(n);
      setCostSeries(c);
      setValidation({
        ...v,
        calculatedCost: anomalyActive
          ? t.reduce((sum, tenant) => sum + tenant.estimatedCost, 0)
          : v.calculatedCost,
        openCostReference: anomalyActive
          ? t.reduce((sum, tenant) => sum + tenant.estimatedCost, 0) + 170
          : v.openCostReference,
        difference: 170,
      });
      setLoading(false);
    },
    [timeRange]
  );

  useEffect(() => {
    const teamForFetch = isAnomalyActive || simStage !== null ? activeSimTeam : null;
    void refresh(
      isAnomalyActive,
      isAnomalyActive ? null : simStage,
      teamForFetch
    );
  }, [refresh, isAnomalyActive, simStage, activeSimTeam]);

  useEffect(() => {
    return () => {
      simTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const clearSimTimers = () => {
    simTimerRef.current.forEach(clearTimeout);
    simTimerRef.current = [];
  };

  const simulateAnomaly = useCallback(() => {
    if (isSimulating || isAnomalyActive) return;
    const teamId = selectedSimTeam;
    const profile = getSimTeamProfile(teamId);
    clearSimTimers();
    activeTeamRef.current = teamId;
    setActiveSimTeam(teamId);
    setIsSimulating(true);
    setIsAnomalyActive(false);
    setSimStage(0);

    pushToast({
      title: "Simulation started",
      message: `Injecting anomalous load into ${profile.name} (${profile.namespace})…`,
      type: "info",
    });

    const stages = getSimulationStages(teamId);
    stages.forEach((_, index) => {
      if (index === 0) return;
      const timer = setTimeout(() => {
        setSimStage(index);
        if (index === stages.length - 1) {
          setTimeout(() => {
            setIsAnomalyActive(true);
            setIsSimulating(false);
            setSimStage(null);
            setNotifications((prev) => [
              {
                id: `sim-${Date.now()}`,
                title: "🚨 ANOMALY DETECTED",
                message: `${profile.name} is consuming significantly more resources than its normal baseline.`,
                timestamp: "Just now",
                read: false,
                type: "critical",
              },
              ...prev,
            ]);
            pushToast({
              title: "🚨 ANOMALY DETECTED",
              message: `${profile.name} is consuming significantly more resources than its normal baseline.`,
              type: "critical",
            });
          }, 600);
        }
      }, index * 1200);
      simTimerRef.current.push(timer);
    });
  }, [isSimulating, isAnomalyActive, selectedSimTeam, pushToast]);

  const resetSimulation = useCallback(() => {
    const prev = activeSimTeam ? getSimTeamProfile(activeSimTeam).name : "all teams";
    clearSimTimers();
    setIsSimulating(false);
    setIsAnomalyActive(false);
    setSimStage(null);
    setActiveSimTeam(null);
    activeTeamRef.current = null;
    setNotifications((prevN) =>
      prevN.filter((n) => !n.id.startsWith("sim-") && n.type !== "critical")
    );
    pushToast({
      title: "Simulation reset",
      message: `Cluster restored to baseline. Pick another team to simulate next (last: ${prev}).`,
      type: "info",
    });
  }, [pushToast, activeSimTeam]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleSetSelectedSimTeam = useCallback(
    (id: SimTeamId) => {
      if (isSimulating || isAnomalyActive) return;
      setSelectedSimTeam(id);
    },
    [isSimulating, isAnomalyActive]
  );

  const value = useMemo<ClusterContextValue>(() => {
    const emptyMetrics: ClusterMetrics = {
      totalCost: 0,
      previousMonthCost: 0,
      activeTenants: 0,
      cpuUtilization: 0,
      memoryUtilization: 0,
      anomaliesDetected: 0,
      nodes: 0,
      pods: 0,
      namespaces: 0,
      health: "Healthy",
      networkThroughput: "—",
      computeCost: 0,
      memoryCost: 0,
      storageNetworkCost: 0,
    };

    return {
      clusterId,
      setClusterId,
      metrics: metrics ?? emptyMetrics,
      tenants,
      anomalies,
      workloads,
      namespaceGroups,
      nodes,
      costSeries,
      timeRange,
      setTimeRange,
      validation: validation ?? {
        calculatedCost: 0,
        openCostReference: 0,
        difference: 0,
        reconciliationError: 0,
      },
      isSimulating,
      isAnomalyActive,
      simStage,
      selectedSimTeam,
      setSelectedSimTeam: handleSetSelectedSimTeam,
      activeSimTeam,
      notifications,
      markNotificationsRead,
      simulateAnomaly,
      resetSimulation,
      loading: loading || !metrics || !validation,
    };
  }, [
    clusterId,
    metrics,
    tenants,
    anomalies,
    workloads,
    namespaceGroups,
    nodes,
    costSeries,
    timeRange,
    validation,
    isSimulating,
    isAnomalyActive,
    simStage,
    selectedSimTeam,
    handleSetSelectedSimTeam,
    activeSimTeam,
    notifications,
    markNotificationsRead,
    simulateAnomaly,
    resetSimulation,
    loading,
  ]);

  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>;
}

export function useCluster() {
  const ctx = useContext(ClusterContext);
  if (!ctx) throw new Error("useCluster must be used within ClusterProvider");
  return ctx;
}
