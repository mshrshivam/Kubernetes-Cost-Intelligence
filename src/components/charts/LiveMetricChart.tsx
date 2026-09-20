"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { jitter } from "@/services/monitoringService";

interface LiveMetricChartProps {
  label: string;
  baseValue: number;
  unit?: string;
  color?: string;
}

export function LiveMetricChart({
  label,
  baseValue,
  unit = "%",
  color = "#38bdf8",
}: LiveMetricChartProps) {
  const [points, setPoints] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      i,
      value: jitter(baseValue, 2),
    }))
  );
  const [current, setCurrent] = useState(baseValue);

  useEffect(() => {
    setCurrent(baseValue);
  }, [baseValue]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = jitter(baseValue, 2.5);
      setCurrent(next);
      setPoints((prev) => {
        const shifted = prev.slice(1).map((p, idx) => ({ ...p, i: idx }));
        return [...shifted, { i: prev.length - 1, value: next }];
      });
    }, 2000);
    return () => clearInterval(id);
  }, [baseValue]);

  const gradId = `live-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c1220]/90 p-4">
      <div className="mb-2 flex items-end justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">
          {label}
        </p>
        <p className="text-xl font-semibold tabular-nums tracking-tight text-slate-100">
          {current}
          {unit}
        </p>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip
              contentStyle={{
                background: "#0c1220",
                border: "1px solid rgba(148,163,184,0.12)",
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(value) => [`${value}${unit}`, label]}
              labelFormatter={() => ""}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#${gradId})`}
              strokeWidth={1.5}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
