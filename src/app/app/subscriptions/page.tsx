'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { mockSubscriptions } from '@/lib/mockData';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { allCategories } from '@/components/shared/CategoryIcon';
import { SubscriptionStatus } from '@/types';
import { useTranslation } from 'react-i18next';

const statuses: SubscriptionStatus[] = ['active', 'paused', 'trial', 'cancelled'];

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const filtered = mockSubscriptions.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || s.category === category;
    const matchStatus = !status || s.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('subscriptions.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">{mockSubscriptions.length} total</p>
        </div>
        <Link
          href="/app/subscriptions/add"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t('common.add')}</span>
        </Link>
      </div>

      {/* Search & Filters */}
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

      {/* Subscription list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>{t('subscriptions.empty')}</p>
            <Link href="/app/subscriptions/add" className="text-purple-400 text-sm mt-2 inline-block hover:underline">
              + {t('subscriptions.empty_sub')}
            </Link>
          </div>
        )}
        {filtered.map((sub) => (
          <SubscriptionCard key={sub.id} subscription={sub} />
        ))}
      </div>
    </div>
  );
}
