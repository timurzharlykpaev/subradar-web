import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Scan, Check, Loader2, MessageSquare } from 'lucide-react';
import VoiceSearchButton from '@/components/shared/VoiceSearchButton';
import { allCategories } from '@/components/shared/CategoryIcon';
import { usePaymentCards } from '@/hooks/usePaymentCards';
import { useCreateSubscription } from '@/hooks/useSubscriptions';
import { useLookupService, useParseScreenshot, useParseTextSubscription, ServiceLookupResult } from '@/hooks/useAI';
import { Category, BillingCycle } from '@/types';
import { useToast } from '@/providers/ToastProvider';
import { useTranslation } from 'react-i18next';
import { FeatureGate, useFeatureAllowed } from '@/components/shared/FeatureGate';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error } = useToast();

  const initialMode = searchParams.get('mode');
  const [step, setStep] = useState<Step>(initialMode === 'text' || initialMode === 'photo' ? 1 : 1);
  const [aiQuery, setAiQuery] = useState('');
  const [aiText, setAiText] = useState('');
  const [foundService, setFoundService] = useState<ServiceLookupResult | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aiTextAllowed = useFeatureAllowed('ai-text');
  const aiPhotoAllowed = useFeatureAllowed('ai-photo');

  const { data: cards } = usePaymentCards();
  const createMutation = useCreateSubscription();
  const lookupMutation = useLookupService();
  const parseMutation = useParseScreenshot();
  const parseTextMutation = useParseTextSubscription();

  const billingCycles: { value: BillingCycle; label: string }[] = [
    { value: 'MONTHLY', label: t('subscriptions.monthly') },
    { value: 'YEARLY', label: t('subscriptions.yearly') },
    { value: 'WEEKLY', label: t('subscriptions.weekly') },
    { value: 'QUARTERLY', label: t('subscriptions.quarterly') },
    { value: 'LIFETIME', label: 'Lifetime' },
    { value: 'ONE_TIME', label: 'One Time' },
  ];

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
      error(t('common.error'));
      setFoundService(null);
      setForm((f) => ({ ...f, name: aiQuery }));
    }
    setStep(2);
  };

  const handleParseText = async () => {
    if (!aiText.trim()) return;
    try {
      const result = await parseTextMutation.mutateAsync(aiText);
      if (result.parsed) {
        setForm((f) => ({
          ...f,
          name: result.parsed.name ?? f.name,
          amount: result.parsed.amount?.toString() ?? f.amount,
          currency: result.parsed.currency ?? f.currency,
          billingCycle: (result.parsed.billingPeriod as BillingCycle) ?? f.billingCycle,
          category: (result.parsed.category as Category) ?? f.category,
        }));
      }
      success(t('common.success'));
      setStep(2);
    } catch {
      error(t('common.error'));
    }
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
      success(t('common.success'));
      setStep(2);
    } catch {
      error(t('common.error'));
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
      success(t('common.success'));
      navigate('/app/subscriptions');
    } catch {
      error(t('common.error'));
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
          <h1 className="text-xl font-bold">{t('add.title')}</h1>
          <p className="text-xs text-gray-400">{t('add.step_of', { step, total: 3 })}</p>
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
              {t('add.find_service')}
            </h2>
            <form onSubmit={handleLookup} className="space-y-3">
              <div className="relative flex items-center gap-2">
                <input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={t('add.search_placeholder')}
                  className="w-full px-4 py-3 pr-14 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                />
                <div className="absolute right-2">
                  <VoiceSearchButton
                    onResult={(text) => setAiQuery(text)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={lookupMutation.isPending || !aiQuery.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {lookupMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {lookupMutation.isPending ? t('add.searching') : t('add.search_ai')}
              </button>
            </form>
          </div>

          {/* AI Text parsing */}
          {aiTextAllowed && (
            <div className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                {t('add.voice')}
              </h2>
              <p className="text-xs text-gray-400 mb-3">{t('add.voice_hint')}</p>
              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder={t('add.voice_hint')}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 resize-none mb-3"
              />
              <button
                onClick={handleParseText}
                disabled={parseTextMutation.isPending || !aiText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-60"
              >
                {parseTextMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {parseTextMutation.isPending ? t('add.searching') : t('add.search_ai')}
              </button>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 bg-[#0f0f13]">{t('auth.or')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setStep(2)}
              className="glass-card rounded-2xl p-4 hover:border-purple-500/40 transition-all text-sm font-medium text-center"
            >
              {t('add.add_manually')}
            </button>
            {aiPhotoAllowed ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={parseMutation.isPending}
                className="glass-card rounded-2xl p-4 hover:border-purple-500/40 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {parseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4 text-purple-400" />}
                {t('add.scan_receipt')}
              </button>
            ) : (
              <FeatureGate feature="ai-photo" fallback={
                <button
                  disabled
                  className="glass-card rounded-2xl p-4 opacity-50 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Scan className="w-4 h-4 text-gray-400" />
                  {t('add.scan_receipt')}
                </button>
              }>
                <span />
              </FeatureGate>
            )}
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
                <p className="text-xs text-purple-400">{t('add.plans_available', { count: foundService.plans.length })}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">{t('add.name')} *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('add.name_placeholder')}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t('add.plan')}</label>
              <input
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                placeholder={t('add.plan_placeholder')}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t('add.category')}</label>
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
              <label className="text-xs text-gray-400 mb-1 block">{t('add.amount')} *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder={t('add.amount_placeholder')}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t('add.currency')}</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t('add.billing_cycle')}</label>
              <select
                value={form.billingCycle}
                onChange={(e) => setForm({ ...form, billingCycle: e.target.value as BillingCycle })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              >
                {billingCycles.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{t('add.start_date')}</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            {cards && cards.length > 0 && (
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">{t('add.card')}</label>
                <select
                  value={form.cardId}
                  onChange={(e) => setForm({ ...form, cardId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">{t('add.no_card')}</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>{c.nickname} •••• {c.last4}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">{t('add.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={t('add.notes_placeholder')}
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
            {t('add.continue')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              {t('add.confirm')}
            </h2>
            <div className="space-y-3">
              {[
                { label: t('add.service'), value: form.name },
                { label: t('add.plan'), value: form.plan || '—' },
                { label: t('add.amount'), value: `${form.amount} ${form.currency} / ${form.billingCycle.toLowerCase()}` },
                { label: t('add.category'), value: form.category.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) },
                { label: t('add.start_date'), value: form.startDate },
                { label: t('add.card'), value: form.cardId ? cards?.find((c) => c.id === form.cardId)?.nickname ?? '—' : t('add.no_card') },
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
            {createMutation.isPending ? t('add.adding') : t('add.save')}
          </button>
        </div>
      )}
    </div>
  );
}
