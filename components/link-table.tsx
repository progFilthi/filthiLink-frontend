"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconTrash,
  IconEdit,
  IconLink,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";

interface LinkItem {
  id: number;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  expiresAt: string | null;
  status?: "active" | "expired";
}

interface LinkTableProps {
  links: LinkItem[];
  className?: string;
  onCopy?: (url: string, id: number) => void;
  onDelete?: (id: number) => void;
}

export function LinkTable({
  links,
  className,
  onCopy,
  onDelete,
}: LinkTableProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (url: string, id: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    if (onCopy) onCopy(url, id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSlug = (shortUrl: string) => {
    try {
      const parts = shortUrl.split("/");
      return parts[parts.length - 1];
    } catch {
      return "";
    }
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <IconLink className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-semibold">No links yet</h3>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Create your first shortened link to start tracking clicks.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-medium text-muted-foreground">
              Short URL
            </TableHead>
            <TableHead className="hidden text-xs font-medium text-muted-foreground sm:table-cell">
              Destination
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              Clicks
            </TableHead>
            <TableHead className="hidden text-right text-xs font-medium text-muted-foreground md:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden text-right text-xs font-medium text-muted-foreground md:table-cell">
              Created
            </TableHead>
            <TableHead className="w-[90px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id} className="group">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/${getSlug(link.shortUrl)}`}
                    className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.shortUrl}
                  </Link>
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden text-muted-foreground/40 transition-colors hover:text-muted-foreground md:block"
                  >
                    <IconExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </TableCell>
              <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground sm:table-cell">
                {link.originalUrl}
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-md bg-muted px-2 py-0.5 font-mono text-sm tabular-nums font-semibold">
                  {link.clickCount ?? 0}
                </span>
              </TableCell>
              <TableCell className="hidden text-right md:table-cell">
                <Badge
                  variant={
                    link.status === "expired" ? "secondary" : "default"
                  }
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wider",
                    link.status === "active" &&
                      "bg-primary/10 text-primary",
                    link.status === "expired" &&
                      "bg-muted/50 text-muted-foreground",
                  )}
                >
                  {link.status || "active"}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                {format(new Date(), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      link.shortUrl && handleCopy(link.shortUrl, link.id)
                    }
                  >
                    {copiedId === link.id ? (
                      <IconCheck className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <IconCopy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="h-7 w-7 text-muted-foreground hover:text-red-400"
                      onClick={() => onDelete(link.id)}
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
