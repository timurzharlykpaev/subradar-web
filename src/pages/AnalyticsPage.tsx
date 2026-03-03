import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { useTranslation } from 'react-i18next';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { CardBreakdownChart } from '@/components/charts/CardBreakdownChart';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { formatCurrency } from '@/lib/utils';
import { useAnalyticsSummary, useAnalyticsMonthly, useAnalyticsByCategory, useAnalyticsByCard } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Category } from '@/types';
import { TrendingUp, CreditCard, Layers } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: summary, isLoading: loadingSummary } = useAnalyticsSummary();
  const { data: monthly, isLoading: loadingMonthly } = useAnalyticsMonthly();
  const { data: byCategory, isLoading: loadingCategory } = useAnalyticsByCategory();
  const { data: byCard, isLoading: loadingByCard } = useAnalyticsByCard();
  const { data: subscriptions } = useSubscriptions();

  const topExpensive = (subscriptions ?? [])
    .filter((s) => s.status === 'ACTIVE')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const summaryItems = [
    {
      label: t('analytics.monthly_label'),
      value: formatCurrency(summary?.totalMonthly ?? 0),
      icon: TrendingUp,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
    },
    {
      label: t('analytics.yearly_label'),
      value: formatCurrency(summary?.totalYearly ?? 0),
      icon: CreditCard,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
    },
    {
      label: t('analytics.active_label'),
      value: (summary?.activeCount ?? 0).toString(),
      icon: Layers,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">{t('analytics.title')}</h1>
        <p className="page-subtitle">{t('analytics.subtitle')}</p>
      </div>

      {/* Summary cards */}
      {loadingSummary ? (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {summaryItems.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card stat-card rounded-2xl p-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-lg sm:text-xl font-bold tracking-tight truncate">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Monthly trend */}
      <div className="glass-card rounded-2xl p-5">
        <p className="section-title">{t('analytics.spend_trend')}</p>
        {loadingMonthly ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <MonthlyBarChart data={(monthly ?? []).map((m) => ({ month: m.month, amount: m.amount }))} />
        )}
      </div>

      {/* Category + Card charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="section-title">{t('analytics.by_category')}</p>
          {loadingCategory ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <CategoryDonutChart data={(byCategory ?? []).map((c) => ({ category: c.category as Category, amount: c.amount, count: c.count }))} />
          )}
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="section-title">{t('analytics.by_card')}</p>
          {loadingByCard ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <CardBreakdownChart data={(byCard ?? []).map((c) => ({ cardId: c.cardId, card: c.card as never, amount: c.amount }))} />
          )}
        </div>
      </div>

      {/* Top 5 */}
      <div className="glass-card rounded-2xl p-5">
        <p className="section-title">{t('analytics.top5')}</p>
        {topExpensive.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">{t('analytics.no_active')}</p>
        ) : (
          <div className="space-y-1">
            {topExpensive.map((sub, i) => (
              <div key={sub.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <span className="text-xs font-bold text-gray-700 w-5 text-center">{i + 1}</span>
                <CategoryIcon category={sub.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sub.name}</p>
                  <p className="text-xs text-gray-600">{sub.currentPlan ?? ''} · {sub.billingPeriod}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-bold text-purple-300 flex-shrink-0">
                    {formatCurrency(sub.amount, sub.currency)}
                  </span>
                  <span className="text-[10px] text-gray-600">/{sub.billingPeriod}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
