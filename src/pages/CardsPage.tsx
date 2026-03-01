import { useState } from 'react';
import { Plus, Trash2, Edit3, Loader2 } from 'lucide-react';
import { CardBrandBadge } from '@/components/shared/CardBrandBadge';
import { PaymentCard, CardBrand } from '@/types';
import { usePaymentCards, useCreateCard, useUpdateCard, useDeleteCard } from '@/hooks/usePaymentCards';
import { useToast } from '@/providers/ToastProvider';
import { SkeletonCard } from '@/components/ui/Skeleton';

const CARD_COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#EF4444', '#F59E0B', '#EC4899'];
const CARD_BRANDS: CardBrand[] = ['visa', 'mastercard', 'amex', 'mir', 'other'];

const emptyForm = {
  nickname: '',
  last4: '',
  brand: 'visa' as CardBrand,
  color: CARD_COLORS[0],
  expiryMonth: '',
  expiryYear: '',
};

export default function CardsPage() {
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
        expiryMonth: parseInt(form.expiryMonth),
        expiryYear: parseInt(form.expiryYear),
      });
      success('Card added!');
      setShowForm(false);
      setForm(emptyForm);
    } catch {
      error('Failed to add card.');
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
        expiryMonth: parseInt(form.expiryMonth),
        expiryYear: parseInt(form.expiryYear),
      });
      success('Card updated!');
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      error('Failed to update card.');
    }
  };

  const handleEdit = (card: PaymentCard) => {
    setEditingId(card.id);
    setForm({
      nickname: card.nickname,
      last4: card.last4,
      brand: card.brand,
      color: card.color,
      expiryMonth: card.expiryMonth.toString(),
      expiryYear: card.expiryYear.toString(),
    });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this card?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      success('Card removed.');
    } catch {
      error('Failed to remove card.');
    }
  };

  const CardForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold">{submitLabel === 'Add Card' ? 'New Card' : 'Edit Card'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Nickname</label>
          <input required value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="e.g. Main Card"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Last 4 digits</label>
          <input required maxLength={4} value={form.last4}
            onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, '') })}
            placeholder="4242"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Brand</label>
          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value as CardBrand })}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500">
            {CARD_BRANDS.map((b) => <option key={b} value={b}>{b.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Expiry Month</label>
          <input type="number" min="1" max="12" value={form.expiryMonth}
            onChange={(e) => setForm({ ...form, expiryMonth: e.target.value })}
            placeholder="12"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Expiry Year</label>
          <input type="number" min="2024" value={form.expiryYear}
            onChange={(e) => setForm({ ...form, expiryYear: e.target.value })}
            placeholder="2027"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-2 block">Card Color</label>
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
        <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-60">
          {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
        <button type="button"
          onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
          className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-all">
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Cards</h1>
          <p className="text-gray-400 text-sm mt-1">{cards?.length ?? 0} cards linked</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      {showForm && <CardForm onSubmit={handleAdd} submitLabel="Add Card" />}
      {editingId && <CardForm onSubmit={handleUpdate} submitLabel="Update Card" />}

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
                  <p className="text-white/60 text-xs mt-1">
                    {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(card)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm flex-1 justify-center transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm flex-1 justify-center transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
