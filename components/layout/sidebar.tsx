"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { SubscriptionService } from "@/lib/api/subscription.service";
import type { SubscriptionResponseDto } from "@/types/api";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import { isAdmin } from "@/lib/jwt";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  IconLayoutDashboard,
  IconLink,
  IconKey,
  IconSettings,
  IconLogout,
  IconX,
  IconCrown,
  IconArrowRight,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: IconLayoutDashboard, exact: true },
  { href: "/dashboard/links", label: "Links", icon: IconLink },
  { href: "/dashboard/api-keys", label: "API Keys", icon: IconKey },
  { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
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
        const isAuthError =
          (err instanceof ApiError ||
            (err && typeof err === "object" && "status" in err)) &&
          ((err as { status?: number }).status === 401 ||
            (err as { status?: number }).status === 403);
        if (isAuthError) return;
        setSub({
          plan: "FREE",
          status: "EXPIRED",
          currentPeriodEnd: null,
          isPremium: false,
        });
      }
    }

    checkSubscription();
  }, [isAuthenticated, pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isPremiumActive = sub?.isPremium && sub?.status === "ACTIVE";
  const userIsAdmin = isAdmin();

  const allNavItems = userIsAdmin
    ? [
        ...navItems,
        { href: "/admin", label: "Admin", icon: IconShield, exact: true },
        { href: "/admin/users", label: "Users", icon: IconUsers },
      ]
    : navItems;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/filthi-link-logo.png"
              alt="filthiLink Logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">filthiLink</span>
              {isPremiumActive && (
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary leading-none">
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
            <IconX className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav items={allNavItems} onItemClick={onClose} />

          {isAuthenticated && !isPremiumActive && (
            <div className="mx-1 mt-6 rounded-xl border-2 border-dashed border-primary/20 bg-primary/[0.03] p-4 transition-all hover:border-primary/30">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <IconCrown className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-center text-xs font-semibold">Go Premium</p>
              <p className="mt-1 text-center text-[10px] leading-relaxed text-muted-foreground">
                Unlimited links, API keys, and analytics.
              </p>
              <Button asChild size="sm" className="mt-3 w-full gap-1 text-xs">
                <Link href="/dashboard/settings" onClick={onClose}>
                  Upgrade
                  <IconArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1">
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            {isPremiumActive && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                <IconCrown className="h-2.5 w-2.5 text-primary" />
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
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
