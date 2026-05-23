"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ShortenerInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ShortenerInput({
  onSubmit,
  isLoading,
  className,
}: ShortenerInputProps) {
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "flex items-center rounded-xl border bg-card shadow-sm transition-all duration-200",
            focused
              ? "border-primary/50 ring-2 ring-primary/10"
              : "border-input hover:border-muted-foreground/30",
          )}
        >
          <div className="flex items-center pl-4">
            <IconLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-muted-foreground/50"
            required
            autoComplete="url"
          />
          <div className="pr-2">
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              size="sm"
              className="gap-1.5 rounded-lg px-4 text-sm"
            >
              {isLoading ? (
                <LoadingSpinner className="text-primary-foreground" size="sm" />
              ) : (
                <>
                  Shorten
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
