"use client";

import { useState } from "react";
import { HardDrive, IndianRupee, MemoryStick, Server } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { TenantDonutChart } from "@/components/charts/TenantDonutChart";
import { TenantTable } from "@/components/tenants/TenantTable";
import { CostBreakdown } from "@/components/tenants/CostBreakdown";
import { Modal } from "@/components/ui/Modal";
import { PageHeader, LoadingBlock } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";
import { formatINR } from "@/services/costService";
import type { Tenant } from "@/types";

export default function CostAttributionPage() {
  const { metrics, tenants, loading } = useCluster();
  const [selected, setSelected] = useState<Tenant | null>(null);

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Attribution"
        subtitle="Understand how shared Kubernetes infrastructure costs are distributed across tenants."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Cost"
          value={formatINR(metrics.totalCost)}
          icon={<IndianRupee className="h-4 w-4" />}
          accent="cyan"
        />
        <MetricCard
          title="Compute Cost"
          value={formatINR(metrics.computeCost)}
          icon={<Server className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          title="Memory Cost"
          value={formatINR(metrics.memoryCost)}
          icon={<MemoryStick className="h-4 w-4" />}
          accent="amber"
        />
        <MetricCard
          title="Storage / Network"
          value={formatINR(metrics.storageNetworkCost)}
          icon={<HardDrive className="h-4 w-4" />}
          accent="slate"
        />
      </div>

      <TenantDonutChart tenants={tenants} title="Tenant Cost Distribution" size="lg" />

      <div>
        <h3 className="mb-3 text-[13px] font-semibold tracking-tight text-slate-100">
          Detailed Attribution
        </h3>
        <TenantTable
          tenants={tenants}
          detailed
          showActions
          onViewDetails={setSelected}
        />
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.name} — Cost Details` : "Details"}
      >
        {selected && <CostBreakdown tenant={selected} />}
      </Modal>
    </div>
  );
}
