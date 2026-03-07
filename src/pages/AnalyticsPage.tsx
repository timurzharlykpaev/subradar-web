import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { useTranslation } from 'react-i18next';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { CardBreakdownChart } from '@/components/charts/CardBreakdownChart';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { formatCurrency } from '@/lib/utils';
import { useAnalyticsSummary, useAnalyticsMonthly, useAnalyticsByCategory, useAnalyticsByCard, useForecast, useSavings } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { Category } from '@/types';
import { TrendingUp, CreditCard, Layers, BarChart3, Zap, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: summary, isLoading: loadingSummary, isError, refetch } = useAnalyticsSummary();
  const { data: monthly, isLoading: loadingMonthly } = useAnalyticsMonthly();
  const { data: byCategory, isLoading: loadingCategory } = useAnalyticsByCategory();
  const { data: byCard, isLoading: loadingByCard } = useAnalyticsByCard();
  const { data: subscriptions } = useSubscriptions();
  const { data: forecast } = useForecast();
  const { data: savings } = useSavings();

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

  if (!loadingSummary && isError) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div><h1 className="page-title">{t('analytics.title')}</h1></div>
        <div className="glass-card rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-300 mb-4">{t('common.error_loading')}</p>
          <button onClick={() => refetch()} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
            <RefreshCw className="w-4 h-4" />{t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!loadingSummary && summary && summary.activeCount === 0) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div><h1 className="page-title">{t('analytics.title')}</h1></div>
        <EmptyState
          icon={Plus}
          title={t('analytics.empty_title')}
          description={t('analytics.empty_description')}
          action={{ label: t('subscriptions.add'), href: '/app/subscriptions/add' }}
        />
      </div>
    );
  }

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

      {/* Forecast (Pro-gated) */}
      <FeatureGate feature="forecast" fallback={null}>
        {forecast && (
          <div className="glass-card rounded-2xl p-5">
            <p className="section-title flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              {t('analytics.forecast_title')}
            </p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-gray-500">{t('dashboard.forecast_30d')}</p>
                <p className="text-lg font-bold">{formatCurrency(forecast.forecast30d, forecast.currency)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-gray-500">{t('dashboard.forecast_6mo')}</p>
                <p className="text-lg font-bold">{formatCurrency(forecast.forecast6mo, forecast.currency)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-gray-500">{t('dashboard.forecast_12mo')}</p>
                <p className="text-lg font-bold">{formatCurrency(forecast.forecast12mo, forecast.currency)}</p>
              </div>
            </div>
          </div>
        )}
      </FeatureGate>

      {/* Savings (Pro-gated) */}
      <FeatureGate feature="advanced-analytics" fallback={null}>
        {savings && savings.estimatedMonthlySavings > 0 && (
          <div className="glass-card rounded-2xl p-5 border border-green-500/20">
            <p className="section-title flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              {t('analytics.savings_title')}
            </p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              {formatCurrency(savings.estimatedMonthlySavings)}/{t('common.month')}
            </p>
            {savings.duplicates.length > 0 && (
              <div className="mt-3 space-y-1">
                {savings.duplicates.map((d, i) => (
                  <p key={i} className="text-xs text-gray-400">
                    {t('dashboard.duplicate_found')}: {d.name} — {formatCurrency(d.potentialSavings)}/{t('common.month')}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </FeatureGate>

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
