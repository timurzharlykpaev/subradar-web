import { X, Zap, Building2, Check, Loader2 } from 'lucide-react';
import { BillingInfo } from '@/types';
import { useCheckout, useStartTrial } from '@/hooks/useBilling';
import { useToast } from '@/providers/ToastProvider';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  billing?: BillingInfo;
  trigger?: 'subscription-limit' | 'ai-limit' | 'manual';
}

// Declare LemonSqueezy overlay API (injected by lemon.js)
declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Setup: (opts: { eventHandler: (event: { event: string }) => void }) => void;
      Url: {
        Open: (url: string) => void;
        Close: () => void;
      };
    };
  }
}

const PRO_FEATURES = [
  'Unlimited subscriptions',
  '200 AI requests per month',
  'Internet search for services',
  'Advanced analytics & reports',
  '1 invite slot (For You + One)',
  '7-day free trial',
];

const TEAM_FEATURES = [
  'Everything in Pro',
  'Unlimited AI requests',
  'Create organization',
  'Invite multiple members',
  'Shared team analytics',
  'Role management (Owner / Admin / Member)',
];

export function UpgradeModal({ isOpen, onClose, billing, trigger }: UpgradeModalProps) {
  const { success, error } = useToast();
  const checkoutMutation = useCheckout();
  const startTrialMutation = useStartTrial();

  if (!isOpen) return null;

  const canTrial = billing && !billing.trialUsed && billing.plan === 'free';

  const handleTrial = async () => {
    try {
      await startTrialMutation.mutateAsync();
      success('7-day Pro trial started! Enjoy all features.');
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to start trial.';
      error(msg);
    }
  };

  const handleCheckout = async (planId: string) => {
    try {
      const result = await checkoutMutation.mutateAsync(planId);
      const url = result.url;

      // Use Lemon Squeezy overlay if available
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Setup({
          eventHandler: ({ event }) => {
            if (event === 'Checkout.Success') {
              onClose();
              success('Payment successful! Your plan has been upgraded.');
            }
          },
        });
        window.LemonSqueezy.Url.Open(url + (url.includes('?') ? '&' : '?') + 'embed=1');
      } else {
        // Fallback: open in new tab
        window.open(url, '_blank');
      }
    } catch {
      error('Failed to start checkout. Please try again.');
    }
  };

  const triggerMessage = {
    'subscription-limit': "You've reached the 3-subscription limit on Free.",
    'ai-limit': "You've used all AI requests for this month.",
    'manual': null,
  }[trigger ?? 'manual'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-card rounded-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Unlock Full Power</h2>
          {triggerMessage && (
            <p className="text-sm text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-2 inline-block">
              {triggerMessage}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Pro Plan */}
          <div className="rounded-2xl border border-purple-500/40 bg-purple-500/5 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-lg">SubRadar Pro</h3>
              <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                Popular
              </span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$2.99</span>
              <span className="text-gray-400 text-sm"> / month</span>
            </div>
            <ul className="space-y-2 mb-5 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {canTrial ? (
              <button
                onClick={handleTrial}
                disabled={startTrialMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-bold transition-all disabled:opacity-60"
              >
                {startTrialMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Start 7-day free trial
              </button>
            ) : (
              <button
                onClick={() => handleCheckout('pro')}
                disabled={checkoutMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-bold transition-all disabled:opacity-60"
              >
                {checkoutMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Upgrade to Pro
              </button>
            )}
          </div>

          {/* Team Plan */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg">SubRadar Team</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-gray-400 text-sm"> / month</span>
            </div>
            <ul className="space-y-2 mb-5 flex-1">
              {TEAM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('organization')}
              disabled={checkoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-500/40 hover:bg-blue-500/10 text-blue-300 text-sm font-medium transition-all disabled:opacity-60"
            >
              {checkoutMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Upgrade to Team
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Cancel anytime · No hidden fees · Secure payment via{' '}
          <a
            href="https://lemonsqueezy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            Lemon Squeezy
          </a>
        </p>
      </div>
    </div>
  );
}
