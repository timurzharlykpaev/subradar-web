import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ReportConfig } from '@/types';

export function useGenerateReport() {
  return useMutation({
    mutationFn: async (config: ReportConfig) => {
      const { data } = await api.post('/reports/generate', config, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subradar-report-${config.type}-${config.startDate}.${config.format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
