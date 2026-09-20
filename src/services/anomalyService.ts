import type { Anomaly, Tenant } from "@/types";
import { BASE_ANOMALIES, buildCriticalAnomaly } from "@/data/anomalyData";
import {
  BASE_TENANTS,
  SIM_TEAM_PROFILES,
  applySimStageToTenant,
  buildAnomalousTenant,
  type SimTeamId,
} from "@/data/tenantData";

/**
 * Anomaly service — mock detection engine.
 * Replace with custom Python/Node anomaly detection API later.
 */
export async function fetchAnomalies(
  anomalyActive: boolean,
  teamId: SimTeamId | null = "team-c"
): Promise<Anomaly[]> {
  await delay(40);
  if (anomalyActive && teamId) {
    const critical = buildCriticalAnomaly(teamId);
    // Drop soft warnings for the same team so the critical alert is clear
    const others = BASE_ANOMALIES.filter((a) => a.tenantId !== teamId);
    return [{ ...critical, detectedAt: "Just now" }, ...others];
  }
  return BASE_ANOMALIES;
}

export async function fetchTenants(
  anomalyActive: boolean,
  simStage: number | null,
  teamId: SimTeamId | null = "team-c"
): Promise<Tenant[]> {
  await delay(40);

  if (teamId && simStage !== null) {
    const stages = SIM_TEAM_PROFILES[teamId].stages;
    if (simStage >= 0 && simStage < stages.length) {
      return BASE_TENANTS.map((t) =>
        t.id === teamId ? applySimStageToTenant(t, teamId, simStage) : t
      );
    }
  }

  if (anomalyActive && teamId) {
    const anomalous = buildAnomalousTenant(teamId);
    return BASE_TENANTS.map((t) => (t.id === teamId ? anomalous : t));
  }

  return BASE_TENANTS;
}

export function getSimulationStages(teamId: SimTeamId = "team-c") {
  return SIM_TEAM_PROFILES[teamId].stages;
}

export function getSimTeamProfile(teamId: SimTeamId) {
  return SIM_TEAM_PROFILES[teamId];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
