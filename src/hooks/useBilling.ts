import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { BillingInfo } from '@/types';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
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
  return useQuery<BillingInfo>({
    queryKey: ['billing', 'me'],
    queryFn: async () => {
      const { data } = await api.get<BillingInfo>('/billing/me');
      return data;
    },
    staleTime: 30000,
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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post('/billing/cancel');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'me'] }),
  });
}

export function useStartTrial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ success: boolean; message: string }>('/billing/trial');
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'me'] }),
  });
}

export function useProInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post<{ success: boolean; message: string }>('/billing/invite', { email });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'me'] }),
  });
}

export function useRemoveProInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ success: boolean; message: string }>('/billing/invite');
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'me'] }),
  });
}
