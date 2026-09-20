"use client";

import { MetricCard } from "@/components/ui/MetricCard";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import { PageHeader, LoadingBlock } from "@/components/layout/PageHeader";
import { useCluster } from "@/context/ClusterContext";
import { formatINR } from "@/services/costService";
import { GitCompare, Percent, Scale } from "lucide-react";

export default function ValidationPage() {
  const { validation, loading } = useCluster();

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Validation"
        subtitle="OpenCost is used as a reference baseline for validating our calculated Kubernetes costs."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Our Calculated Cost"
          value={formatINR(validation.calculatedCost)}
          icon={<Scale className="h-4 w-4" />}
          accent="cyan"
        />
        <MetricCard
          title="OpenCost Reference"
          value={formatINR(validation.openCostReference)}
          icon={<GitCompare className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          title="Difference"
          value={formatINR(validation.difference)}
          icon={<Scale className="h-4 w-4" />}
          accent="amber"
        />
        <MetricCard
          title="Reconciliation Error"
          value={`${validation.reconciliationError}%`}
          icon={<Percent className="h-4 w-4" />}
          accent="slate"
        />
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
        <h3 className="text-[13px] font-semibold tracking-tight text-slate-100">
          Method Comparison
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Our attribution engine vs OpenCost reference total
        </p>
        <div className="mt-4">
          <ComparisonBarChart
            ourCost={validation.calculatedCost}
            openCost={validation.openCostReference}
          />
        </div>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-5">
        <h3 className="mb-2 text-[13px] font-semibold tracking-tight text-slate-100">
          Why OpenCost?
        </h3>
        <p className="max-w-3xl text-[13px] leading-relaxed text-slate-500">
          Our attribution engine calculates tenant-level cost based on resource
          consumption. OpenCost provides infrastructure-level cost information that can
          be used as a reference for validation. A low reconciliation error indicates
          that our allocation model tracks real cluster spend closely while adding
          namespace-level attribution that OpenCost alone does not emphasize for
          multi-tenant FinOps workflows.
        </p>
      </div>
    </div>
  );
}
