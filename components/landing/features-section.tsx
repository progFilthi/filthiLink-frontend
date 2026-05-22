"use client";

import { IconLink, IconChartBar, IconApi, IconShieldLock } from "@tabler/icons-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: IconLink,
    title: "Instant Shortening",
    description: "Turn long URLs into clean, memorable short links in milliseconds.",
  },
  {
    icon: IconChartBar,
    title: "Click Analytics",
    description: "Track every click with real-time counters and geographic data.",
  },
  {
    icon: IconApi,
    title: "REST API",
    description: "Integrate link creation into your own apps with API key authentication.",
  },
  {
    icon: IconShieldLock,
    title: "Secure by Default",
    description: "JWT authentication, API key management, and automatic link expiration.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste your URL",
    description: "Drop any long URL into the input field.",
  },
  {
    number: "02",
    title: "Share your link",
    description: "Copy your short link and share it anywhere.",
  },
  {
    number: "03",
    title: "Track performance",
    description: "Monitor clicks and geographic data in real time.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Three simple steps to get started.
          </p>
        </motion.div>

        <div className="relative mb-24 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-card font-mono text-xs font-bold text-muted-foreground shadow-sm">
                {step.number}
              </div>
              <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need
          </h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            A focused toolset for managing short links.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
