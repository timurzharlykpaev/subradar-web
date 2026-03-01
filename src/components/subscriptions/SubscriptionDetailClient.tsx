
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { useSubscription, useDeleteSubscription } from '@/hooks/useSubscriptions';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { ReceiptUploader } from '@/components/subscriptions/ReceiptUploader';
import { formatCurrency, formatDate } from '@/lib/utils';

export function SubscriptionDetailClient({ id }: { id: string }) {
  const router = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { data: sub, isLoading } = useSubscription(id);
  const deleteSub = useDeleteSubscription();

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!sub) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Subscription not found</p>
        <button onClick={() => router(-1)} className="text-purple-400 mt-2">Go back</button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteSub.mutateAsync(id);
    router('/app/subscriptions');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router(-1)}
          className="p-2 rounded-xl hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Subscription Details</h1>
      </div>

      {/* Main card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <CategoryIcon category={sub.category} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">{sub.name}</h2>
              <p className="text-gray-400">{sub.plan}</p>
            </div>
          </div>
          <StatusBadge status={sub.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Amount</p>
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(sub.amount, sub.currency)}
            </p>
            <p className="text-xs text-gray-500">per {sub.billingCycle}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Next Payment</p>
            <p className="text-lg font-semibold">{formatDate(sub.nextPaymentDate)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Started</p>
            <p className="text-sm font-medium">{formatDate(sub.startDate)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Payment Card</p>
            {sub.card ? (
              <CardBrandBadge brand={sub.card.brand} last4={sub.card.last4} />
            ) : (
              <p className="text-sm text-gray-500">No card linked</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-sm font-semibold transition-all flex-1 justify-center"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteSub.isPending}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all flex-1 justify-center disabled:opacity-60"
          >
            <Trash2 className="w-4 h-4" />
            {deleteSub.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Receipts */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Receipts</h3>
        <ReceiptUploader subscriptionId={sub.id} />
      </div>
    </div>
  );
}
