"use client";

import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-slate-50 sm:text-[24px]">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-slate-500">
          {subtitle}
        </p>
      </div>
      {actions}
    </div>
  );
}

export function LoadingBlock() {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-white/[0.06] bg-[#0c1220]/60">
      <div className="flex items-center gap-3 text-[13px] text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
        Loading cluster data…
      </div>
    </div>
  );
}
