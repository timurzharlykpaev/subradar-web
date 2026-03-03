import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Scan, Check, Loader2 } from 'lucide-react';
import { allCategories } from '@/components/shared/CategoryIcon';
import { usePaymentCards } from '@/hooks/usePaymentCards';
import { useCreateSubscription } from '@/hooks/useSubscriptions';
import { useLookupService, useParseScreenshot, ServiceLookupResult } from '@/hooks/useAI';
import { Category, BillingCycle } from '@/types';
import { useToast } from '@/providers/ToastProvider';

const billingCycles: { value: BillingCycle; label: string }[] = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'LIFETIME', label: 'Lifetime' },
  { value: 'ONE_TIME', label: 'One Time' },
];
const currencies = ['USD', 'EUR', 'GBP', 'KZT', 'RUB', 'AED'];

type Step = 1 | 2 | 3;

interface FormState {
  name: string;
  plan: string;
  amount: string;
  currency: string;
  billingCycle: BillingCycle;
  category: Category;
  cardId: string;
  startDate: string;
  notes: string;
  logoUrl: string;
}

const defaultForm: FormState = {
  name: '',
  plan: '',
  amount: '',
  currency: 'USD',
  billingCycle: 'MONTHLY',
  category: 'OTHER',
  cardId: '',
  startDate: new Date().toISOString().split('T')[0],
  notes: '',
  logoUrl: '',
};

export default function AddSubscriptionPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [aiQuery, setAiQuery] = useState('');
  const [foundService, setFoundService] = useState<ServiceLookupResult | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cards } = usePaymentCards();
  const createMutation = useCreateSubscription();
  const lookupMutation = useLookupService();
  const parseMutation = useParseScreenshot();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    try {
      const result = await lookupMutation.mutateAsync(aiQuery);
      setFoundService(result);
      const firstPlan = result.plans[0];
      setForm((f) => ({
        ...f,
        name: result.name,
        logoUrl: result.logoUrl ?? '',
        category: ((result.category as string)?.toUpperCase() as Category) || 'OTHER',
        plan: firstPlan?.name ?? '',
        amount: firstPlan?.amount?.toString() ?? '',
        currency: firstPlan?.currency ?? 'USD',
        billingCycle: ((firstPlan?.billingCycle as string)?.toUpperCase() as BillingCycle) ?? 'MONTHLY',
      }));
    } catch {
      error('Service not found. Please enter details manually.');
      setFoundService(null);
      setForm((f) => ({ ...f, name: aiQuery }));
    }
    setStep(2);
  };

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await parseMutation.mutateAsync(file);
      setForm((f) => ({
        ...f,
        name: result.name ?? f.name,
        amount: result.amount?.toString() ?? f.amount,
        currency: result.currency ?? f.currency,
        billingCycle: (result.billingPeriod as BillingCycle) ?? f.billingCycle,
        category: result.category ?? f.category,
      }));
      success('Receipt scanned! Form pre-filled.');
      setStep(2);
    } catch {
      error('Could not parse receipt. Please fill manually.');
    }
  };

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync({
        name: form.name,
        currentPlan: form.plan || undefined,
        amount: parseFloat(form.amount),
        currency: form.currency,
        billingPeriod: form.billingCycle,
        category: form.category,
        startDate: form.startDate || undefined,
        notes: form.notes || undefined,
        iconUrl: form.logoUrl || undefined,
        paymentCardId: form.cardId || undefined,
      });
      success('Subscription added!');
      navigate('/app/subscriptions');
    } catch {
      error('Failed to add subscription. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : navigate(-1)}
          className="p-2 rounded-xl hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Add Subscription</h1>
          <p className="text-xs text-gray-400">Step {step} of 3</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-purple-500' : 'bg-white/10'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-400" />
              Find a Service
            </h2>
            <form onSubmit={handleLookup} className="space-y-3">
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. Netflix, Spotify, GitHub..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={lookupMutation.isPending || !aiQuery.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {lookupMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {lookupMutation.isPending ? 'Searching...' : 'Search with AI'}
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 bg-[#0f0f13]">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setStep(2)}
              className="glass-card rounded-2xl p-4 hover:border-purple-500/40 transition-all text-sm font-medium text-center"
            >
              Add Manually
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={parseMutation.isPending}
              className="glass-card rounded-2xl p-4 hover:border-purple-500/40 transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              {parseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4 text-purple-400" />}
              Scan Receipt
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScanReceipt}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-card rounded-2xl p-5 space-y-4">
          {foundService && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
              {foundService.logoUrl && (
                <img src={foundService.logoUrl} alt={foundService.name} className="w-10 h-10 rounded-lg object-contain" />
              )}
              <div>
                <p className="font-semibold text-sm">{foundService.name}</p>
                <p className="text-xs text-purple-400">{foundService.plans.length} plan(s) available</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Service Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Netflix"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Plan</label>
              <input
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                placeholder="e.g. Premium"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              >
                {allCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Amount *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="9.99"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Billing Cycle</label>
              <select
                value={form.billingCycle}
                onChange={(e) => setForm({ ...form, billingCycle: e.target.value as BillingCycle })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              >
                {billingCycles.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            {cards && cards.length > 0 && (
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Payment Card</label>
                <select
                  value={form.cardId}
                  onChange={(e) => setForm({ ...form, cardId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">No card</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>{c.nickname} •••• {c.last4}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes..."
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => form.name && form.amount ? setStep(3) : undefined}
            disabled={!form.name || !form.amount}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
          >
            Continue to Review
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Confirm Details
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Service', value: form.name },
                { label: 'Plan', value: form.plan || '—' },
                { label: 'Amount', value: `${form.amount} ${form.currency} / ${form.billingCycle.toLowerCase()}` },
                { label: 'Category', value: form.category.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) },
                { label: 'Start Date', value: form.startDate },
                { label: 'Card', value: form.cardId ? cards?.find((c) => c.id === form.cardId)?.nickname ?? '—' : 'None' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all disabled:opacity-60"
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {createMutation.isPending ? 'Adding...' : 'Add Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}
