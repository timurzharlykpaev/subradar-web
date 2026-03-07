import { Link } from 'react-router-dom';
import { TrendingUp, CreditCard, AlertCircle, Zap, Plus, ArrowUpRight, RefreshCw, BarChart3, AlertTriangle } from 'lucide-react';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { UpcomingPayments } from '@/components/subscriptions/UpcomingPayments';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAnalyticsSummary, useAnalyticsMonthly, useAnalyticsByCategory, useUpcoming, useTrials, useForecast, useSavings } from '@/hooks/useAnalytics';
import { TrialTracker } from '@/components/subscriptions/TrialTracker';
import { SkeletonCard, SkeletonList, Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FeatureGate } from '@/components/shared/FeatureGate';

export default function DashboardPage() {
  const { t } = useTranslation();

  const { data: summary, isLoading: loadingSummary, isError: errorSummary, refetch: refetchSummary } = useAnalyticsSummary();
  const { data: monthly, isLoading: loadingMonthly } = useAnalyticsMonthly();
  const { data: byCategory, isLoading: loadingCategory } = useAnalyticsByCategory();
  const { data: upcoming, isLoading: loadingUpcoming } = useUpcoming(7);
  const { data: trials } = useTrials();
  const { data: forecast } = useForecast();
  const { data: savings } = useSavings();

  const renewalCount = upcoming ? upcoming.filter((s) => {
    const diff = new Date(s.nextPaymentDate).getTime() - new Date().setHours(0, 0, 0, 0);
    const days = Math.ceil(diff / 86400000);
    return days <= 7 && days >= 0;
  }).length : null;

  const statCards = [
    {
      label: t('dashboard.monthly_spend'),
      value: summary ? formatCurrency(summary.totalMonthly) : '—',
      sub: summary ? `${summary.activeCount ?? 0} ${t('dashboard.active_subscriptions')}` : '—',
      icon: TrendingUp,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
    },
    {
      label: t('dashboard.yearly_total'),
      value: summary ? formatCurrency(summary.totalYearly) : '—',
      sub: t('dashboard.projected_annual'),
      icon: CreditCard,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
    },
    {
      label: t('dashboard.renewals_soon'),
      value: renewalCount !== null ? renewalCount.toString() : '—',
      sub: t('dashboard.within_7_days'),
      icon: AlertCircle,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
    },
    {
      label: t('dashboard.savings_possible'),
      value: summary?.savingsPossible ? formatCurrency(summary.savingsPossible) : '$0.00',
      sub: t('dashboard.unused_subscriptions'),
      icon: Zap,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.12)',
    },
  ];

  // Empty state: 0 subscriptions
  if (!loadingSummary && summary && summary.activeCount === 0 && (summary.pausedCount ?? 0) === 0 && (summary.trialCount ?? 0) === 0) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <EmptyState
          icon={Plus}
          title={t('dashboard.empty_title')}
          description={t('dashboard.empty_description')}
          actions={[
            { label: t('dashboard.empty_add_manual'), href: '/app/subscriptions/add' },
            { label: t('dashboard.empty_add_ai'), href: '/app/subscriptions/add?mode=text' },
            { label: t('dashboard.empty_add_photo'), href: '/app/subscriptions/add?mode=photo' },
          ]}
        />
      </div>
    );
  }

  // Error state
  if (errorSummary) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <div className="glass-card rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-300 mb-4">{t('common.error_loading')}</p>
          <button onClick={() => refetchSummary()} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
            <RefreshCw className="w-4 h-4" />
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <Link
          to="/app/subscriptions/add"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('subscriptions.add')}
        </Link>
      </div>

      {/* Stat cards */}
      {loadingSummary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="glass-card stat-card rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xl font-bold tracking-tight truncate mb-0.5">{value}</p>
              <p className="text-xs font-medium text-gray-400 truncate">{label}</p>
              <p className="text-[11px] text-gray-600 mt-1 truncate">{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Forecast (Pro-gated) */}
      <FeatureGate feature="forecast" fallback={null}>
        {forecast && (
          <div className="glass-card rounded-2xl p-5">
            <p className="section-title flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              {t('dashboard.forecast_title')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
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

      {/* Savings/Duplicates (Pro-gated) */}
      <FeatureGate feature="advanced-analytics" fallback={null}>
        {savings && savings.estimatedMonthlySavings > 0 && (
          <div className="glass-card rounded-2xl p-5 border border-green-500/20">
            <p className="section-title flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              {t('dashboard.savings_title')}
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

      {/* Trial tracker */}
      {trials && trials.length > 0 && <TrialTracker trials={trials} />}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="section-title">{t('dashboard.monthly_trend')}</p>
          {loadingMonthly ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <MonthlyBarChart data={(monthly ?? []).map((m) => ({ month: m.month, amount: m.amount }))} />
          )}
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="section-title">{t('dashboard.by_category')}</p>
          {loadingCategory ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <CategoryDonutChart data={(byCategory ?? []).map((c) => ({ category: c.category as never, amount: c.amount, count: c.count }))} />
          )}
        </div>
      </div>

      {/* Upcoming payments */}
      {loadingUpcoming ? (
        <div className="glass-card rounded-2xl p-5">
          <Skeleton className="h-4 w-36 mb-4" />
          <SkeletonList count={3} />
        </div>
      ) : (
        <UpcomingPayments subscriptions={(upcoming ?? []) as never} />
      )}
    </div>
  );
}
