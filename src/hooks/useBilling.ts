import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
}

export interface BillingMe {
  plan: string;
  status: 'active' | 'cancelled' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export function useBillingPlans() {
  return useQuery<BillingPlan[]>({
    queryKey: ['billing', 'plans'],
    queryFn: async () => {
      const { data } = await api.get<BillingPlan[]>('/billing/plans');
      return data;
    },
  });
}

export function useBillingMe() {
  return useQuery<BillingMe>({
    queryKey: ['billing', 'me'],
    queryFn: async () => {
      const { data } = await api.get<BillingMe>('/billing/me');
      return data;
    },
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: async (planId: string) => {
      const { data } = await api.post<{ url: string }>('/billing/checkout', { planId });
      return data;
    },
  });
}

export function useCancelBilling() {
  return useMutation({
    mutationFn: async () => {
      await api.post('/billing/cancel');
    },
  });
}
