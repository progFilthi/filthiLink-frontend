'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IconLink, IconChartBar, IconApi, IconShieldLock } from '@tabler/icons-react';

const features = [
  {
    icon: IconLink,
    title: 'Instant Shortening',
    description: 'Turn long URLs into clean, memorable short links in milliseconds.',
  },
  {
    icon: IconChartBar,
    title: 'Click Analytics',
    description: 'Track every click with real-time counters and expiration visibility.',
  },
  {
    icon: IconApi,
    title: 'REST API',
    description: 'Integrate link creation into your own apps with API key authentication.',
  },
  {
    icon: IconShieldLock,
    title: 'Secure by Default',
    description: 'JWT authentication, API key management, and automatic link expiration.',
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.feature-card');
      
      // Simple intersection observer approach instead of ScrollTrigger plugin
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 24 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: 'power2.out',
                }
              );
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="border-t border-border px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            A focused toolset for managing short links without the bloat.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card rounded-lg border border-border bg-card p-6 opacity-0 transition-colors hover:bg-accent/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="mb-2 text-sm font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
