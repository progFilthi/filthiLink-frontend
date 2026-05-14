'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconLink, IconClick, IconKey, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { LinksService } from '@/lib/api/links.service';
import { ApiKeysService } from '@/lib/api/api-keys.service';

export default function DashboardPage() {
  const { email } = useAuthStore();
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    apiKeys: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [linksResponse, keysResponse] = await Promise.all([
          LinksService.getLinks(0, 100),
          ApiKeysService.getKeys(),
        ]);

        const totalLinks = linksResponse.totalElements || 0;
        const apiKeys = keysResponse.length || 0;
        
        // Sum up clicks from the fetched links 
        // Note: For a real dashboard, the backend should provide a dedicated stats endpoint
        const totalClicks = (linksResponse.content || []).reduce(
          (sum, link) => sum + (link.clickCount || 0), 
          0
        );

        setStats({ totalLinks, totalClicks, apiKeys });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {email}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="sm" className="gap-2" nativeButton={false} render={<Link href="/dashboard/links" />}>
          <IconPlus className="h-4 w-4" />
          Create Link
        </Button>
        <Button variant="outline" size="sm" className="gap-2" nativeButton={false} render={<Link href="/dashboard/api-keys" />}>
          <IconKey className="h-4 w-4" />
          Manage API Keys
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Links
            </CardTitle>
            <IconLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {isLoading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted"></span>
              ) : (
                stats.totalLinks
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first link to get started
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <IconClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {isLoading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted"></span>
              ) : (
                stats.totalClicks
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all your links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              API Keys
            </CardTitle>
            <IconKey className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {isLoading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted"></span>
              ) : (
                stats.apiKeys
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Active API keys
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            1. Create your first shortened link from the{' '}
            <Link href="/dashboard/links" className="font-medium text-foreground underline-offset-4 hover:underline">
              Links page
            </Link>
            .
          </p>
          <p>
            2. Generate an API key to integrate with your applications from the{' '}
            <Link href="/dashboard/api-keys" className="font-medium text-foreground underline-offset-4 hover:underline">
              API Keys page
            </Link>
            .
          </p>
          <p>3. Track clicks and manage your links from the dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
