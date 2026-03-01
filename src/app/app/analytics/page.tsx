'use client';

import { mockAnalytics, mockSubscriptions } from '@/lib/mockData';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { CardBreakdownChart } from '@/components/charts/CardBreakdownChart';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const analytics = mockAnalytics;

  const topExpensive = [...mockSubscriptions]
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
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Monthly', value: formatCurrency(analytics.totalMonthly) },
          { label: 'Yearly', value: formatCurrency(analytics.totalYearly) },
          { label: 'Active', value: analytics.activeCount.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-lg font-bold text-purple-400">{value}</p>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Monthly Spend Trend</h3>
        <MonthlyBarChart data={analytics.monthlyTrend} />
      </div>

      {/* Category & Card breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-gray-300 mb-4">By Category</h3>
          <CategoryDonutChart data={analytics.byCategory} />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-gray-300 mb-4">By Card</h3>
          <CardBreakdownChart data={analytics.byCard} />
        </div>
      </div>

      {/* Top 5 most expensive */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-300 mb-4">Top 5 Most Expensive</h3>
        <div className="space-y-3">
          {topExpensive.map((sub, i) => (
            <div key={sub.id} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-4">{i + 1}</span>
              <CategoryIcon category={sub.category} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-medium">{sub.name}</p>
                <p className="text-xs text-gray-500">{sub.plan} · {sub.billingCycle}</p>
              </div>
              <span className="text-sm font-bold text-purple-400">
                {formatCurrency(sub.amount, sub.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
