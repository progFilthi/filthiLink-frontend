'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { SubscriptionService } from '@/lib/api/subscription.service';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@tabler/icons-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
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
    '20 links per month',
    'No Api Key Generation',
    'Basic analytics',
    'Standard redirection',
  ];

  const premiumFeatures = [
    'Unlimited shortened links',
    'Unlimited active API keys',
    'Real-time detailed analytics',
    'High-speed priority redirection',
    'API access with zero rate-limiting'
  ];

  return (
    <section id="pricing" className="px-6 py-24 scroll-mt-14 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
            Simple, transparent pricing.
          </h2>
          <p className="max-w-md text-base text-muted-foreground">
            Choose the plan that fits your workflow. Upgrade or downgrade at any time.
          </p>

          <div className="mt-8 inline-flex items-center rounded-lg bg-muted p-1">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                billingCycle === 'MONTHLY'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                billingCycle === 'YEARLY'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground leading-normal">
                Save 25%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-8 transition-colors hover:border-foreground/20"
          >
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Free</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">Perfect for personal use and testing.</p>
              </div>
              <div className="my-6">
                <div className="flex items-baseline text-foreground">
                  <span className="text-4xl font-bold tracking-tight">$0</span>
                  <span className="ml-1 text-sm text-muted-foreground">/forever</span>
                </div>
              </div>
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <IconCheck className="h-4 w-4 text-muted-foreground" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(isAuthenticated ? '/dashboard' : '/register')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between rounded-xl border-2 border-primary bg-card p-8 shadow-sm shadow-primary/5"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Premium</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">For creators & developers.</p>
                </div>
                <Badge variant="default" className="h-6">Pro</Badge>
              </div>
              <div className="my-6">
                <div className="flex items-baseline text-foreground">
                  <span className="text-4xl font-bold tracking-tight">
                    {billingCycle === 'MONTHLY' ? '$10' : '$90'}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {billingCycle === 'MONTHLY' ? '/month' : '/year'}
                  </span>
                </div>
              </div>
              <ul className="space-y-3">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <IconCheck className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Button
                className="w-full gap-2"
                onClick={handleSelectPremium}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="text-primary-foreground" />
                ) : isAuthenticated ? (
                  'Upgrade to Premium'
                ) : (
                  'Get Premium'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
