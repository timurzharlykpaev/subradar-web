import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Pause, Play, X, Check, Loader2, Upload, FileText } from 'lucide-react';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useSubscription, useUpdateSubscription, useDeleteSubscription } from '@/hooks/useSubscriptions';
import { useReceipts, useUploadReceipt, useDeleteReceipt } from '@/hooks/useReceipts';
import { useToast } from '@/providers/ToastProvider';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Category, BillingCycle } from '@/types';
import { allCategories } from '@/components/shared/CategoryIcon';

const billingCycles: BillingCycle[] = ['monthly', 'yearly', 'weekly', 'quarterly'];

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const { data: sub, isLoading } = useSubscription(id!);
  const { data: receipts, isLoading: loadingReceipts } = useReceipts(id!);
  const updateMutation = useUpdateSubscription(id!);
  const deleteMutation = useDeleteSubscription();
  const uploadMutation = useUploadReceipt(id!);
  const deleteReceiptMutation = useDeleteReceipt(id!);

  const handleEdit = () => {
    if (!sub) return;
    setEditForm({
      name: sub.name,
      plan: sub.plan,
      amount: sub.amount.toString(),
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      category: sub.category,
      notes: sub.notes ?? '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        ...editForm,
        amount: parseFloat(editForm.amount),
        billingCycle: editForm.billingCycle as BillingCycle,
        category: editForm.category as Category,
      });
      success('Subscription updated!');
      setIsEditing(false);
    } catch {
      error('Failed to update subscription.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this subscription?')) return;
    try {
      await deleteMutation.mutateAsync(id!);
      success('Subscription deleted');
      navigate('/app/subscriptions');
    } catch {
      error('Failed to delete subscription.');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ status: newStatus as never });
      success(`Subscription ${newStatus}`);
    } catch {
      error('Failed to update status.');
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadMutation.mutateAsync(file);
      success('Receipt uploaded!');
    } catch {
      error('Failed to upload receipt.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Subscription not found</p>
        <button onClick={() => navigate(-1)} className="text-purple-400 mt-2">Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Subscription Details</h1>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {!isEditing ? (
          <>
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
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(sub.amount, sub.currency)}</p>
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

            {sub.notes && (
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm">{sub.notes}</p>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              {sub.status === 'active' && (
                <button onClick={() => handleStatusChange('paused')} disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
              {sub.status === 'paused' && (
                <button onClick={() => handleStatusChange('active')} disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}
              {sub.status !== 'cancelled' && (
                <button onClick={() => handleStatusChange('cancelled')} disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button onClick={handleDelete} disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold">Edit Subscription</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Plan</label>
                <input value={editForm.plan} onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500">
                  {allCategories.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                <input type="number" step="0.01" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Billing Cycle</label>
                <select value={editForm.billingCycle} onChange={(e) => setEditForm({ ...editForm, billingCycle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500">
                  {billingCycles.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                <textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={updateMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save
              </button>
              <button onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Receipts</h3>
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-sm">
            {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleReceiptUpload} />
          </label>
        </div>
        {loadingReceipts ? (
          <div className="space-y-2">
            {[0, 1].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : receipts && receipts.length > 0 ? (
          <div className="space-y-2">
            {receipts.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{formatDate(r.date)}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(r.amount, sub.currency)}</p>
                </div>
                <div className="flex gap-2">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:underline">View</a>
                  <button onClick={() => deleteReceiptMutation.mutate(r.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">No receipts yet. Upload one to get started.</p>
        )}
      </div>
    </div>
  );
}
