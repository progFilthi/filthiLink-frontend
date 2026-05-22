"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconArrowRight } from "@tabler/icons-react";

export function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/filthi-link-logo.png"
            alt="filthiLink Logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-semibold tracking-tight">
            filthiLink
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <a
            href="https://docs.filthilink.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button
              size="sm"
              className="gap-1.5"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Dashboard
              <IconArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                nativeButton={false}
                render={<Link href="/register" />}
              >
                Get Started
                <IconArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <IconX className="h-5 w-5" />
          ) : (
            <IconMenu2 className="h-5 w-5" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-background/95 backdrop-blur-xl px-6 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <a
              href="https://docs.filthilink.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
            <div className="flex flex-col gap-2 border-t pt-3">
              {isAuthenticated ? (
                <Button
                  size="sm"
                  className="gap-1.5"
                  nativeButton={false}
                  render={
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} />
                  }
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={
                      <Link href="/login" onClick={() => setMobileOpen(false)} />
                    }
                  >
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    nativeButton={false}
                    render={
                      <Link href="/register" onClick={() => setMobileOpen(false)} />
                    }
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
