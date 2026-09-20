"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, User } from "lucide-react";
import { useCluster } from "@/context/ClusterContext";
import { CLUSTERS } from "@/data/clusterData";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/cost-attribution": "Cost Attribution",
  "/anomaly-detection": "Anomaly Detection",
  "/workloads": "Workloads",
  "/live-monitoring": "Live Monitoring",
  "/validation": "Cost Validation",
  "/settings": "Settings",
};

export function TopNav() {
  const pathname = usePathname();
  const {
    clusterId,
    setClusterId,
    metrics,
    notifications,
    markNotificationsRead,
  } = useCluster();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([href]) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href)
    )?.[1] ?? "KubeCost";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#070b14]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="ml-10 min-w-0 lg:ml-0">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="hidden text-slate-600 sm:inline">KubeCost</span>
          <span className="hidden text-slate-700 sm:inline">/</span>
          <h1 className="truncate font-medium tracking-tight text-slate-100">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 md:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-slate-200">{clusterId}</p>
            <p className="text-[10px] text-emerald-400/80">{metrics.health}</p>
          </div>
          <div className="mx-1 h-4 w-px bg-white/[0.08]" />
          <label className="relative">
            <span className="sr-only">Select cluster</span>
            <select
              value={clusterId}
              onChange={(e) => setClusterId(e.target.value)}
              className="appearance-none bg-transparent py-0.5 pr-5 text-[11px] font-medium text-slate-400 outline-none hover:text-slate-200"
            >
              {CLUSTERS.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0c1220]">
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-600" />
          </label>
        </div>

        <div className="hidden h-5 w-px bg-white/[0.08] sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifs((v) => !v);
              if (!showNotifs) markNotificationsRead();
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c1220] shadow-2xl shadow-black/50 animate-slide-in">
              <div className="border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Notifications
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-8 text-center text-xs text-slate-500">
                    No notifications
                  </li>
                ) : (
                  notifications.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "border-b border-white/[0.04] px-4 py-3 transition hover:bg-white/[0.02]",
                        n.type === "critical" && "bg-rose-500/[0.06]"
                      )}
                    >
                      <p className="text-xs font-medium text-slate-200">{n.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        {n.message}
                      </p>
                      <p className="mt-1.5 text-[10px] text-slate-600">{n.timestamp}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-indigo-500/20 text-sky-200 ring-1 ring-white/10 transition hover:ring-sky-400/30"
          aria-label="User profile"
        >
          <User className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
