"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LinksService } from "@/lib/api/links.service";
import type { LinkResponseDto } from "@/types/api";
import { IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";
import { toast } from "sonner";
import { LinkTable } from "@/components/link-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await LinksService.getLinks(0, 100);
        if (!cancelled) {
          setLinks(data.content || []);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load links.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsCreating(true);
    try {
      const response = await LinksService.createLink({ originalUrl: newUrl });
      setLinks((prev) => [response, ...prev]);
      setNewUrl("");
      setIsCreateOpen(false);
      toast.success("Link created successfully.");
    } catch {
      toast.error("Failed to create link.");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !link.expiresAt) ||
      (statusFilter === "expired" && link.expiresAt);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your shortened links.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <IconPlus className="h-4 w-4" />
              Create Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new link</DialogTitle>
              <DialogDescription>
                Paste your long URL below to generate a short link.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="originalUrl">Destination URL</Label>
                  <Input
                    id="originalUrl"
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating} className="gap-1.5">
                  {isCreating ? (
                    <LoadingSpinner className="text-primary-foreground" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!isLoading && links.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as string)}
          >
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <div className="flex items-center gap-2">
                <IconFilter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && (
        <LinkTable
          links={filteredLinks.map((l) => ({
            id: l.id,
            shortUrl: l.shortUrl,
            originalUrl: l.originalUrl,
            clickCount: l.clickCount,
            expiresAt: l.expiresAt,
            status: l.expiresAt ? "expired" : "active",
          }))}
          onCopy={() => {
            toast.success("Copied to clipboard");
          }}
        />
      )}
    </div>
  );
}
