'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApiKeysService } from '@/lib/api/api-keys.service';
import type { ApiKeyListItemDto } from '@/types/api';
import {
  IconPlus,
  IconCopy,
  IconCheck,
  IconTrash,
  IconKey,
  IconAlertTriangle,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ApiKeysPage() {
  const getDisplayPrefix = (prefix: string) => {
    // Show the first two segments (e.g., sk_live) and mask everything after
    const segments = prefix.split('_');
    if (segments.length >= 2) {
      return `${segments[0]}_${segments[1]}`;
    }
    return prefix;
  };

  const [keys, setKeys] = useState<ApiKeyListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [rawKey, setRawKey] = useState<string | null>(null);
  const [createdKeyPrefix, setCreatedKeyPrefix] = useState<string>('');
  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<ApiKeyListItemDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiKeysService.getKeys();
      setKeys(data);
    } catch {
      setError('Failed to load API keys.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKeys();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchKeys]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setIsCreating(true);
    try {
      const response = await ApiKeysService.createKey({ name: keyName });
      setRawKey(response.rawKey ?? null);
      setCreatedKeyPrefix(response.keyPrefix ?? '');
      setShowFullKey(false);
      setKeys((prev) => [
        {
          id: response.id,
          name: response.name,
          keyPrefix: response.keyPrefix,
          createdAt: response.createdAt,
        } as ApiKeyListItemDto,
        ...prev,
      ]);
      setKeyName('');
    } catch {
      toast.error('Failed to create API key.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyKey = async () => {
    if (!rawKey) return;
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setRawKey(null);
    setCreatedKeyPrefix('');
    setShowFullKey(false);
    setKeyName('');
    setCopied(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      await ApiKeysService.deleteKey(deleteTarget.id);
      setKeys((prev) => prev.filter((k) => k.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success('API key deleted.');
    } catch {
      toast.error('Failed to delete API key.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your API keys for programmatic access.
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseCreate();
            else setIsCreateOpen(true);
          }}
        >
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2">
                <IconPlus className="h-4 w-4" />
                Generate API Key
              </Button>
            }
          />
          <DialogContent>
            {!rawKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Generate a new API key</DialogTitle>
                  <DialogDescription>
                    Give your key a descriptive name so you can identify it later.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g. Production Server"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseCreate}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating} className="gap-2">
                      {isCreating ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Your new API key</DialogTitle>
                  <DialogDescription>
                    Copy your API key now. You won&apos;t be able to see it again.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-3">
                    <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-xs leading-relaxed text-destructive">
                      Make sure to copy your API key now. For security reasons,
                      it will not be shown again. If you lose it, you&apos;ll
                      need to generate a new key.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <code className="block w-full truncate rounded-md border border-border bg-muted px-3 py-2 pr-10 font-mono text-sm">
                        {showFullKey ? rawKey : `${getDisplayPrefix(createdKeyPrefix)}${'•'.repeat(24)}`}
                      </code>
                      <button
                        type="button"
                        onClick={() => setShowFullKey(!showFullKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showFullKey ? (
                          <IconEyeOff className="h-4 w-4" />
                        ) : (
                          <IconEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={handleCopyKey}
                    >
                      {copied ? (
                        <IconCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <IconCopy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseCreate}>Done</Button>
                </DialogFooter>
              </>
            )}
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

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={fetchKeys}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && keys.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <IconKey className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-sm font-semibold">No API keys</h3>
          <p className="mb-4 max-w-xs text-sm text-muted-foreground">
            Generate an API key to start using the filthiLink REST API.
          </p>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsCreateOpen(true)}
          >
            <IconPlus className="h-4 w-4" />
            Generate API Key
          </Button>
        </div>
      )}

      {/* Keys Table */}
      {!isLoading && !error && keys.length > 0 && (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Last Used</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="text-sm font-medium">
                    {key.name}
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                      {getDisplayPrefix(key.keyPrefix)}{'•'.repeat(12)}
                    </code>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {key.createdAt
                      ? format(new Date(key.createdAt), 'MMM d, yyyy')
                      : '--'}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {key.lastUsedAt
                      ? format(new Date(key.lastUsedAt), 'MMM d, yyyy')
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(key)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
              Any applications using this key will lose access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="gap-2"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
