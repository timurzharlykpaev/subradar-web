import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ReportType, ReportStatus } from '@/types';

export interface Report {
  id: string;
  type: ReportType;
  format: 'pdf' | 'csv';
  status: ReportStatus;
  period: string;
  fileUrl?: string;
  createdAt: string;
}

export interface GenerateReportPayload {
  type: ReportType;
  format: 'pdf' | 'csv';
  period: string;
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
      if (data.status === 'PENDING' || data.status === 'GENERATING') return 2000;
      return false;
    },
  });
}

/**
 * GET /reports/:id/download — скачивает PDF/CSV как blob и триггерит браузерное скачивание.
 * Возвращает мутацию, которую нужно вызвать с id отчёта.
 */
export function useDownloadReport() {
  return useMutation({
    mutationFn: async ({ id, filename }: { id: string; filename?: string }) => {
      const response = await api.get(`/reports/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename ?? `report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
