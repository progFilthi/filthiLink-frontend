"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface ClickChartProps {
  data: Array<{ date: string; clicks: number }>;
  className?: string;
}

export function ClickChart({ data, className }: ClickChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex h-64 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground",
          className,
        )}
      >
        No click data available yet
      </div>
    );
  }

  const maxClicks = Math.max(...data.map((d) => d.clicks));

  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--muted-foreground)",
              fontSize: 11,
              fontFamily: "Geist Mono, monospace",
            }}
            dy={8}
            tickFormatter={(val) => {
              const d = new Date(val);
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--muted-foreground)",
              fontSize: 11,
              fontFamily: "Geist Mono, monospace",
            }}
            dx={-4}
            allowDecimals={false}
            domain={[0, maxClicks + maxClicks * 0.1]}
          />
          <Tooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length || !label)
                return null;
              return (
                <div className="rounded-xl border bg-popover/95 px-3 py-2 text-sm shadow-sm backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground">
                    {new Date(label as string).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-mono text-base font-bold text-foreground">
                    {payload[0].value?.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      clicks
                    </span>
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#clickGradient)"
            activeDot={{
              r: 4,
              fill: "var(--primary)",
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
