import { fetchClient } from './client';
import type {
  CheckoutRequest,
  CheckoutResponse,
  SubscriptionResponseDto,
} from '@/types/api';

export const SubscriptionService = {
  createCheckout: (email: string, data: CheckoutRequest) => {
    return fetchClient<CheckoutResponse>(`/api/v1/subscriptions/checkout?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMySubscription: () => {
    return fetchClient<SubscriptionResponseDto>('/api/v1/subscriptions/me', {
      method: 'GET',
    });
  },

  cancelSubscription: () => {
    return fetchClient<void>('/api/v1/subscriptions/cancel', {
      method: 'DELETE',
    });
  },
};
