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
  IconLoader2,
  IconArrowRight
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
      // Fallback local mock in case backend returns 404 or fails
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
      // Refresh the page data
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
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences and subscriptions.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email ?? ''}
              disabled
              className="max-w-sm bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Your email address is used for login and notifications.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={isPremiumActive ? 'border-primary shadow-sm' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Billing & Subscription</CardTitle>
              <CardDescription>View and manage your pricing tier.</CardDescription>
            </div>
            {isPremiumActive && (
              <span className="flex items-center gap-1.5 rounded bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                <IconCrown className="h-3.5 w-3.5" />
                PREMIUM ACTIVE
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sub?.plan === 'PREMIUM' ? (
            <div className="space-y-6">
              {/* Premium Status Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-muted/40">
                  <IconCreditCard className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Subscription Tier</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Premium Plan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-muted/40">
                  <IconCalendar className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      {sub.status === 'CANCELLED' ? 'Ends on' : 'Renewal Date'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {sub.currentPeriodEnd 
                        ? format(new Date(sub.currentPeriodEnd), 'MMMM d, yyyy')
                        : 'Unlimited'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              {sub.status === 'ACTIVE' ? (
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-sm font-medium">Cancel Subscription</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Cancel your automatic renewal. You will keep your features until the period ends.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setIsCancelOpen(true)}>
                    Cancel Plan
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 flex gap-3">
                  <IconAlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">Subscription Cancelled</p>
                    <p className="text-xs text-destructive/80 mt-0.5">
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
              {/* Free Tier Info */}
              <div className="rounded-lg border border-border p-4 bg-muted/30">
                <p className="text-sm font-semibold">You are currently on the Free Tier</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Upgrade to Premium to get unlimited short links, unlimited active API keys, high-speed routing, and detailed click analytics.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>Unlimited Short Links</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>Unlimited API Keys</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>Real-time Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>24/7 Dedicated Support</span>
                  </div>
                </div>
              </div>

              {/* Upgrade Trigger */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4">
                  {/* Cycle Switcher */}
                  <div className="inline-flex items-center gap-1 rounded border border-border bg-muted p-1">
                    <button
                      onClick={() => setBillingCycle('MONTHLY')}
                      className={`rounded px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        billingCycle === 'MONTHLY'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Monthly ($10)
                    </button>
                    <button
                      onClick={() => setBillingCycle('YEARLY')}
                      className={`relative rounded px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        billingCycle === 'YEARLY'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Yearly ($90)
                      <span className="absolute -top-2 -right-2 rounded bg-primary px-1 py-0.5 text-[8px] font-bold text-primary-foreground leading-none">
                        -25%
                      </span>
                    </button>
                  </div>
                </div>

                <Button 
                  className="gap-2 bg-primary text-primary-foreground border-none hover:bg-primary/90 shadow-sm"
                  onClick={handleUpgrade}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
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

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark mode.
              </p>
            </div>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your Premium subscription? 
              You will continue to have access to all Premium features until the end of your current billing period. 
              After that, your account will revert to the Free tier limits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)} disabled={isCancelling}>
              Keep Plan
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCancelling} className="gap-2">
              {isCancelling ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
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
