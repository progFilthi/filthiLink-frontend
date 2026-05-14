'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinksService } from '@/lib/api/links.service';
import { useAuthStore } from '@/store/auth-store';
import { IconArrowRight, IconCopy, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.hero-heading',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.hero-input',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.hero-trust',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setShortUrl('');
    try {
      const response = await LinksService.createLink({ originalUrl: url });
      if (response.shortUrl) {
        setShortUrl(response.shortUrl);
      }
    } catch {
      toast.error('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 pb-20"
    >
      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground opacity-0">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Developer-first URL shortener
        </div>

        {/* Heading */}
        <h1 className="hero-heading mb-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl opacity-0">
          Short links,{' '}
          <span className="text-muted-foreground">full control.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg opacity-0">
          Create, manage, and track short links through a clean dashboard or
          a simple REST API. Built for developers who care about their tools.
        </p>

        {/* Input */}
        <div className="hero-input mx-auto max-w-lg opacity-0">
          <form onSubmit={handleShorten} className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 flex-1 bg-card text-sm"
              required
            />
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="h-12 gap-2 px-6"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  Shorten
                  <IconArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Result */}
          {shortUrl && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-medium text-foreground hover:underline"
              >
                {shortUrl}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="ml-3 shrink-0 gap-2"
              >
                {copied ? (
                  <IconCheck className="h-4 w-4 text-emerald-500" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          )}
        </div>

        {/* Trust */}
        <div className="hero-trust mt-12 flex flex-col items-center gap-3 text-xs text-muted-foreground opacity-0">
          <p>No credit card required. Free tier available.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
              99.9% uptime
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
              REST API
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
              Real-time analytics
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
