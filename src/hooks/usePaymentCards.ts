import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaymentCard } from '@/types';

export function usePaymentCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data } = await api.get<PaymentCard[]>('/cards');
      return data;
    },
  });
}

export function useCreateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PaymentCard>) => {
      const { data } = await api.post<PaymentCard>('/cards', payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useUpdateCard(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PaymentCard>) => {
      const { data } = await api.patch<PaymentCard>(`/cards/${id}`, payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cards/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });
}
