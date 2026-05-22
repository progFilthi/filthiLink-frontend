"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  enabled?: boolean;
}

export function AnimatedCounter({
  end,
  duration = 1.5,
  suffix = "",
  prefix = "",
  className,
  enabled = true,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(enabled ? 0 : end);
  const startTime = useRef<number>(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    startTime.current = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };

    raf.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf.current);
  }, [end, duration, enabled]);

  if (!enabled) {
    return (
      <span className={cn("tabular-nums", className)}>
        {prefix}
        {end.toLocaleString()}
        {suffix}
      </span>
    );
  }

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
