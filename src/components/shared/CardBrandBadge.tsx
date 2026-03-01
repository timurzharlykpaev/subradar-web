import { CardBrand } from '@/types';

const brandConfig: Record<CardBrand, { label: string; color: string; bg: string }> = {
  visa: { label: 'VISA', color: '#1A1F71', bg: '#EEF2FF' },
  mastercard: { label: 'MC', color: '#EB001B', bg: '#FFF1F2' },
  amex: { label: 'AMEX', color: '#007BC1', bg: '#EFF6FF' },
  mir: { label: 'МИР', color: '#00B956', bg: '#F0FDF4' },
  other: { label: 'CARD', color: '#6B7280', bg: '#F3F4F6' },
};

interface CardBrandBadgeProps {
  brand: CardBrand;
  last4?: string;
}

export function CardBrandBadge({ brand, last4 }: CardBrandBadgeProps) {
  const { label, color, bg } = brandConfig[brand] || brandConfig.other;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-xs font-bold px-1.5 py-0.5 rounded"
        style={{ color, backgroundColor: bg }}
      >
        {label}
      </span>
      {last4 && (
        <span className="text-xs text-gray-400">••••{last4}</span>
      )}
    </div>
  );
}
