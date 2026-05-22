'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { SubscriptionService } from '@/lib/api/subscription.service';
import { Button } from '@/components/ui/button';
import { IconCheck, IconCircleCheckFilled, IconCrown, IconArrowRight } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    <section id="pricing" className="relative border-t border-border px-6 py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            Simple, transparent pricing.
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            Choose the plan that fits your workflow. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded border border-border bg-card p-1">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`rounded px-4 py-1.5 text-xs font-semibold transition-all ${
                billingCycle === 'MONTHLY'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground cursor-pointer'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`relative rounded px-4 py-1.5 text-xs font-semibold transition-all ${
                billingCycle === 'YEARLY'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground cursor-pointer'
              }`}
            >
              Yearly
              <span className="absolute -top-3 -right-3 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground uppercase tracking-wider">
                3 Months Free
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
          
          {/* Free Card */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-200 hover:border-foreground/20">
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">Free</h3>
                <p className="mt-2 text-sm text-muted-foreground">Perfect for personal use and testing.</p>
              </div>

              <div className="my-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">$0</span>
                  <span className="ml-1 text-sm text-muted-foreground">/forever</span>
                </div>
              </div>

              <ul className="space-y-3.5 border-t border-border/60 pt-6">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <IconCheck className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
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
          </div>

          {/* Premium Card */}
          <div className="relative flex flex-col justify-between rounded-xl border-2 border-primary bg-card p-8 shadow-sm transition-all duration-200">
            {/* Popular Badge */}
            <div className="absolute -top-3 right-6 flex items-center gap-1 rounded bg-primary px-3 py-1 text-xs font-bold text-primary-foreground tracking-wide">
              <IconCrown className="h-3.5 w-3.5" />
              PREMIUM
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">Premium</h3>
                <p className="mt-2 text-sm text-muted-foreground">For creators, developers, and businesses.</p>
              </div>

              <div className="my-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {billingCycle === 'MONTHLY' ? '$10' : '$90'}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {billingCycle === 'MONTHLY' ? '/month' : '/year'}
                  </span>
                </div>
                {billingCycle === 'YEARLY' && (
                  <p className="mt-1 text-xs font-medium text-primary">
                    $7.50/month equivalent (3 months free, save 25%)
                  </p>
                )}
              </div>

              <ul className="space-y-3.5 border-t border-border/60 pt-6">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <IconCircleCheckFilled className="h-4.5 w-4.5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className="w-full justify-center gap-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-sm border-none"
                onClick={handleSelectPremium}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : isAuthenticated ? (
                  'Upgrade to Premium'
                ) : (
                  'Get Premium Now'
                )}
                {!isLoading && <IconArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
