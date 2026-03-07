import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Timer, ExternalLink, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import type { TrialSubscription } from '@/hooks/useAnalytics';
import type { Category } from '@/types';

interface TrialTrackerProps {
  trials: TrialSubscription[];
}

export function TrialTracker({ trials }: TrialTrackerProps) {
  const { t } = useTranslation();

  if (trials.length === 0) return null;

  const sorted = [...trials].sort((a, b) => (a.daysUntilTrialEnd ?? 99) - (b.daysUntilTrialEnd ?? 99));

  return (
    <div className="glass-card rounded-2xl p-5 border border-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Timer className="w-4 h-4 text-blue-400" />
          </div>
          <p className="section-title mb-0">{t('trials.title')}</p>
        </div>
        <Link
          to="/app/subscriptions?status=TRIAL"
          className="text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          {t('common.view_all')} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-1">
        {sorted.map((trial, i) => {
          const days = trial.daysUntilTrialEnd;
          const isUrgent = trial.isExpiringSoon;
          const isExpired = trial.isExpired;

          return (
            <div
              key={trial.id}
              className="flex items-center gap-3 py-2.5 rounded-xl px-2 -mx-2 hover:bg-white/4 transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CategoryIcon category={(trial as any).category as Category ?? 'OTHER'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{trial.name}</p>
                <p className={`text-xs font-medium ${
                  isExpired ? 'text-red-400' : isUrgent ? 'text-orange-400' : 'text-blue-400'
                }`}>
                  {isExpired
                    ? t('trials.expired')
                    : days === 0
                    ? t('trials.ends_today')
                    : days === 1
                    ? t('trials.ends_tomorrow')
                    : t('trials.days_left', { count: days })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {t('trials.then')} {formatCurrency(trial.amount, trial.currency)}
                </span>
                {trial.cancelUrl && (
                  <a
                    href={trial.cancelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                  >
                    {t('trials.cancel')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {isUrgent && !isExpired && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
