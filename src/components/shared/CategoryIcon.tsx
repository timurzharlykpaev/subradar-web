import { Category } from '@/types';

const categoryMap: Record<Category, { icon: string; label: string; color: string }> = {
  STREAMING: { icon: '🎬', label: 'Streaming', color: '#EF4444' },
  AI_SERVICES: { icon: '🤖', label: 'AI Tools', color: '#8B5CF6' },
  INFRASTRUCTURE: { icon: '☁️', label: 'Infrastructure', color: '#3B82F6' },
  MUSIC: { icon: '🎵', label: 'Music', color: '#10B981' },
  GAMING: { icon: '🎮', label: 'Gaming', color: '#F59E0B' },
  PRODUCTIVITY: { icon: '📋', label: 'Productivity', color: '#6366F1' },
  HEALTH: { icon: '💪', label: 'Health & Fitness', color: '#EC4899' },
  NEWS: { icon: '📰', label: 'News', color: '#64748B' },
  OTHER: { icon: '📦', label: 'Other', color: '#94A3B8' },
};

interface CategoryIconProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CategoryIcon({ category, size = 'md', showLabel = false }: CategoryIconProps) {
  const normalized = (category?.toUpperCase() ?? 'OTHER') as Category;
  const { icon, label, color } = categoryMap[normalized] || categoryMap.OTHER;
  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        <span>{icon}</span>
      </div>
      {showLabel && (
        <span className="text-sm" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}

export function getCategoryInfo(category: Category) {
  const normalized = (category?.toUpperCase() ?? 'OTHER') as Category;
  return categoryMap[normalized] || categoryMap.OTHER;
}

export const allCategories = Object.entries(categoryMap).map(([key, val]) => ({
  value: key as Category,
  ...val,
}));
