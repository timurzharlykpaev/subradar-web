import { Link } from 'react-router-dom';
import { Subscription } from '@/types';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { formatCurrency, daysUntil } from '@/lib/utils';
import { ChevronRight, Clock } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick?: () => void;
}

export function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
  const days = daysUntil(subscription.nextPaymentDate);
  const isUrgent = days !== null && days <= 3 && days >= 0;
  const isOverdue = days !== null && days < 0;

  const dueBadgeColor = isOverdue
    ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : isUrgent
    ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    : 'text-gray-500 bg-white/4 border-white/8';

  const dueText = days === null
    ? '—'
    : isOverdue
    ? 'Overdue'
    : days === 0
    ? 'Due today'
    : days === 1
    ? 'Due tomorrow'
    : `Due in ${days}d`;

  const billingLabel = subscription.billingPeriod?.toLowerCase() ?? '';

  return (
    <Link to={`/app/subscriptions/${subscription.id}`} onClick={onClick} className="block group">
      <div className="glass-card rounded-2xl px-4 py-3.5 hover:border-purple-500/25 transition-all duration-150 group-hover:shadow-lg group-hover:shadow-purple-500/5">
        <div className="flex items-center gap-3">
          <CategoryIcon category={subscription.category} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-sm leading-tight truncate">{subscription.name}</span>
              <StatusBadge status={subscription.status} />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {subscription.currentPlan && <span className="truncate max-w-[120px]">{subscription.currentPlan}</span>}
              {subscription.paymentCard && (
                <>
                  <span className="text-gray-700">·</span>
                  <CardBrandBadge brand={subscription.paymentCard.brand} last4={subscription.paymentCard.last4} />
                </>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
            <p className="font-bold text-sm text-purple-300 leading-tight">
              {formatCurrency(subscription.amount, subscription.currency)}
              <span className="text-[11px] text-gray-600 font-normal">/{billingLabel}</span>
            </p>
            {days !== null && (
              <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md border font-medium ${dueBadgeColor}`}>
                <Clock className="w-2.5 h-2.5" />
                {dueText}
              </span>
            )}
          </div>

          <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0 ml-0.5" />
        </div>
      </div>
    </Link>
  );
}
