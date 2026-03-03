import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useGenerateReport, useReports, useReportStatus, Report } from '@/hooks/useReports';
import { useToast } from '@/providers/ToastProvider';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

type ReportType = 'summary' | 'detailed' | 'tax';
type ReportFormat = 'pdf' | 'csv';

function ReportStatusBadge({ status }: { status: Report['status'] }) {
  const { t } = useTranslation();
  const map = {
    pending: { icon: Clock, color: 'text-yellow-400', label: t('reports.status_pending') },
    processing: { icon: Loader2, color: 'text-blue-400', label: t('reports.status_processing') },
    completed: { icon: CheckCircle, color: 'text-green-400', label: t('reports.status_ready') },
    failed: { icon: FileText, color: 'text-red-400', label: t('reports.status_failed') },
  };
  const { icon: Icon, color, label } = map[status];
  return (
    <span className={`flex items-center gap-1 text-xs ${color}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const reportTypes = [
    { id: 'summary' as ReportType, label: t('reports.summary_label'), desc: t('reports.summary_desc') },
    { id: 'detailed' as ReportType, label: t('reports.detailed_label'), desc: t('reports.detailed_desc') },
    { id: 'tax' as ReportType, label: t('reports.tax_label'), desc: t('reports.tax_desc') },
  ];
  const { success, error } = useToast();
  const [type, setType] = useState<ReportType>('summary');
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pendingReportId, setPendingReportId] = useState<string | null>(null);

  const generateMutation = useGenerateReport();
  const { data: reports, isLoading: loadingReports, refetch } = useReports();
  const { data: pendingReport } = useReportStatus(pendingReportId ?? '', !!pendingReportId);

  if (pendingReport?.status === 'completed' && pendingReport.downloadUrl) {
    const url = pendingReport.downloadUrl;
    setPendingReportId(null);
    window.open(url, '_blank');
    refetch();
  }

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      error(t('common.required'));
      return;
    }
    try {
      const report = await generateMutation.mutateAsync({ type, format, startDate, endDate });
      if (report.status === 'completed' && report.downloadUrl) {
        window.open(report.downloadUrl, '_blank');
        refetch();
      } else {
        setPendingReportId(report.id);
        success(t('common.success'));
      }
    } catch {
      error(t('common.error'));
    }
  };

  const presets = [
    { label: t('reports.this_month'), start: new Date(new Date().setDate(1)).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] },
    { label: t('reports.last_month'), start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0], end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0] },
    { label: t('reports.this_year'), start: `${new Date().getFullYear()}-01-01`, end: new Date().toISOString().split('T')[0] },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('reports.title')}</h1>
        <p className="text-gray-400 text-sm mt-1">{t('reports.subtitle')}</p>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">{t('reports.type_label')}</h3>
        <div className="space-y-2">
          {reportTypes.map((rt) => (
            <button key={rt.id} onClick={() => setType(rt.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${type === rt.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
              <FileText className={`w-5 h-5 mt-0.5 flex-shrink-0 ${type === rt.id ? 'text-purple-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-medium">{rt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{rt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">{t('reports.date_range')}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((p) => (
            <button key={p.label}
              onClick={() => { setStartDate(p.start); setEndDate(p.end); }}
              className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('reports.date_from')}</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('reports.date_to')}</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">{t('reports.format_label')}</h3>
        <div className="flex gap-3 mb-5">
          {(['pdf', 'csv'] as ReportFormat[]).map((f) => (
            <button key={f} onClick={() => setFormat(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${format === f ? 'border-purple-500 bg-purple-500/20 text-purple-400' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'}`}>
              .{f.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={handleGenerate}
          disabled={generateMutation.isPending || !!pendingReportId}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-70">
          {(generateMutation.isPending || pendingReportId) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {pendingReportId ? t('reports.generating') : `${t('reports.generate_btn')} (.${format.toUpperCase()})`}
        </button>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">{t('reports.previous')}</h3>
        {loadingReports ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : !reports || reports.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{t('reports.no_reports')}</p>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{r.type} {t('reports.report_label')}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(r.startDate)} – {formatDate(r.endDate)} · .{r.format.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ReportStatusBadge status={r.status} />
                  {r.status === 'completed' && r.downloadUrl && (
                    <a href={r.downloadUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
