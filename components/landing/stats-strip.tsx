"use client";

const stats = [
  { label: "Links shortened", value: "2.4M+" },
  { label: "Average redirect", value: "98ms" },
  { label: "Uptime", value: "99.9%" },
];

export function StatsStrip() {
  return (
    <div className="mx-auto flex max-w-lg items-center justify-center gap-8 rounded-xl border bg-card/50 px-8 py-5 backdrop-blur-sm">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-8">
          <div className="text-center">
            <div className="font-mono text-base font-bold text-foreground tracking-tight">
              {stat.value}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div className="hidden h-8 w-px bg-border md:block" />
          )}
        </div>
      ))}
    </div>
  );
}
