import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useBillingMe } from '@/hooks/useBilling';
import { Lock } from 'lucide-react';

export type GatedFeature =
  | 'ai-text'
  | 'ai-photo'
  | 'advanced-analytics'
  | 'forecast'
  | 'audit'
  | 'unlimited-reports'
  | 'workspace'
  | 'export'
  | 'custom-tags'
  | 'trial-killer';

const PRO_FEATURES: GatedFeature[] = [
  'ai-text', 'ai-photo', 'advanced-analytics', 'forecast',
  'audit', 'unlimited-reports', 'export', 'custom-tags', 'trial-killer',
];

const TEAM_FEATURES: GatedFeature[] = ['workspace'];

function isFeatureAllowed(plan: string, feature: GatedFeature): boolean {
  if (plan === 'team') return true;
  if (plan === 'pro') return PRO_FEATURES.includes(feature);
  return false;
}

interface FeatureGateProps {
  feature: GatedFeature;
  children: ReactNode;
  fallback?: ReactNode;
}

function DefaultFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
      <Lock className="w-4 h-4 text-purple-400 flex-shrink-0" />
      <span className="text-sm text-purple-300">{t('common.pro_required')}</span>
    </div>
  );
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { data: billing } = useBillingMe();
  const plan = billing?.plan ?? 'free';
  const isTrial = billing?.status === 'trialing';

  if (isFeatureAllowed(plan, feature) || isTrial) {
    return <>{children}</>;
  }

  return <>{fallback ?? <DefaultFallback />}</>;
}

export function useFeatureAllowed(feature: GatedFeature): boolean {
  const { data: billing } = useBillingMe();
  const plan = billing?.plan ?? 'free';
  const isTrial = billing?.status === 'trialing';
  return isFeatureAllowed(plan, feature) || isTrial;
}
