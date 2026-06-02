"use client";

import { motion } from "framer-motion";
import { IconLink, IconChartBar, IconApi } from "@tabler/icons-react";

const features = [
  {
    icon: IconLink,
    title: "Instant shortening",
    description:
      "Transform long URLs into clean, memorable links in milliseconds.",
  },
  {
    icon: IconChartBar,
    title: "Click analytics",
    description:
      "Monitor your link performance with real-time metrics.",
  },
  {
    icon: IconApi,
    title: "API access",
    description:
      "Integrate link generation into your own applications with our REST API.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground">
            Everything you need.
          </h2>
          <p className="text-base text-muted-foreground">
            Shorten, track, and optimize your links all in one place.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="group relative h-full rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
