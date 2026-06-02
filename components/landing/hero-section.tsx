"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { LinksService } from "@/lib/api/links.service";
import { toast } from "sonner";
import { ShortenerInput } from "@/components/shortener-input";
import { ResultCard } from "@/components/result-card";
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
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Badge variant="secondary" className="mb-8 h-7 px-4 text-sm font-medium shadow-none">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            URL shortener
          </Badge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Shorten your links in{" "}
          <span className="text-muted-foreground">two clicks</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mb-10 max-w-xl text-md text-muted-foreground sm:text-md leading-relaxed"
        >
          Shorten, share, and track your links in real time.
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
      </div>
    </section>
  );
}
