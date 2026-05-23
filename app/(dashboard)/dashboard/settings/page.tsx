'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SubscriptionService } from '@/lib/api/subscription.service';
import type { SubscriptionResponseDto } from '@/types/api';
import { ApiError } from '@/lib/api/client';
import {
  IconCrown,
  IconCreditCard,
  IconCalendar,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
  IconMail,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SettingsPage() {
  const { email, isAuthenticated } = useAuthStore();
  const [sub, setSub] = useState<SubscriptionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await SubscriptionService.getMySubscription();
      setSub(data);
    } catch (err: unknown) {
      const isAuthError = (err instanceof ApiError || (err && typeof err === 'object' && 'status' in err)) &&
        ((err as { status?: number }).status === 401 || (err as { status?: number }).status === 403);
      if (isAuthError) {
        return;
      }
      console.warn('Could not load subscription (falling back to FREE tier):', err);
      setSub({
        plan: 'FREE',
        status: 'EXPIRED',
        currentPeriodEnd: null,
        isPremium: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscription();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSubscription]);

  const handleUpgrade = async () => {
    if (!email) {
      toast.error('Email address not found. Please log in again.');
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading('Initiating secure checkout...');

    try {
      const response = await SubscriptionService.createCheckout(email, { billingCycle });
      if (response.checkoutUrl) {
        toast.success('Redirecting to checkout...', { id: toastId });
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned by backend');
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate checkout. Please try again.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await SubscriptionService.cancelSubscription();
      toast.success('Subscription cancelled successfully.');
      setIsCancelOpen(false);
      await fetchSubscription();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const isPremiumActive = sub?.isPremium && sub?.status === 'ACTIVE';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences and subscriptions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative max-w-sm">
              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={email ?? ''}
                disabled
                className="pl-9 bg-muted"
              />
            </div>
            <p className="pt-1 text-xs text-muted-foreground">
              Your email address is used for login and notifications.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={isPremiumActive ? 'border-primary/20' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Billing & Subscription</CardTitle>
              <CardDescription>View and manage your pricing tier.</CardDescription>
            </div>
            {isPremiumActive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <IconCrown className="h-3.5 w-3.5" />
                Premium
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" className="text-muted-foreground" />
            </div>
          ) : sub?.plan === 'PREMIUM' ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Subscription Tier</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Premium Plan</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCalendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {sub.status === 'CANCELLED' ? 'Ends on' : 'Renewal Date'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {sub.currentPeriodEnd
                        ? format(new Date(sub.currentPeriodEnd), 'MMMM d, yyyy')
                        : 'Unlimited'}
                    </p>
                  </div>
                </div>
              </div>

              {sub.status === 'ACTIVE' ? (
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-medium">Cancel Subscription</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      You will keep your features until the period ends.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setIsCancelOpen(true)}>
                    Cancel Plan
                  </Button>
                </div>
              ) : (
                <div className="flex items-start gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <IconAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">Subscription Cancelled</p>
                    <p className="mt-1 text-xs leading-relaxed text-destructive/80">
                      Your premium plan is cancelled and will expire on{' '}
                      {sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), 'MMM d, yyyy') : 'the end of period'}.
                      You can upgrade again at any time to reactivate.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <p className="text-sm font-semibold">You are on the Free Tier</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Upgrade to Premium for unlimited short links, unlimited API keys, high-speed routing, and detailed click analytics.
                </p>

                <div className="mt-4 grid gap-y-2 gap-x-6 sm:grid-cols-2">
                  {[
                    'Unlimited Short Links',
                    'Unlimited API Keys',
                    'Real-time Analytics',
                    '24/7 Dedicated Support',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Billing:</span>
                  <div className="inline-flex items-center gap-0.5 rounded-lg border bg-muted p-0.5">
                    <button
                      onClick={() => setBillingCycle('MONTHLY')}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        billingCycle === 'MONTHLY'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Monthly ($10)
                    </button>
                    <button
                      onClick={() => setBillingCycle('YEARLY')}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        billingCycle === 'YEARLY'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Yearly ($90)
                      <span className="absolute -top-2 -right-2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground leading-none">
                        -25%
                      </span>
                    </button>
                  </div>
                </div>

                <Button
                  className="gap-2"
                  onClick={handleUpgrade}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      Upgrade to Premium
                      <IconArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Customize your interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Switch between light and dark mode.
              </p>
            </div>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your Premium subscription?
              You will continue to have access to all Premium features until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)} disabled={isCancelling}>
              Keep Plan
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCancelling} className="gap-2">
              {isCancelling ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
