"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCopy,
  IconCheck,
  IconArrowLeft,
  IconExternalLink,
} from "@tabler/icons-react";
import { cn, formatDisplayUrl } from "@/lib/utils";
import { config } from "@/lib/config";

export default function LinkAnalyticsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);

  const shortUrl = `${config.shortUrl.baseDomain}/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              Link analytics
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

      <p className="text-center text-sm text-muted-foreground py-16">
        Analytics are coming soon.
      </p>
    </div>
  );
}
