import { SubscriptionStatus } from '@/types';

const statusConfig: Record<SubscriptionStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#10B981', bg: '#D1FAE5' },
  trial: { label: 'Trial', color: '#F59E0B', bg: '#FEF3C7' },
  paused: { label: 'Paused', color: '#6B7280', bg: '#F3F4F6' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { label, color, bg } = statusConfig[status];
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
