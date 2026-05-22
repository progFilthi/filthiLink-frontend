'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { LinksService } from '@/lib/api/links.service';
import type { LinkResponseDto } from '@/types/api';
import { IconPlus, IconCopy, IconCheck, IconLink, IconSearch } from '@tabler/icons-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function LinksPage() {
  const [links, setLinks] = useState<LinkResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await LinksService.getLinks(0, 100);
      setLinks(data.content || []);
    } catch {
      toast.error('Failed to load links.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchLinks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsCreating(true);
    try {
      const response = await LinksService.createLink({ originalUrl: newUrl });
      setLinks((prev) => [response, ...prev]);
      setNewUrl('');
      setIsCreateOpen(false);
      toast.success('Link created successfully.');
    } catch {
      toast.error('Failed to create link.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (url: string, id: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter((link) =>
    link.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage your shortened links.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2">
                <IconPlus className="h-4 w-4" />
                Create Link
              </Button>
            }
          />
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
                <Button type="submit" disabled={isCreating} className="gap-2">
                  {isCreating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  ) : (
                    'Create'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Search */}
      {!isLoading && links.length > 0 && (
        <div className="relative max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Table / Empty State */}
      {!isLoading && links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <IconLink className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-sm font-semibold">No links yet</h3>
          <p className="mb-4 max-w-xs text-sm text-muted-foreground">
            Create your first shortened link to start tracking clicks.
          </p>
          <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <IconPlus className="h-4 w-4" />
            Create Link
          </Button>
        </div>
      ) : !isLoading && links.length > 0 ? (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead className="hidden sm:table-cell">Destination</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="hidden md:table-cell text-right">Expires</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map((link, index) => (
                <TableRow key={link.id || index}>
                  <TableCell className="font-medium">
                    <span className="text-sm">{link.shortUrl}</span>
                  </TableCell>
                  <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground sm:table-cell">
                    {link.originalUrl}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {link.clickCount ?? 0}
                  </TableCell>
                  <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                    {link.expiresAt
                      ? format(new Date(link.expiresAt), 'MMM d, yyyy')
                      : '--'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        link.shortUrl && link.id && handleCopy(link.shortUrl, link.id)
                      }
                    >
                      {copiedId === link.id ? (
                        <IconCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <IconCopy className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
