"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { ModeToggle } from "@/components/mode-toggle";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-xl px-6 lg:px-8">
      <button
        className="flex items-center justify-center lg:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <IconMenu2 className="h-5 w-5" />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
