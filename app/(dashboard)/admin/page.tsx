"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminService } from "@/lib/api/admin.service";
import { ApiError } from "@/lib/api/client";
import type { AdminStatsResponseDto } from "@/types/api";
import {
  IconUsers,
  IconLink,
  IconClick,
  IconCrown,
  IconUserPlus,
  IconShield,
} from "@tabler/icons-react";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStatsResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await AdminService.getStats();
        setStats(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setIsUnauthorized(true);
        } else {
          setError(err instanceof ApiError ? err.message : "Failed to load stats");
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <IconShield className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-xl font-semibold">Error</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <IconShield className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have admin privileges to access this page.
        </p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: IconUsers, sub: `${stats.newUsersLast7Days} new (7d)` },
    { label: "Total Links", value: stats.totalLinks, icon: IconLink, sub: `${stats.totalClicks.toLocaleString()} clicks` },
    { label: "Total Clicks", value: stats.totalClicks, icon: IconClick, sub: "All time" },
    { label: "Admins", value: stats.adminUsers, icon: IconShield, sub: "With admin role" },
    { label: "Premium", value: stats.premiumSubscriptions, icon: IconCrown, sub: `${stats.activeSubscriptions} active` },
    { label: "Free", value: stats.freeSubscriptions, icon: IconUsers, sub: `${stats.cancelledSubscriptions} cancelled` },
    { label: "Email Users", value: stats.emailUsers, icon: IconUserPlus, sub: `${stats.googleUsers} Google / ${stats.bothUsers} both` },
    { label: "New Users", value: stats.newUsersLast30Days, icon: IconUserPlus, sub: "Last 30 days" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview and management.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-3.5 w-3.5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-xl font-bold tracking-tight">
                {stat.value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}