'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { SubscriptionService } from '@/lib/api/subscription.service';
import type { SubscriptionResponseDto } from '@/types/api';
import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api/client';
import {
  IconLayoutDashboard,
  IconLink,
  IconKey,
  IconSettings,
  IconLogout,
  IconX,
  IconCrown,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: IconLayoutDashboard },
  { href: '/dashboard/links', label: 'Links', icon: IconLink },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: IconKey },
  { href: '/dashboard/settings', label: 'Settings', icon: IconSettings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, email, isAuthenticated } = useAuthStore();
  const [sub, setSub] = useState<SubscriptionResponseDto | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function checkSubscription() {
      try {
        const data = await SubscriptionService.getMySubscription();
        setSub(data);
      } catch (err) {
        const isAuthError = (err instanceof ApiError || (err && typeof err === 'object' && 'status' in err)) && 
          ((err as { status?: number }).status === 401 || (err as { status?: number }).status === 403);
        if (isAuthError) {
          return;
        }
        console.warn('Could not load subscription (falling back to FREE tier):', err);
        setSub({
          plan: 'FREE',
          status: 'EXPIRED',
          currentPeriodEnd: null,
          isPremium: false
        });
      }
    }
    
    checkSubscription();
  }, [isAuthenticated, pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isPremiumActive = sub?.isPremium && sub?.status === 'ACTIVE';

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/filthi-link-logo.png" alt="filthiLink Logo" width={28} height={28} className="rounded-md" />
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">filthiLink</span>
              {isPremiumActive && (
                <span className="rounded bg-primary px-1 py-0.5 text-[9px] font-bold text-primary-foreground leading-none">
                  PRO
                </span>
              )}
            </div>
          </Link>
          <button
            className="flex items-center justify-center lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <IconX className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Upgrade Card CTA inside Nav */}
          {isAuthenticated && !isPremiumActive && (
            <div className="mx-2 mt-8 rounded-lg border border-border bg-muted/40 p-4 text-center">
              <IconCrown className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-xs font-semibold">Upgrade to Premium</p>
              <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
                Get unlimited shortened links and programmatic API keys.
              </p>
              <Button
                size="sm"
                className="mt-3 w-full bg-primary text-primary-foreground text-[11px] font-medium py-1 border-none hover:bg-primary/90"
                nativeButton={false}
                render={<Link href="/dashboard/settings" />}
                onClick={onClose}
              >
                Upgrade
              </Button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <div className="mb-2 px-3 py-1 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            {isPremiumActive && (
              <IconCrown className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <IconLogout className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}
