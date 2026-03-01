'use client';

import { useState } from 'react';
import { Mic, FileImage, PenLine, Send, X } from 'lucide-react';
import { allCategories } from '@/components/shared/CategoryIcon';
import { ReceiptUploader } from './ReceiptUploader';
import { Category, BillingCycle } from '@/types';
import { mockCards } from '@/lib/mockData';
import { PaymentCardPicker } from '@/components/cards/PaymentCardPicker';

type Tab = 'manual' | 'ai-text' | 'ai-screenshot';

interface AddSubscriptionModalProps {
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

const billingCycles: BillingCycle[] = ['monthly', 'yearly', 'weekly', 'quarterly'];

export function AddSubscriptionModal({ onClose, onSubmit }: AddSubscriptionModalProps) {
  const [tab, setTab] = useState<Tab>('manual');
  const [aiText, setAiText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [form, setForm] = useState({
    name: '',
    plan: '',
    amount: '',
    currency: 'USD',
    billingCycle: 'monthly' as BillingCycle,
    category: 'other' as Category,
    cardId: '',
    nextPaymentDate: '',
  });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'manual', label: 'Manual', icon: <PenLine className="w-4 h-4" /> },
    { id: 'ai-text', label: 'AI Text/Voice', icon: <Mic className="w-4 h-4" /> },
    { id: 'ai-screenshot', label: 'Screenshot', icon: <FileImage className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    onClose?.();
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // In real app: use Web Speech API
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-lg">Add Subscription</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all ${
                tab === t.id
                  ? 'text-purple-400 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* Manual tab */}
          {tab === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="text-xs text-gray-400 mb-1 block">Amount *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
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
                    {['USD', 'EUR', 'GBP', 'KZT', 'RUB'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Billing Cycle</label>
                  <select
                    value={form.billingCycle}
                    onChange={(e) => setForm({ ...form, billingCycle: e.target.value as BillingCycle })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                  >
                    {billingCycles.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
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
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Plan</label>
                  <input
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    placeholder="e.g. Premium, Basic, Pro"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Next Payment Date</label>
                  <input
                    type="date"
                    value={form.nextPaymentDate}
                    onChange={(e) => setForm({ ...form, nextPaymentDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <PaymentCardPicker
                cards={mockCards}
                selectedId={form.cardId}
                onSelect={(id) => setForm({ ...form, cardId: id })}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
              >
                Add Subscription
              </button>
            </form>
          )}

          {/* AI Text/Voice tab */}
          {tab === 'ai-text' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Describe your subscription in natural language or use voice input. AI will extract the details automatically.
              </p>
              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder="e.g. I pay $15.99/month for Netflix Premium on my Visa ending in 4242, renews on the 15th..."
                rows={5}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={toggleVoice}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                    isListening
                      ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  {isListening ? 'Listening...' : 'Voice Input'}
                </button>
                <button
                  disabled={!aiText.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all flex-1 justify-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Parse with AI
                </button>
              </div>
            </div>
          )}

          {/* AI Screenshot tab */}
          {tab === 'ai-screenshot' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Upload a screenshot of your subscription confirmation email or receipt. AI will extract all details.
              </p>
              <ReceiptUploader />
              <button
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
              >
                Analyze Screenshot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
