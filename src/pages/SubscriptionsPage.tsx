import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, X, ChevronDown, Check, Layers, ArrowUpDown, RefreshCw, AlertTriangle } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { allCategories } from '@/components/shared/CategoryIcon';
import { SubscriptionStatus } from '@/types';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useBillingMe } from '@/hooks/useBilling';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { UpgradeModal } from '@/components/ui/UpgradeModal';

const statuses: SubscriptionStatus[] = ['ACTIVE', 'PAUSED', 'TRIAL', 'CANCELLED'];

const statusColors: Record<SubscriptionStatus, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-green-500/25',
  PAUSED: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  TRIAL: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  CANCELLED: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
};

const statusI18nKeys: Record<SubscriptionStatus, string> = {
  ACTIVE: 'subscriptions.active',
  PAUSED: 'subscriptions.paused',
  TRIAL: 'subscriptions.trial',
  CANCELLED: 'subscriptions.cancelled',
};

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('nextBillingDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const filters = useMemo(() => ({
    category: category || undefined,
    status: status || undefined,
    search: search || undefined,
    sort: sort || undefined,
    order,
  }), [category, status, search, sort, order]);

  const { data: subscriptions, isLoading, isError, refetch } = useSubscriptions(
    (category || status || search) ? filters : { sort, order }
  );
  const { data: billing } = useBillingMe();

  const filtered = subscriptions ?? [];

  const hasFilters = !!category || !!status;
  const isAtSubLimit =
    billing?.subscriptionLimit !== null &&
    billing?.subscriptionLimit !== undefined &&
    (billing?.subscriptionCount ?? 0) >= billing.subscriptionLimit;

  const clearFilters = () => {
    setCategory('');
    setStatus('');
  };

  const handleAddClick = (e: React.MouseEvent) => {
    if (isAtSubLimit) {
      e.preventDefault();
      setUpgradeOpen(true);
    }
  };

  const selectedCategory = allCategories.find(c => c.value === category);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">{t('subscriptions.title')}</h1>
          <p className="page-subtitle">
            {isLoading ? '...' : filtered.length === 1 ? `1 ${t('subscriptions.total_one')}` : `${filtered.length} ${t('subscriptions.total')}`}
          </p>
        </div>
        {isAtSubLimit ? (
          <button
            onClick={() => setUpgradeOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400 border border-yellow-500/30 text-sm font-semibold transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('subscriptions.upgrade_to_add')}</span>
          </button>
        ) : (
          <Link
            to="/app/subscriptions/add"
            onClick={handleAddClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('common.add')}</span>
          </Link>
        )}
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder={t('subscriptions.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={`${sort}-${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            setSort(s);
            setOrder(o as 'asc' | 'desc');
          }}
          className="hidden sm:block px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-400 focus:outline-none focus:border-purple-500/60 transition-all"
        >
          <option value="nextBillingDate-asc">{t('subscriptions.sort_date_asc')}</option>
          <option value="nextBillingDate-desc">{t('subscriptions.sort_date_desc')}</option>
          <option value="amount-desc">{t('subscriptions.sort_amount_desc')}</option>
          <option value="amount-asc">{t('subscriptions.sort_amount_asc')}</option>
          <option value="name-asc">{t('subscriptions.sort_name')}</option>
          <option value="createdAt-desc">{t('subscriptions.sort_newest')}</option>
        </select>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            hasFilters
              ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
              : 'bg-white/5 border-white/8 text-gray-400 hover:text-gray-200 hover:bg-white/8'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">{t('common.filter')}</span>
          {hasFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {filtersOpen && (
        <div className="glass-card rounded-2xl p-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category dropdown (Headless UI Listbox) */}
            <div className="flex-1">
              <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block font-medium uppercase tracking-wide">{t('add.category')}</label>
              <Listbox value={category} onChange={setCategory}>
                <div className="relative">
                  <ListboxButton className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm focus:outline-none focus:border-purple-500/60 transition-all cursor-pointer hover:bg-white/8">
                    <span className="flex items-center gap-2 truncate">
                      {selectedCategory ? (
                        <>{selectedCategory.icon} {selectedCategory.label}</>
                      ) : (
                        t('subscriptions.all_categories')
                      )}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </ListboxButton>
                  <ListboxOptions className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl shadow-black/20 py-1 text-sm focus:outline-none">
                    <ListboxOption
                      value=""
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[focus]:bg-purple-500/10 data-[selected]:text-purple-400"
                    >
                      {({ selected }) => (
                        <>
                          <span className="w-5 flex-shrink-0">{selected && <Check className="w-4 h-4 text-purple-400" />}</span>
                          <span>{t('subscriptions.all_categories')}</span>
                        </>
                      )}
                    </ListboxOption>
                    {allCategories.map((c) => (
                      <ListboxOption
                        key={c.value}
                        value={c.value}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors data-[focus]:bg-purple-500/10 data-[selected]:text-purple-400"
                      >
                        {({ selected }) => (
                          <>
                            <span className="w-5 flex-shrink-0">{selected ? <Check className="w-4 h-4 text-purple-400" /> : c.icon}</span>
                            <span>{c.label}</span>
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>

            {/* Status toggle buttons */}
            <div className="flex-1">
              <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block font-medium uppercase tracking-wide">{t('subscriptions.status')}</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(status === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      status === s
                        ? statusColors[s]
                        : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {t(statusI18nKeys[s])}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="self-end px-3 py-2.5 text-sm text-gray-500 hover:text-gray-200 transition-colors whitespace-nowrap"
              >
                {t('common.filter')} ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {hasFilters && !filtersOpen && (
        <div className="flex items-center gap-2 flex-wrap">
          {category && (
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-purple-600/15 border border-purple-500/25 text-purple-300">
              {selectedCategory?.icon} {selectedCategory?.label ?? category}
              <button onClick={() => setCategory('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {status && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${statusColors[status as SubscriptionStatus]}`}>
              {t(statusI18nKeys[status as SubscriptionStatus])}
              <button onClick={() => setStatus('')}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* List */}
      {isError ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-300 mb-4">{t('common.error_loading')}</p>
          <button onClick={() => refetch()} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
            <RefreshCw className="w-4 h-4" />
            {t('common.retry')}
          </button>
        </div>
      ) : isLoading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={hasFilters ? t('subscriptions.no_match') : t('subscriptions.empty')}
          description={hasFilters ? t('subscriptions.no_match_sub') : t('subscriptions.empty_sub')}
          action={
            hasFilters
              ? { label: t('subscriptions.reset_filters'), onClick: clearFilters }
              : isAtSubLimit
                ? { label: t('subscriptions.upgrade_to_add'), href: '/app/settings' }
                : { label: `+ ${t('subscriptions.add')}`, href: '/app/subscriptions/add' }
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </div>
      )}

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        billing={billing}
        trigger="subscription-limit"
      />
    </div>
  );
}
