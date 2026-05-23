"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { LinksService } from "@/lib/api/links.service";
import { toast } from "sonner";
import { ShortenerInput } from "@/components/shortener-input";
import { ResultCard } from "@/components/result-card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-8 h-7 px-3 text-sm font-medium text-muted-foreground border-border bg-muted/30">
            Developer-focused URL shortener
          </Badge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Short URLs. <span className="text-muted-foreground">Track everything.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
        >
          A modern, open-source URL shortener with real-time analytics, API access, and secure link management.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          {!shortUrl ? (
            <ShortenerInput onSubmit={handleShorten} isLoading={isLoading} />
          ) : (
            <div className="flex flex-col items-center">
              <ResultCard shortUrl={shortUrl} originalUrl={originalUrl} slug={slug} className="w-full" />
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Shorten another link
              </button>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-6"
        >
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            See pricing
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
