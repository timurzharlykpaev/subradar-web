
import { Link } from 'react-router-dom';
import { Subscription } from '@/types';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { formatCurrency, formatDate, daysUntil } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick?: () => void;
}

export function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
  const days = daysUntil(subscription.nextPaymentDate);
  const isUrgent = days <= 3 && days >= 0;

  return (
    <Link to={`/app/subscriptions/${subscription.id}`} onClick={onClick}>
      <div className="glass-card rounded-2xl p-4 hover:border-purple-500/40 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CategoryIcon category={subscription.category} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{subscription.name}</h3>
                <StatusBadge status={subscription.status} />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{subscription.plan}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-sm text-purple-400">
              {formatCurrency(subscription.amount, subscription.currency)}
            </p>
            <p className="text-xs text-gray-500">/{subscription.billingCycle}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            {subscription.card && (
              <CardBrandBadge brand={subscription.card.brand} last4={subscription.card.last4} />
            )}
          </div>
          <div className={`text-xs ${isUrgent ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
            {days < 0
              ? 'Overdue'
              : days === 0
              ? 'Due today'
              : `Due in ${days}d — ${formatDate(subscription.nextPaymentDate)}`}
          </div>
        </div>
      </div>
    </Link>
  );
}
