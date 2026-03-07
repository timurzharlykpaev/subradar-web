import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Subscription, BillingCycle, Category } from '@/types';

export interface ServiceLookupResult {
  name: string;
  logoUrl?: string;
  category: string;
  plans: {
    name: string;
    amount: number;
    currency: string;
    billingCycle: string;
  }[];
}

export interface TextParseResult {
  confidence: number;
  parsed: {
    name?: string;
    amount?: number;
    currency?: string;
    billingPeriod?: BillingCycle;
    nextBillingDate?: string;
    category?: Category;
    status?: string;
  };
  clarificationNeeded: boolean;
  questions?: { field: string; question: string; options?: string[] }[];
}

export interface ServiceMatch {
  id: string;
  name: string;
  confidence: number;
  iconUrl?: string;
  website?: string;
}

export interface SubscriptionInsights {
  estimatedMonthlySavings: number;
  duplicates: { ids: string[]; name: string; savings: number }[];
  insights: { type: string; message: string; subscriptionIds?: string[] }[];
}

export function useLookupService() {
  return useMutation({
    mutationFn: async (query: string) => {
      const { data } = await api.post<ServiceLookupResult>('/ai/lookup', { query });
      return data;
    },
  });
}

export function useParseScreenshot() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<Partial<Subscription>>(
        '/ai/parse-screenshot',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    },
  });
}

/** POST /ai/parse-text-subscription — AI парсинг текста */
export function useParseTextSubscription() {
  return useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post<TextParseResult>('/ai/parse-text-subscription', { text });
      return data;
    },
  });
}

/** POST /ai/match-service — поиск сервиса по имени */
export function useMatchService() {
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<{ matches: ServiceMatch[] }>('/ai/match-service', { name });
      return data;
    },
  });
}

/** GET /ai/subscription-insights — AI инсайты по подпискам */
export function useSubscriptionInsights() {
  return useQuery<SubscriptionInsights>({
    queryKey: ['ai', 'insights'],
    queryFn: async () => {
      const { data } = await api.get<SubscriptionInsights>('/ai/subscription-insights');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** POST /ai/run-audit — запуск AI аудита */
export function useRunAudit() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ success: boolean; reportId?: string }>('/ai/run-audit');
      return data;
    },
  });
}
