import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Subscription } from '@/types';

export function useSubscriptions(filters?: { category?: string; status?: string }) {
  return useQuery({
    queryKey: ['subscriptions', filters],
    queryFn: async () => {
      const { data } = await api.get<Subscription[]>('/subscriptions', { params: filters });
      return data;
    },
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      const { data } = await api.get<Subscription>(`/subscriptions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Subscription>) => {
      const { data } = await api.post<Subscription>('/subscriptions', payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
}

export function useUpdateSubscription(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Subscription>) => {
      const { data } = await api.patch<Subscription>(`/subscriptions/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      qc.invalidateQueries({ queryKey: ['subscriptions', id] });
    },
  });
}

export function useDeleteSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/subscriptions/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
}

/** POST /subscriptions/:id/cancel — устанавливает статус 'cancelled' */
export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Subscription>(`/subscriptions/${id}/cancel`);
      return data;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      qc.invalidateQueries({ queryKey: ['subscriptions', id] });
    },
  });
}

/** PATCH /subscriptions/:id { status: 'paused' } */
export function usePauseSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<Subscription>(`/subscriptions/${id}`, { status: 'paused' });
      return data;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      qc.invalidateQueries({ queryKey: ['subscriptions', id] });
    },
  });
}

/** PATCH /subscriptions/:id { status: 'active' } — восстановление из паузы */
export function useRestoreSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<Subscription>(`/subscriptions/${id}`, { status: 'active' });
      return data;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      qc.invalidateQueries({ queryKey: ['subscriptions', id] });
    },
  });
}

/** POST /ai/parse-screenshot (multipart) — AI парсинг скриншота чека */
export function useAIParseSubscription() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<Partial<Subscription>>(
        '/ai/parse-screenshot',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
  });
}
