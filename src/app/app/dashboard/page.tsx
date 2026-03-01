'use client';

import Link from 'next/link';
import { TrendingUp, CreditCard, AlertCircle, Zap, Plus } from 'lucide-react';
import { mockSubscriptions, mockAnalytics, mockCards } from '@/lib/mockData';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { UpcomingPayments } from '@/components/subscriptions/UpcomingPayments';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const analytics = mockAnalytics;

  const statCards = [
    {
      label: t('dashboard.monthly_spend'),
      value: formatCurrency(analytics.totalMonthly),
      sub: `${analytics.activeCount} ${t('dashboard.active_subscriptions')}`,
      icon: TrendingUp,
      color: '#8B5CF6',
    },
    {
      label: t('dashboard.yearly_total'),
      value: formatCurrency(analytics.totalYearly),
      sub: t('dashboard.projected_annual'),
      icon: CreditCard,
      color: '#10B981',
    },
    {
      label: t('dashboard.renewals_soon'),
      value: mockSubscriptions.filter((s) => {
        const days = Math.ceil((new Date(s.nextPaymentDate).getTime() - Date.now()) / 86400000);
        return days <= 7 && days >= 0;
      }).length.toString(),
      sub: t('dashboard.within_7_days'),
      icon: AlertCircle,
      color: '#F59E0B',
    },
    {
      label: t('dashboard.savings_possible'),
      value: '$12.99',
      sub: t('dashboard.unused_subscriptions'),
      icon: Zap,
      color: '#EF4444',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <Link
          href="/app/subscriptions/add"
          className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          {t('subscriptions.add')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 truncate">{label}</p>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-bold truncate">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-gray-300 mb-4">{t('dashboard.monthly_trend')}</h3>
          <MonthlyBarChart data={analytics.monthlyTrend} />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-gray-300 mb-4">{t('dashboard.by_category')}</h3>
          <CategoryDonutChart data={analytics.byCategory} />
        </div>
      </div>

      {/* Upcoming */}
      <UpcomingPayments subscriptions={mockSubscriptions} />
    </div>
  );
}
