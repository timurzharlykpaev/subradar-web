import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit3, Loader2, CreditCard } from 'lucide-react';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { PaymentCard, CardBrand } from '@/types';
import { usePaymentCards, useCreateCard, useUpdateCard, useDeleteCard } from '@/hooks/usePaymentCards';
import { useToast } from '@/providers/ToastProvider';
import { SkeletonCard } from '@/components/ui/Skeleton';

const CARD_COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#EF4444', '#F59E0B', '#EC4899'];
const CARD_BRANDS: CardBrand[] = ['VISA', 'MC', 'AMEX', 'MIR', 'OTHER'];

const emptyForm = {
  nickname: '',
  last4: '',
  brand: 'VISA' as CardBrand,
  color: CARD_COLORS[0],
};

interface CardFormProps {
  form: typeof emptyForm;
  setForm: (f: typeof emptyForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  isPending: boolean;
  onCancel: () => void;
}

function CardForm({ form, setForm, onSubmit, submitLabel, isPending, onCancel }: CardFormProps) {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold">{submitLabel}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">{t('cards.nickname')}</label>
          <input required value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder={t('cards.nickname_placeholder')}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{t('cards.last4')}</label>
          <input required maxLength={4} value={form.last4}
            onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, '') })}
            placeholder="4242"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{t('cards.brand')}</label>
          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value as CardBrand })}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500">
            {CARD_BRANDS.map((b) => <option key={b} value={b}>{b.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-2 block">{t('cards.card_color')}</label>
          <div className="flex gap-2">
            {CARD_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-60">
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-all">
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );

}

export default function CardsPage() {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const { data: cards, isLoading } = usePaymentCards();
  const createMutation = useCreateCard();
  const deleteMutation = useDeleteCard();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const updateMutation = useUpdateCard(editingId ?? '');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        nickname: form.nickname,
        last4: form.last4,
        brand: form.brand,
        color: form.color,
      });
      success(t('common.success'));
      setShowForm(false);
      setForm(emptyForm);
    } catch {
      error(t('common.error'));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        nickname: form.nickname,
        last4: form.last4,
        brand: form.brand,
        color: form.color,
      });
      success(t('common.success'));
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      error(t('common.error'));
    }
  };

  const handleEdit = (card: PaymentCard) => {
    setEditingId(card.id);
    setForm({
      nickname: card.nickname,
      last4: card.last4,
      brand: card.brand,
      color: card.color,
    });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('cards.remove_confirm'))) return;
    try {
      await deleteMutation.mutateAsync(id);
      success(t('common.success'));
    } catch {
      error(t('common.error'));
    }
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('cards.title')}</h1>
          <p className="text-gray-400 text-sm mt-1">{cards?.length ?? 0} {t('cards.subtitle')}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('cards.add')}
        </button>
      </div>

      {showForm && <CardForm form={form} setForm={setForm} onSubmit={handleAdd} submitLabel={t('cards.add')} isPending={createMutation.isPending} onCancel={handleCancel} />}
      {editingId && <CardForm form={form} setForm={setForm} onSubmit={handleUpdate} submitLabel={t('cards.update')} isPending={updateMutation.isPending} onCancel={handleCancel} />}

      {!isLoading && (cards ?? []).length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-300 font-semibold mb-1">{t('cards.no_linked')}</p>
          <p className="text-gray-500 text-sm mb-6">{t('cards.no_linked_sub')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('cards.add_first')}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(cards ?? []).map((card) => (
            <div key={card.id} className="glass-card rounded-2xl p-5">
              <div
                className="w-full h-28 sm:h-32 rounded-xl mb-4 p-4 flex flex-col justify-between relative overflow-hidden"
                style={{ backgroundColor: card.color }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white" />
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/70 text-sm">{card.nickname}</p>
                  <CardBrandBadge brand={card.brand} />
                </div>
                <div>
                  <p className="text-sm sm:text-base text-white font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(card)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm flex-1 justify-center transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm flex-1 justify-center transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
