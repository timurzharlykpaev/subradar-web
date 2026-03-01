'use client';

import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { CardBreakdownChart } from '@/components/charts/CardBreakdownChart';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { formatCurrency } from '@/lib/utils';
import { useAnalyticsSummary, useAnalyticsMonthly, useAnalyticsByCategory, useAnalyticsByCard } from '@/hooks/useAnalytics';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Category } from '@/types';

export default function AnalyticsPage() {
  const { data: summary, isLoading: loadingSummary } = useAnalyticsSummary();
  const { data: monthly, isLoading: loadingMonthly } = useAnalyticsMonthly();
  const { data: byCategory, isLoading: loadingCategory } = useAnalyticsByCategory();
  const { data: byCard, isLoading: loadingByCard } = useAnalyticsByCard();
  const { data: subscriptions } = useSubscriptions();

  const topExpensive = (subscriptions ?? [])
    .filter((s) => s.status === 'active')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Deep dive into your subscription spending</p>
      </div>

      {/* Summary stats */}
      {loadingSummary ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: 'Monthly', value: formatCurrency(summary?.totalMonthly ?? 0) },
            { label: 'Yearly', value: formatCurrency(summary?.totalYearly ?? 0) },
            { label: 'Active', value: (summary?.activeCount ?? 0).toString() },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-base sm:text-lg font-bold text-purple-400 truncate">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Monthly trend */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Monthly Spend Trend</h3>
        {loadingMonthly ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <MonthlyBarChart data={(monthly ?? []).map((m) => ({ month: m.month, amount: m.amount }))} />
        )}
      </div>

      {/* Category & Card breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-gray-300 mb-4">By Category</h3>
          {loadingCategory ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <CategoryDonutChart data={(byCategory ?? []).map((c) => ({ category: c.category as Category, amount: c.amount, count: c.count }))} />
          )}
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-gray-300 mb-4">By Card</h3>
          {loadingByCard ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <CardBreakdownChart data={(byCard ?? []).map((c) => ({ cardId: c.cardId, card: c.card as never, amount: c.amount }))} />
          )}
        </div>
      </div>

      {/* Top 5 most expensive */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Top 5 Most Expensive</h3>
        {topExpensive.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No active subscriptions</p>
        ) : (
          <div className="space-y-3">
            {topExpensive.map((sub, i) => (
              <div key={sub.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                <CategoryIcon category={sub.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sub.name}</p>
                  <p className="text-xs text-gray-500">{sub.plan} · {sub.billingCycle}</p>
                </div>
                <span className="text-sm font-bold text-purple-400 flex-shrink-0">
                  {formatCurrency(sub.amount, sub.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
