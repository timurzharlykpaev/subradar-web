import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Pause, Play, X, Check, Loader2, Upload, FileText, Archive } from 'lucide-react';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useSubscription, useUpdateSubscription, useDeleteSubscription, usePauseSubscription, useRestoreSubscription, useCancelSubscription, useArchiveSubscription } from '@/hooks/useSubscriptions';
import { useReceipts, useUploadReceipt, useDeleteReceipt } from '@/hooks/useReceipts';
import { useToast } from '@/providers/ToastProvider';
import { useTranslation } from 'react-i18next';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Category, BillingCycle } from '@/types';
import { allCategories } from '@/components/shared/CategoryIcon';

const billingCycles: { value: BillingCycle; label: string }[] = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
];

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const { data: sub, isLoading } = useSubscription(id!);
  const { data: receipts, isLoading: loadingReceipts } = useReceipts(id!);
  const updateMutation = useUpdateSubscription(id!);
  const deleteMutation = useDeleteSubscription();
  const pauseMutation = usePauseSubscription();
  const restoreMutation = useRestoreSubscription();
  const cancelMutation = useCancelSubscription();
  const archiveMutation = useArchiveSubscription();
  const uploadMutation = useUploadReceipt(id!);
  const deleteReceiptMutation = useDeleteReceipt(id!);

  const handleEdit = () => {
    if (!sub) return;
    setEditForm({
      name: sub.name,
      plan: sub.currentPlan ?? '',
      amount: sub.amount.toString(),
      currency: sub.currency,
      billingCycle: sub.billingPeriod ?? 'MONTHLY',
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
        billingPeriod: editForm.billingCycle as BillingCycle,
        category: editForm.category as Category,
      });
      success(t('common.success'));
      setIsEditing(false);
    } catch {
      error(t('common.error'));
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('detail.delete_confirm'))) return;
    try {
      await deleteMutation.mutateAsync(id!);
      success(t('common.success'));
      navigate('/app/subscriptions');
    } catch {
      error(t('common.error'));
    }
  };

  const handlePause = async () => {
    try {
      await pauseMutation.mutateAsync(id!);
      success(t('detail.paused'));
    } catch { error(t('common.error')); }
  };

  const handleResume = async () => {
    try {
      await restoreMutation.mutateAsync(id!);
      success(t('detail.resumed'));
    } catch { error(t('common.error')); }
  };

  const handleCancel = async () => {
    if (!confirm(t('detail.cancel_confirm'))) return;
    try {
      await cancelMutation.mutateAsync(id!);
      success(t('detail.cancelled'));
    } catch { error(t('common.error')); }
  };

  const handleArchive = async () => {
    if (!confirm(t('detail.archive_confirm'))) return;
    try {
      await archiveMutation.mutateAsync(id!);
      success(t('detail.archived'));
      navigate('/app/subscriptions');
    } catch { error(t('common.error')); }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadMutation.mutateAsync(file);
      success(t('common.success'));
    } catch {
      error(t('common.error'));
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
        <p className="text-gray-400">{t('detail.not_found')}</p>
        <button onClick={() => navigate(-1)} className="text-purple-400 mt-2">{t('common.go_back')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{t('detail.title')}</h1>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {!isEditing ? (
          <>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <CategoryIcon category={sub.category} size="lg" />
                <div>
                  <h2 className="text-2xl font-bold">{sub.name}</h2>
                  <p className="text-gray-400">{sub.currentPlan ?? '—'}</p>
                </div>
              </div>
              <StatusBadge status={sub.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Amount</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(sub.amount, sub.currency)}</p>
                <p className="text-xs text-gray-500">per {sub.billingPeriod?.toLowerCase() ?? '—'}</p>
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
                {sub.paymentCard ? (
                  <CardBrandBadge brand={sub.paymentCard.brand} last4={sub.paymentCard.last4} />
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
                {t('common.edit')}
              </button>
              {(sub.status === 'ACTIVE' || sub.status === 'TRIAL') && (
                <button onClick={handlePause} disabled={pauseMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <Pause className="w-4 h-4" />
                  {t('detail.pause')}
                </button>
              )}
              {sub.status === 'PAUSED' && (
                <button onClick={handleResume} disabled={restoreMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <Play className="w-4 h-4" />
                  {t('detail.resume')}
                </button>
              )}
              {sub.status !== 'CANCELLED' && (
                <button onClick={handleCancel} disabled={cancelMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <X className="w-4 h-4" />
                  {sub.status === 'TRIAL' ? t('detail.cancel_trial') : t('detail.cancel')}
                </button>
              )}
              {sub.status === 'CANCELLED' && (
                <button onClick={handleResume} disabled={restoreMutation.isPending}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                  <Play className="w-4 h-4" />
                  {t('detail.restore')}
                </button>
              )}
              <button onClick={handleArchive} disabled={archiveMutation.isPending}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                <Archive className="w-4 h-4" />
                {t('detail.archive')}
              </button>
              <button onClick={handleDelete} disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all flex-1 justify-center min-w-[100px]">
                <Trash2 className="w-4 h-4" />
                {t('common.delete')}
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
                  {billingCycles.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
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
                  <p className="text-sm truncate">{formatDate(r.uploadedAt)}</p>
                </div>
                <div className="flex gap-2">
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:underline">View</a>
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
