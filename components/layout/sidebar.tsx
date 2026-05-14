'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import {
  IconLayoutDashboard,
  IconLink,
  IconKey,
  IconSettings,
  IconLogout,
  IconX,
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
  const { logout, email } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <span className="text-xs font-bold text-background">fL</span>
            </div>
            <span className="text-sm font-semibold">filthiLink</span>
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
        <nav className="flex-1 space-y-1 px-3 py-4">
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
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <div className="mb-2 px-3 py-1">
            <p className="truncate text-xs text-muted-foreground">{email}</p>
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
