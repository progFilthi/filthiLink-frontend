"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminService } from "@/lib/api/admin.service";
import { ApiError } from "@/lib/api/client";
import type { AdminUserResponseDto } from "@/types/api";
import { IconUsers, IconShield } from "@tabler/icons-react";
import { format } from "date-fns";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await AdminService.getUsers();
        setUsers(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setIsUnauthorized(true);
        } else {
          setError(err instanceof ApiError ? err.message : "Failed to load users");
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage platform users ({users.length} total).
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium text-muted-foreground">ID</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Auth</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Plan</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Links</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Clicks</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user.id}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium uppercase tracking-wider"
                    >
                      {user.authProvider}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === 'ADMIN'
                          ? 'bg-destructive/10 text-destructive text-[10px] font-medium uppercase tracking-wider'
                          : 'bg-muted/50 text-muted-foreground text-[10px] font-medium uppercase tracking-wider'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.subscriptionPlan === 'PREMIUM' ? (
                      <span className="font-medium text-amber-500">Premium</span>
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.subscriptionStatus === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-600 text-[10px] font-medium uppercase tracking-wider'
                          : user.subscriptionStatus === 'CANCELLED'
                          ? 'bg-muted/50 text-muted-foreground text-[10px] font-medium uppercase tracking-wider'
                          : 'bg-destructive/10 text-destructive text-[10px] font-medium uppercase tracking-wider'
                      }
                    >
                      {user.subscriptionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {user.linkCount}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm tabular-nums">
                    {user.totalClicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}