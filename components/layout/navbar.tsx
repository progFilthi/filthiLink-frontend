"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconMenu2, IconArrowRight } from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

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
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
        scrolled ? "bg-background border-b border-border" : "bg-background"
      )}
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/filthi-link-logo.png"
            alt="filthiLink Logo"
            width={24}
            height={24}
            className="rounded-md"
          />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            filthiLink
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <Button asChild size="sm" className="h-8 gap-1.5 px-3">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Button asChild size="sm" className="h-8 gap-1.5 px-3">
                <Link href="/register">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle menu"
              >
                <IconMenu2 className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col bg-background">
                <div className="flex h-14 items-center border-b px-6">
                  <span className="text-sm font-semibold tracking-tight">Navigation</span>
                </div>
                <div className="flex flex-col px-6 py-6 space-y-6">
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/#features"
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Features
                    </Link>
                    <Link
                      href="/#pricing"
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Pricing
                    </Link>
                  </div>
                  <div className="flex flex-col space-y-3 pt-6 border-t border-border">
                    {isAuthenticated ? (
                      <Button asChild className="w-full justify-start">
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/login" onClick={() => setMobileOpen(false)}>
                            Sign in
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-start">
                          <Link href="/register" onClick={() => setMobileOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
