"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDisplayUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconCopy, IconCheck, IconExternalLink, IconChartBar } from "@tabler/icons-react";
import Link from "next/link";

interface ResultCardProps {
  shortUrl: string;
  originalUrl?: string;
  slug?: string;
  className?: string;
}

export function ResultCard({
  shortUrl,
  originalUrl,
  slug,
  className,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Your shortened link
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 truncate"
                >
                  <span className="font-mono text-base font-semibold text-foreground">
                    {formatDisplayUrl(shortUrl)}
                  </span>
                  <IconExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                </a>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "h-8 gap-1.5 text-sm",
                  copied && "border-primary/30 bg-primary/10 text-primary",
                )}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <IconCheck className="h-3.5 w-3.5" />
                      Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <IconCopy className="h-3.5 w-3.5" />
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {slug && (
            <div className="mt-4 flex items-center gap-3 border-t pt-4">
              <Link
                href={`/dashboard/${slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                <IconChartBar className="h-3.5 w-3.5" />
                View analytics
              </Link>
              {originalUrl && (
                <span className="hidden truncate text-xs text-muted-foreground sm:block">
                  &rarr; {originalUrl}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
