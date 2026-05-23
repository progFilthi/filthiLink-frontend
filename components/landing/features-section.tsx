"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLink, IconChartBar, IconApi } from "@tabler/icons-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: IconLink,
    title: "Instant shortening",
    description:
      "Transform long, unwieldy URLs into clean, memorable links in milliseconds. Built for speed and reliability.",
  },
  {
    icon: IconChartBar,
    title: "Click analytics",
    description:
      "Monitor your link performance with real-time metrics. Track referrers, locations, and device types instantly.",
  },
  {
    icon: IconApi,
    title: "API access",
    description:
      "Integrate link generation into your own applications with our REST API. Complete with predictable endpoints and zero rate limits for premium.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground">
            Everything you need.
          </h2>
          <p className="text-base text-muted-foreground">
            Core features built for developers and creators. No fluff.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border shadow-none transition-colors hover:border-foreground/20">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
