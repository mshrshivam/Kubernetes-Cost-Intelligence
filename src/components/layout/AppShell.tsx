"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ClusterProvider } from "@/context/ClusterContext";
import { ToastProvider } from "@/context/ToastContext";
import { UIProvider, useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

function ShellInner({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100">
      <Sidebar />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[margin] duration-300",
          "lg:ml-0"
        )}
      >
        <TopNav />
        <main
          className={cn(
            "surface-grid flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
            sidebarCollapsed ? "" : ""
          )}
        >
          <div className="mx-auto w-full max-w-[1400px] animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <UIProvider>
        <ClusterProvider>
          <ShellInner>{children}</ShellInner>
        </ClusterProvider>
      </UIProvider>
    </ToastProvider>
  );
}
