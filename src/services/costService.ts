import type { CostPoint, Tenant, TimeRange, ValidationData } from "@/types";
import {
  COST_OVER_TIME_30D,
  COST_OVER_TIME_7D,
  COST_OVER_TIME_7D_SPIKE,
  COST_OVER_TIME_90D,
  VALIDATION_DATA,
  VALIDATION_DATA_BASELINE,
} from "@/data/clusterData";

/**
 * Cost service — currently backed by mock data.
 * Replace implementations with Prometheus / OpenCost / custom API calls later.
 */
export async function fetchCostOverTime(
  range: TimeRange,
  anomalyActive: boolean
): Promise<CostPoint[]> {
  await delay(80);
  if (range === "7d") {
    return anomalyActive ? COST_OVER_TIME_7D_SPIKE : COST_OVER_TIME_7D;
  }
  if (range === "30d") return COST_OVER_TIME_30D;
  return COST_OVER_TIME_90D;
}

export function computeTenantPercentages(tenants: Tenant[]): Array<Tenant & { percentage: number }> {
  const total = tenants.reduce((sum, t) => sum + t.estimatedCost, 0) || 1;
  return tenants.map((t) => ({
    ...t,
    percentage: Math.round((t.estimatedCost / total) * 1000) / 10,
  }));
}

export async function fetchValidationData(anomalyActive: boolean): Promise<ValidationData> {
  await delay(60);
  return anomalyActive ? VALIDATION_DATA : VALIDATION_DATA_BASELINE;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPercent(value: number, signed = false): string {
  const prefix = signed && value > 0 ? "+" : "";
  return `${prefix}${value}%`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
