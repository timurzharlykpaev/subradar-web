import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Subscription } from '@/types';

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

export function useLookupService() {
  return useMutation({
    mutationFn: async (query: string) => {
      const { data } = await api.post<ServiceLookupResult>('/ai/lookup-service', { query });
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
