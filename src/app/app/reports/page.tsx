'use client';

import { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useGenerateReport, useReports, useReportStatus, Report } from '@/hooks/useReports';
import { useToast } from '@/providers/ToastProvider';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

type ReportType = 'summary' | 'detailed' | 'tax';
type ReportFormat = 'pdf' | 'csv';

const reportTypes = [
  { id: 'summary' as ReportType, label: 'Summary Report', desc: 'Overview of all subscriptions and total spend' },
  { id: 'detailed' as ReportType, label: 'Detailed Report', desc: 'Full transaction history with receipts' },
  { id: 'tax' as ReportType, label: 'Tax Report', desc: 'Business subscriptions formatted for tax filing' },
];

function ReportStatusBadge({ status }: { status: Report['status'] }) {
  const map = {
    pending: { icon: Clock, color: 'text-yellow-400', label: 'Pending' },
    processing: { icon: Loader2, color: 'text-blue-400', label: 'Processing' },
    completed: { icon: CheckCircle, color: 'text-green-400', label: 'Ready' },
    failed: { icon: FileText, color: 'text-red-400', label: 'Failed' },
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
  const { success, error } = useToast();
  const [type, setType] = useState<ReportType>('summary');
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pendingReportId, setPendingReportId] = useState<string | null>(null);

  const generateMutation = useGenerateReport();
  const { data: reports, isLoading: loadingReports, refetch } = useReports();

  // Poll status of the most recently generated report
  const { data: pendingReport } = useReportStatus(pendingReportId ?? '', !!pendingReportId);

  // When report completes, trigger download
  if (pendingReport?.status === 'completed' && pendingReport.downloadUrl) {
    const url = pendingReport.downloadUrl;
    setPendingReportId(null);
    window.open(url, '_blank');
    refetch();
  }

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      error('Please select a date range.');
      return;
    }
    try {
      const report = await generateMutation.mutateAsync({ type, format, startDate, endDate });
      if (report.status === 'completed' && report.downloadUrl) {
        window.open(report.downloadUrl, '_blank');
        refetch();
      } else {
        setPendingReportId(report.id);
        success('Report generation started. We\'ll download it when ready.');
      }
    } catch {
      error('Failed to generate report.');
    }
  };

  const presets = [
    { label: 'This Month', start: new Date(new Date().setDate(1)).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] },
    { label: 'Last Month', start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0], end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0] },
    { label: 'This Year', start: `${new Date().getFullYear()}-01-01`, end: new Date().toISOString().split('T')[0] },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Generate and download subscription reports</p>
      </div>

      {/* Report type */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Report Type</h3>
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

      {/* Date range */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Date Range</h3>
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
            <label className="text-xs text-gray-400 mb-1 block">From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
          </div>
        </div>
      </div>

      {/* Format & Generate */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Format</h3>
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
          {pendingReportId ? 'Generating...' : `Generate ${format.toUpperCase()} Report`}
        </button>
      </div>

      {/* Previous reports */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Previous Reports</h3>
        {loadingReports ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : !reports || reports.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No reports generated yet.</p>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{r.type} Report</p>
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
