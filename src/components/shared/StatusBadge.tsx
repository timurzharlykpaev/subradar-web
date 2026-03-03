import { SubscriptionStatus } from '@/types';

const statusConfig: Record<SubscriptionStatus, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Active', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  TRIAL: { label: 'Trial', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  PAUSED: { label: 'Paused', color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  CANCELLED: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const normalized = (status?.toUpperCase() ?? 'ACTIVE') as SubscriptionStatus;
  const cfg = statusConfig[normalized] ?? statusConfig.ACTIVE;
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}
