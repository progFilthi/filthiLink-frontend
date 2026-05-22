"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { LinksService } from "@/lib/api/links.service";
import { toast } from "sonner";
import { ShortenerInput } from "@/components/shortener-input";
import { ResultCard } from "@/components/result-card";
import { StatsStrip } from "@/components/landing/stats-strip";
import { motion } from "framer-motion";

export function HeroSection() {
  const [shortUrl, setShortUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleShorten = async (url: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setShortUrl("");
    setOriginalUrl(url);

    try {
      const response = await LinksService.createLink({ originalUrl: url });
      if (response.shortUrl) {
        setShortUrl(response.shortUrl);
        const parts = response.shortUrl.split("/");
        setSlug(parts[parts.length - 1]);
      }
    } catch {
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShortUrl("");
    setOriginalUrl("");
    setSlug("");
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Developer-first URL shortener
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Links,{" "}
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Refined.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mb-10 max-w-md text-base text-muted-foreground sm:text-lg"
        >
          Shorten, track, and manage your links with precision.
        </motion.p>

        {!shortUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <ShortenerInput onSubmit={handleShorten} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <ResultCard
              shortUrl={shortUrl}
              originalUrl={originalUrl}
              slug={slug}
            />
            <button
              onClick={handleReset}
              className="mt-3 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Shorten another link
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mt-20 w-full"
        >
          <StatsStrip />
        </motion.div>
      </div>
    </section>
  );
}
