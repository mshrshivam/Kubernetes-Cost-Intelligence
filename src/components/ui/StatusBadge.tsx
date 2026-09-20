import type { AnomalySeverity, TenantStatus } from "@/types";
import { cn } from "@/lib/utils";

type BadgeVariant = TenantStatus | AnomalySeverity | "Healthy" | "Running" | "Degraded";

const DOT: Record<string, string> = {
  Normal: "bg-emerald-400",
  Warning: "bg-amber-400",
  WARNING: "bg-amber-400",
  Anomaly: "bg-rose-400 animate-pulse-dot",
  CRITICAL: "bg-rose-400 animate-pulse-dot",
  INFO: "bg-sky-400",
  Healthy: "bg-emerald-400",
  Running: "bg-emerald-400",
  Degraded: "bg-amber-400",
};

const TEXT: Record<string, string> = {
  Normal: "text-emerald-400",
  Warning: "text-amber-400",
  WARNING: "text-amber-400",
  Anomaly: "text-rose-400",
  CRITICAL: "text-rose-400",
  INFO: "text-sky-400",
  Healthy: "text-emerald-400",
  Running: "text-emerald-400",
  Degraded: "text-amber-400",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BadgeVariant | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide",
        TEXT[status] || "text-slate-400",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          DOT[status] || "bg-slate-400"
        )}
      />
      {status}
    </span>
  );
}
