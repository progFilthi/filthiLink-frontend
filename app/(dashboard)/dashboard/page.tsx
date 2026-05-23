"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/animated-counter";
import { LinksService } from "@/lib/api/links.service";
import { ApiError } from "@/lib/api/client";
import type { LinkResponseDto } from "@/types/api";
import { IconLink, IconClick, IconPlus, IconCheck, IconArrowRight } from "@tabler/icons-react";
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

  const steps = [
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
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back,{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/dashboard/links">
            <IconPlus className="h-4 w-4" />
            New Link
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <AnimatedCounter end={stat.value} enabled={countersEnabled} />
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="space-y-0">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={cn(
                  "flex items-center gap-3 py-3",
                  i !== steps.length - 1 && "border-b",
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
                  {item.done ? (
                    <IconCheck className="h-3 w-3" />
                  ) : (
                    item.step
                  )}
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
        </CardContent>
      </Card>

      {stats.totalLinks > 0 && (
        <div className="flex justify-center">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/dashboard/links">
              View all links
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
