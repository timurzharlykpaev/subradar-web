
import { Subscription } from '@/types';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { formatCurrency, daysUntil } from '@/lib/utils';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

export function UpcomingPayments({ subscriptions }: UpcomingPaymentsProps) {
  const upcoming = subscriptions
    .filter((s) => s.status === 'active' || s.status === 'trial')
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
    )
    .slice(0, 5);

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-sm text-gray-300 mb-4">Upcoming Payments</h3>
      <div className="space-y-3">
        {upcoming.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No upcoming payments</p>
        )}
        {upcoming.map((sub) => {
          const days = daysUntil(sub.nextPaymentDate);
          return (
            <div key={sub.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CategoryIcon category={sub.category} size="sm" />
                <div>
                  <p className="text-sm font-medium">{sub.name}</p>
                  <p className={`text-xs ${days <= 3 ? 'text-red-400' : 'text-gray-500'}`}>
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-purple-400">
                {formatCurrency(sub.amount, sub.currency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
