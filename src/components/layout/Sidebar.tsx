"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useCluster } from "@/context/ClusterContext";

const SECTIONS = [
  {
    label: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Cost",
    items: [
      { href: "/cost-attribution", label: "Cost Attribution", icon: Wallet },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        href: "/anomaly-detection",
        label: "Anomaly Detection",
        icon: AlertTriangle,
      },
      { href: "/workloads", label: "Workloads", icon: Boxes },
      { href: "/live-monitoring", label: "Live Monitoring", icon: Activity },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/validation", label: "Validation", icon: ShieldCheck },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { metrics, clusterId } = useCluster();

  const nav = (
    <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-2">
      {SECTIONS.map((section) => (
        <div key={section.label}>
          {!sidebarCollapsed && (
            <p className="nav-section-label">{section.label}</p>
          )}
          {sidebarCollapsed && <div className="my-2 h-px bg-white/[0.04]" />}
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                    sidebarCollapsed && "justify-center px-2",
                    active
                      ? "bg-sky-500/[0.12] text-sky-300"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-sky-400" />
                  )}
                  <Icon
                    className={cn(
                      "h-[15px] w-[15px] shrink-0 transition-colors",
                      active
                        ? "text-sky-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[#0c1220] text-slate-300 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.06] bg-[#080d18] transition-all duration-300 lg:static lg:translate-x-0",
          sidebarCollapsed ? "lg:w-[68px]" : "lg:w-[240px]",
          "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-white/[0.06]",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-3"
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-500/15 ring-1 ring-sky-400/20">
              <Hexagon className="h-4 w-4 text-sky-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold tracking-tight text-slate-100">
                  KubeCost
                </p>
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  Intelligence
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="rounded p-1 text-slate-400 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {nav}

        <div className="mt-auto border-t border-white/[0.06] p-2">
          {!sidebarCollapsed ? (
            <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-slate-300">
                    {clusterId}
                  </p>
                  <p className="text-[10px] text-emerald-400/90">
                    {metrics.health}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2" title={`${clusterId} · ${metrics.health}`}>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-2 hidden w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 lg:flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <>
                <ChevronLeft className="h-3.5 w-3.5" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
