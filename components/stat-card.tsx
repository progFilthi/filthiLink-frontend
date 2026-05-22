"use client";

import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animated-counter";
import type { ComponentType } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
  animated?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  animated = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/20",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-foreground">
        {animated ? (
          <AnimatedCounter end={value} />
        ) : (
          value.toLocaleString()
        )}
      </p>

      {hint && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
