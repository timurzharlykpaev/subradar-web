import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Receipt } from '@/types';

export function useReceipts(subscriptionId: string) {
  return useQuery<Receipt[]>({
    queryKey: ['receipts', subscriptionId],
    queryFn: async () => {
      const { data } = await api.get<Receipt[]>(`/subscriptions/${subscriptionId}/receipts`);
      return data;
    },
    enabled: !!subscriptionId,
  });
}

export function useUploadReceipt(subscriptionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<Receipt>(
        `/subscriptions/${subscriptionId}/receipts`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receipts', subscriptionId] }),
  });
}

export function useDeleteReceipt(subscriptionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (receiptId: string) => {
      await api.delete(`/subscriptions/${subscriptionId}/receipts/${receiptId}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receipts', subscriptionId] }),
  });
}
