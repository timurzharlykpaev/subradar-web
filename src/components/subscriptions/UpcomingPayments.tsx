import { Link } from 'react-router-dom';
import { Subscription } from '@/types';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { formatCurrency, daysUntil } from '@/lib/utils';
import { Calendar, ArrowRight } from 'lucide-react';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

export function UpcomingPayments({ subscriptions }: UpcomingPaymentsProps) {
  const upcoming = subscriptions
    .filter((s) => s.status === 'ACTIVE' || s.status === 'TRIAL')
    .filter((s) => s.nextPaymentDate)
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate!).getTime() - new Date(b.nextPaymentDate!).getTime()
    )
    .slice(0, 5);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="section-title mb-0">Upcoming Payments</p>
        <Link
          to="/app/subscriptions"
          className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-sm text-gray-500">No upcoming payments in the next 7 days</p>
        </div>
      ) : (
        <div className="space-y-1">
          {upcoming.map((sub, i) => {
            const days = daysUntil(sub.nextPaymentDate) ?? 0;
            const isUrgent = days <= 3 && days >= 0;
            const isToday = days === 0;

            return (
              <Link
                key={sub.id}
                to={`/app/subscriptions/${sub.id}`}
                className="flex items-center gap-3 py-2.5 rounded-xl px-2 -mx-2 hover:bg-white/4 transition-all group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CategoryIcon category={sub.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-purple-300 transition-colors">
                    {sub.name}
                  </p>
                  <p className={`text-xs font-medium ${
                    isToday ? 'text-orange-400' : isUrgent ? 'text-yellow-500' : 'text-gray-600'
                  }`}>
                    {isToday
                      ? 'Due today'
                      : days === 1
                      ? 'Tomorrow'
                      : `In ${days} days`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-200">
                    {formatCurrency(sub.amount, sub.currency)}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
