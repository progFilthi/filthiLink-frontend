"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClickChart } from "@/components/click-chart";
import {
  IconCopy,
  IconCheck,
  IconArrowLeft,
  IconExternalLink,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { cn, formatDisplayUrl } from "@/lib/utils";
import { config } from "@/lib/config";
import { format } from "date-fns";

const mockClickData = [
  { date: "2025-05-01", clicks: 120 },
  { date: "2025-05-02", clicks: 85 },
  { date: "2025-05-03", clicks: 210 },
  { date: "2025-05-04", clicks: 156 },
  { date: "2025-05-05", clicks: 89 },
  { date: "2025-05-06", clicks: 234 },
  { date: "2025-05-07", clicks: 178 },
  { date: "2025-05-08", clicks: 145 },
  { date: "2025-05-09", clicks: 267 },
  { date: "2025-05-10", clicks: 198 },
  { date: "2025-05-11", clicks: 312 },
  { date: "2025-05-12", clicks: 256 },
  { date: "2025-05-13", clicks: 189 },
  { date: "2025-05-14", clicks: 223 },
];

const mockCountries = [
  { country: "United States", clicks: 843, flag: "US" },
  { country: "Germany", clicks: 312, flag: "DE" },
  { country: "United Kingdom", clicks: 267, flag: "GB" },
  { country: "India", clicks: 198, flag: "IN" },
  { country: "France", clicks: 145, flag: "FR" },
  { country: "Japan", clicks: 112, flag: "JP" },
];

export default function LinkAnalyticsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const shortUrl = `${config.shortUrl.baseDomain}/${slug}`;
  const totalClicks = mockClickData.reduce((sum, d) => sum + d.clicks, 0);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-80 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/links"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:border-muted-foreground/30 hover:text-foreground"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold tracking-tight">
                {formatDisplayUrl(shortUrl)}
              </h1>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/40 transition-colors hover:text-muted-foreground"
              >
                <IconExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Link analytics and performance
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "h-8 gap-1.5 text-sm",
            copied && "border-primary/30 bg-primary/10 text-primary",
          )}
        >
          {copied ? (
            <>
              <IconCheck className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <IconCopy className="h-3.5 w-3.5" />
              Copy link
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Clicks over time
                  </CardTitle>
                  <CardDescription>Last 14 days</CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
                    {totalClicks.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">total clicks</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ClickChart data={mockClickData} />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Top Countries
              </CardTitle>
              <CardDescription>
                Geographic distribution of clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCountries.map((item) => (
                  <div
                    key={item.country}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded border bg-muted/50 text-[9px] font-medium text-muted-foreground">
                        {item.flag}
                      </span>
                      <span className="text-sm">{item.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary/60"
                          style={{
                            width: `${(item.clicks / mockCountries[0].clicks) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono text-sm tabular-nums text-muted-foreground">
                        {item.clicks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Link Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Created
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{format(new Date(), "MMM d, yyyy")}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Expires
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <IconClock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Never</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Status
                </p>
                <Badge className="mt-1 bg-primary/10 text-primary hover:bg-primary/15">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Short URL
                </p>
                <p className="mt-1 font-mono text-sm">{formatDisplayUrl(shortUrl)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Destination
                </p>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  https://example.com/very-long-destination-url
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
