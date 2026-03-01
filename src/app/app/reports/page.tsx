'use client';

import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

type ReportType = 'summary' | 'detailed' | 'tax';
type ReportFormat = 'pdf' | 'csv';

const reportTypes = [
  { id: 'summary' as ReportType, label: 'Summary Report', desc: 'Overview of all subscriptions and total spend' },
  { id: 'detailed' as ReportType, label: 'Detailed Report', desc: 'Full transaction history with receipts' },
  { id: 'tax' as ReportType, label: 'Tax Report', desc: 'Business subscriptions formatted for tax filing' },
];

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>('summary');
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
    alert('Report generated! (Demo mode — connect to API for real download)');
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
            <button
              key={rt.id}
              onClick={() => setType(rt.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                type === rt.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
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
            <button
              key={p.label}
              onClick={() => { setStartDate(p.start); setEndDate(p.end); }}
              className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Format & Generate */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Format</h3>
        <div className="flex gap-3 mb-5">
          {(['pdf', 'csv'] as ReportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                format === f
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              .{f.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-70"
        >
          {isGenerating ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : `Generate ${format.toUpperCase()} Report`}
        </button>
      </div>
    </div>
  );
}
