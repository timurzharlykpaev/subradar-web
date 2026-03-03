import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { BillingInfo } from '@/types';

interface UsageBarProps {
  label: string;
  used: number;
  limit: number | null;
  onUpgradeClick?: () => void;
}

function UsageBar({ label, used, limit, onUpgradeClick }: UsageBarProps) {
  if (limit === null) return null;
  const pct = Math.min((used / limit) * 100, 100);
  const isNearLimit = pct >= 80;
  const isAtLimit = pct >= 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className={cn('font-medium', isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-300')}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-purple-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isAtLimit && onUpgradeClick && (
        <button onClick={onUpgradeClick} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
          Upgrade to unlock more →
        </button>
      )}
    </div>
  );
}

interface PlanUsageBarProps {
  billing: BillingInfo;
  onUpgradeClick?: () => void;
}

export function PlanUsageBar({ billing, onUpgradeClick }: PlanUsageBarProps) {
  const { t } = useTranslation();
  const showSubLimit = billing.subscriptionLimit !== null;
  const showAiLimit = billing.aiRequestsLimit !== null;

  if (!showSubLimit && !showAiLimit) return null;

  return (
    <div className="space-y-3">
      {showSubLimit && (
        <UsageBar
          label={t('subscriptions.title')}
          used={billing.subscriptionCount}
          limit={billing.subscriptionLimit}
          onUpgradeClick={onUpgradeClick}
        />
      )}
      {showAiLimit && (
        <UsageBar
          label={t('plan.ai_requests')}
          used={billing.aiRequestsUsed}
          limit={billing.aiRequestsLimit}
          onUpgradeClick={onUpgradeClick}
        />
      )}
    </div>
  );
}
