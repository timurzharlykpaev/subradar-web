import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AnalyticsSummary {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
  pausedCount: number;
  trialCount: number;
  savingsPossible?: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
  // raw backend fields
  label?: string;
  total?: number;
  year?: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
}

export interface CardAnalyticsData {
  cardId: string;
  card: {
    id: string;
    nickname: string;
    last4: string;
    brand: string;
    color: string;
  };
  amount: number;
  count: number;
}

export interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  currency: string;
  nextPaymentDate: string;
  billingCycle: string;
  category: string;
  logoUrl?: string;
}

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsSummary>('/analytics/summary');
      return data;
    },
  });
}

export function useAnalyticsMonthly(months = 12) {
  return useQuery<MonthlyData[]>({
    queryKey: ['analytics', 'monthly', months],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/analytics/monthly', { params: { months } });
      return data.map((d) => ({ month: d.label || d.month, amount: d.total ?? d.amount ?? 0 }));
    },
  });
}

export function useAnalyticsByCategory() {
  return useQuery<CategoryData[]>({
    queryKey: ['analytics', 'by-category'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/analytics/by-category');
      return data.map((d) => ({ category: d.category, amount: d.total ?? d.amount ?? 0, count: d.count ?? 0 }));
    },
  });
}

export function useAnalyticsByCard() {
  return useQuery<CardAnalyticsData[]>({
    queryKey: ['analytics', 'by-card'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/analytics/by-card');
      return data.map((d) => ({ cardId: d.card?.id ?? '', card: d.card, amount: d.total ?? d.amount ?? 0, count: d.subscriptions ?? d.count ?? 0 }));
    },
  });
}

export function useUpcoming(days = 7) {
  return useQuery<UpcomingPayment[]>({
    queryKey: ['analytics', 'upcoming', days],
    queryFn: async () => {
      const { data } = await api.get<UpcomingPayment[]>('/analytics/upcoming', { params: { days } });
      return data;
    },
  });
}

export interface TrialSubscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  iconUrl?: string;
  cancelUrl?: string;
  trialEndDate?: string;
  daysUntilTrialEnd: number | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

export function useTrials() {
  return useQuery<TrialSubscription[]>({
    queryKey: ['analytics', 'trials'],
    queryFn: async () => {
      const { data } = await api.get<TrialSubscription[]>('/analytics/trials');
      return data;
    },
  });
}

export interface ForecastData {
  forecast30d: number;
  forecast6mo: number;
  forecast12mo: number;
  currency: string;
}

export interface SavingsData {
  estimatedMonthlySavings: number;
  duplicates: { subscriptionIds: string[]; name: string; potentialSavings: number }[];
  insights: { type: string; message: string }[];
}

/** GET /analytics/forecast — прогноз расходов */
export function useForecast() {
  return useQuery<ForecastData>({
    queryKey: ['analytics', 'forecast'],
    queryFn: async () => {
      const { data } = await api.get<ForecastData>('/analytics/forecast');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** GET /analytics/savings — потенциальная экономия и дубликаты */
export function useSavings() {
  return useQuery<SavingsData>({
    queryKey: ['analytics', 'savings'],
    queryFn: async () => {
      const { data } = await api.get<SavingsData>('/analytics/savings');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Legacy hook for backward compat
export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics');
      return data;
    },
  });
}
