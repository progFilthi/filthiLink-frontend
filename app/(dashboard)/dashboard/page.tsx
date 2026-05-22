"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/animated-counter";
import { LinksService } from "@/lib/api/links.service";
import { ApiError } from "@/lib/api/client";
import type { LinkResponseDto } from "@/types/api";
import { IconLink, IconClick, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { email, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [countersEnabled, setCountersEnabled] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchStats() {
      try {
        const linksResponse = await LinksService.getLinks(0, 100);

        const linkItems = Array.isArray(linksResponse)
          ? linksResponse
          : linksResponse.content || [];

        const totalClicks = linkItems.reduce(
          (sum: number, link: LinkResponseDto) => sum + (link.clickCount || 0),
          0,
        );

        setStats({
          totalLinks: linkItems.length,
          totalClicks,
          activeLinks: linkItems.length,
        });
      } catch (error) {
        const isAuthError =
          (error instanceof ApiError ||
            (error && typeof error === "object" && "status" in error)) &&
          ((error as { status?: number }).status === 401 ||
            (error as { status?: number }).status === 403);
        if (isAuthError) return;
      } finally {
        setIsLoading(false);
        setCountersEnabled(true);
      }
    }

    fetchStats();
  }, [isAuthenticated]);

  const statCards = [
    {
      label: "Total Links",
      value: stats.totalLinks,
      icon: IconLink,
      hint: stats.totalLinks === 0 ? "Create your first link" : "Across all campaigns",
    },
    {
      label: "Total Clicks",
      value: stats.totalClicks,
      icon: IconClick,
      hint: stats.totalClicks === 0 ? "Start driving traffic" : "All-time click count",
    },
    {
      label: "Active Links",
      value: stats.activeLinks,
      icon: IconLink,
      hint: stats.activeLinks === 0 ? "No active links" : "Currently active",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back,{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          nativeButton={false}
          render={<Link href="/dashboard/links" />}
        >
          <IconPlus className="h-4 w-4" />
          New Link
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <AnimatedCounter
                  end={stat.value}
                  enabled={countersEnabled}
                />
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stat.hint}
            </p>
          </div>
        ))}
      </div>

      <Card>
        <div className="p-5">
          <h3 className="text-sm font-semibold">Getting Started</h3>
        </div>
        <div className="px-5 pb-5">
          <div className="space-y-0">
            {[
              {
                step: "1",
                text: "Create your first shortened link from the ",
                link: { href: "/dashboard/links", label: "Links page" },
                done: stats.totalLinks > 0,
              },
              {
                step: "2",
                text: "Track clicks and manage links from your ",
                link: { href: "/dashboard", label: "Dashboard" },
                done: stats.totalClicks > 0,
              },
              {
                step: "3",
                text: "Integrate via API using keys from the ",
                link: { href: "/dashboard/api-keys", label: "API Keys page" },
                done: false,
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={cn(
                  "flex items-center gap-3 py-3",
                  i !== 2 && "border-b",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    item.done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.done ? "\u2713" : item.step}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.text}
                  <Link
                    href={item.link.href}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.link.label}
                  </Link>
                  .
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
