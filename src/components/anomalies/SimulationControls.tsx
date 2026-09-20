"use client";

import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIMULATABLE_TEAMS, type SimTeamId } from "@/data/tenantData";

interface SimulationControlsProps {
  isSimulating: boolean;
  isAnomalyActive: boolean;
  selectedSimTeam: SimTeamId;
  onSelectTeam: (id: SimTeamId) => void;
  activeSimTeam: SimTeamId | null;
  onSimulate: () => void;
  onReset: () => void;
  simStage: number | null;
}

export function SimulationControls({
  isSimulating,
  isAnomalyActive,
  selectedSimTeam,
  onSelectTeam,
  activeSimTeam,
  onSimulate,
  onReset,
  simStage,
}: SimulationControlsProps) {
  const locked = isSimulating || isAnomalyActive;
  const selected = SIMULATABLE_TEAMS.find((t) => t.id === selectedSimTeam);
  const active = activeSimTeam
    ? SIMULATABLE_TEAMS.find((t) => t.id === activeSimTeam)
    : null;

  return (
    <div className="rounded-lg border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.07] via-[#0c1220] to-[#0c1220] p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold tracking-tight text-sky-200">
              Live Demo Controls
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
              Pick a tenant, simulate an anomaly, then reset and try another team.
              {isSimulating && simStage !== null && (
                <span className="ml-1 text-sky-300">
                  Stage {simStage + 1}/4 — injecting load into{" "}
                  {active?.name ?? selected?.name}…
                </span>
              )}
              {isAnomalyActive && !isSimulating && active && (
                <span className="ml-1 text-rose-300">
                  Anomaly active on {active.name}. Reset to simulate a different team.
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSimulate}
              disabled={locked}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-[12px] font-semibold transition",
                locked
                  ? "cursor-not-allowed bg-white/[0.04] text-slate-600"
                  : "bg-rose-600 text-white shadow-lg shadow-rose-950/40 hover:bg-rose-500"
              )}
            >
              <Play className="h-3.5 w-3.5" />
              Simulate {selected?.name ?? "Anomaly"}
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isSimulating || (!isAnomalyActive && simStage === null)}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-[12px] font-semibold transition",
                isSimulating || (!isAnomalyActive && simStage === null)
                  ? "cursor-not-allowed border-white/[0.04] text-slate-700"
                  : "border-white/[0.1] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Simulation
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Target tenant
          </p>
          <div className="flex flex-wrap gap-2">
            {SIMULATABLE_TEAMS.map((team) => {
              const isSelected = selectedSimTeam === team.id;
              const isActive = activeSimTeam === team.id && isAnomalyActive;
              return (
                <button
                  key={team.id}
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectTeam(team.id)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-[11px] transition",
                    locked && "cursor-not-allowed opacity-50",
                    isActive && "border-rose-500/40 bg-rose-500/10 text-rose-200",
                    !isActive &&
                      isSelected &&
                      "border-sky-500/40 bg-sky-500/10 text-sky-200",
                    !isActive &&
                      !isSelected &&
                      "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/10 hover:text-slate-300"
                  )}
                >
                  <span className="block font-semibold">{team.name}</span>
                  <span className="font-mono text-[10px] opacity-60">
                    {team.namespace}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
