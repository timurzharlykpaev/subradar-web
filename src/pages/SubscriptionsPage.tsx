import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { allCategories } from '@/components/shared/CategoryIcon';
import { SubscriptionStatus } from '@/types';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const statuses: SubscriptionStatus[] = ['active', 'paused', 'trial', 'cancelled'];

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const { data: subscriptions, isLoading } = useSubscriptions(
    category || status ? { category: category || undefined, status: status || undefined } : undefined
  );

  const filtered = (subscriptions ?? []).filter((s) => {
    return !search || s.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('subscriptions.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} total</p>
        </div>
        <Link
          to="/app/subscriptions/add"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t('common.add')}</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('subscriptions.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-0 flex-1 sm:flex-none px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 transition-all"
        >
          <option value="">{t('subscriptions.all_categories')}</option>
          {allCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-w-0 flex-1 sm:flex-none px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 transition-all"
        >
          <option value="">{t('subscriptions.all_statuses')}</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <SkeletonList count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('subscriptions.empty')}
          description={t('subscriptions.empty_sub')}
          action={{ label: `+ ${t('subscriptions.empty_sub')}`, href: '/app/subscriptions/add' }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </div>
      )}
    </div>
  );
}
