import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Report {
  id: string;
  type: 'summary' | 'detailed' | 'tax';
  format: 'pdf' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startDate: string;
  endDate: string;
  downloadUrl?: string;
  createdAt: string;
}

export interface GenerateReportPayload {
  type: 'summary' | 'detailed' | 'tax';
  format: 'pdf' | 'csv';
  startDate: string;
  endDate: string;
}

export function useReports() {
  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await api.get<Report[]>('/reports');
      return data;
    },
  });
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: async (payload: GenerateReportPayload) => {
      const { data } = await api.post<Report>('/reports/generate', payload);
      return data;
    },
  });
}

export function useReportStatus(id: string, enabled = false) {
  return useQuery<Report>({
    queryKey: ['reports', id],
    queryFn: async () => {
      const { data } = await api.get<Report>(`/reports/${id}`);
      return data;
    },
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      if (data.status === 'pending' || data.status === 'processing') return 2000;
      return false;
    },
  });
}
