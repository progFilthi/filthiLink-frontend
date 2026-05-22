'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { SubscriptionService } from '@/lib/api/subscription.service';
import { Button } from '@/components/ui/button';
import { IconCheck, IconCircleCheckFilled, IconCrown, IconArrowRight } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, email } = useAuthStore();
  const router = useRouter();

  const handleSelectPremium = async () => {
    if (!isAuthenticated) {
      router.push(`/register?plan=premium&cycle=${billingCycle.toLowerCase()}`);
      return;
    }

    if (!email) {
      toast.error('Email address not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Initiating secure checkout...');

    try {
      const response = await SubscriptionService.createCheckout(email, { billingCycle });
      if (response.checkoutUrl) {
        toast.success('Redirecting to checkout...', { id: toastId });
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate checkout. Please try again.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const freeFeatures = [
    '100 links per month',
    '1 active API key',
    'Basic click counters',
    'Standard redirection speed',
  ];

  const premiumFeatures = [
    'Unlimited shortened links',
    'Unlimited active API keys',
    'Real-time detailed analytics',
    'High-speed priority redirection',
    'API access with zero rate-limiting',
    '24/7 dedicated support',
  ];

  return (
    <section id="pricing" className="relative border-t px-6 py-24 overflow-hidden scroll-mt-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, transparent pricing.
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Choose the plan that fits your workflow. Upgrade or downgrade at any time.
          </p>

          <div className="mt-8 inline-flex items-center gap-0.5 rounded-lg border bg-card p-0.5 shadow-sm">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                billingCycle === 'MONTHLY'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`relative rounded-md px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                billingCycle === 'YEARLY'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="absolute -top-2.5 -right-2.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground leading-none">
                2 free
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between rounded-xl border bg-card p-8 transition-all duration-200 hover:border-muted-foreground/30"
          >
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-semibold tracking-tight">Free</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">Perfect for personal use and testing.</p>
              </div>

              <div className="my-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">$0</span>
                  <span className="ml-1.5 text-sm text-muted-foreground">/forever</span>
                </div>
              </div>

              <ul className="space-y-4">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <IconCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => router.push(isAuthenticated ? '/dashboard' : '/register')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col justify-between rounded-xl border-2 border-primary bg-card p-8 shadow-sm shadow-primary/5 transition-all duration-200"
          >
            <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              <IconCrown className="h-3.5 w-3.5" />
              Premium
            </div>

            <div>
              <div className="mb-5">
                <h3 className="text-lg font-semibold tracking-tight">Premium</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">For creators, developers, and businesses.</p>
              </div>

              <div className="my-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    {billingCycle === 'MONTHLY' ? '$10' : '$90'}
                  </span>
                  <span className="ml-1.5 text-sm text-muted-foreground">
                    {billingCycle === 'MONTHLY' ? '/month' : '/year'}
                  </span>
                </div>
                {billingCycle === 'YEARLY' && (
                  <p className="mt-1.5 text-xs font-medium text-primary/80">
                    $7.50/mo — save 25%
                  </p>
                )}
              </div>

              <ul className="space-y-4">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <IconCircleCheckFilled className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className="w-full justify-center gap-2"
                onClick={handleSelectPremium}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : isAuthenticated ? (
                  'Upgrade to Premium'
                ) : (
                  'Get Premium'
                )}
                {!isLoading && <IconArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
