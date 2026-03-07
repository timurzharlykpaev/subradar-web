import { useState } from 'react';
import { User, Bell, Globe, Zap, Shield, Loader2, UserPlus, X, Building2, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useToast } from '@/providers/ToastProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useBillingMe, useCheckout, useCancelBilling, useStartTrial, useProInvite, useRemoveProInvite } from '@/hooks/useBilling';
import { User as UserType } from '@/types';
import { PlanUsageBar } from '@/components/ui/PlanUsageBar';
import { UpgradeModal } from '@/components/ui/UpgradeModal';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const { theme, toggleTheme, currency, setCurrency, language, setLanguage, user, setUser } = useAppStore();

  const [profile, setProfile] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
  const [notifications, setNotifications] = useState({
    email: true, push: true, reminders: true, renewals: true,
  });
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'KZT', 'RUB', 'AED'];

  useQuery<UserType>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get<UserType>('/auth/me');
      setUser(data);
      setProfile({ name: data.name, email: data.email });
      return data;
    },
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 60000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; currency?: string; locale?: string }) => {
      const { data } = await api.patch<UserType>('/users/me', payload);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      success(t('settings.profile_updated'));
    },
    onError: () => error(t('settings.profile_update_failed')),
  });

  const { data: billing } = useBillingMe();
  const checkoutMutation = useCheckout();
  const cancelBillingMutation = useCancelBilling();
  const startTrialMutation = useStartTrial();
  const proInviteMutation = useProInvite();
  const removeInviteMutation = useRemoveProInvite();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('subradar-language', lang);
    setLanguage(lang);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ name: profile.name, email: profile.email, currency, locale: language });
  };

  const handleUpgrade = async () => {
    try {
      const result = await checkoutMutation.mutateAsync('pro-monthly');
      window.location.href = result.url;
    } catch {
      error(t('settings.checkout_failed'));
    }
  };

  const handleStartTrial = async () => {
    try {
      await startTrialMutation.mutateAsync();
      success(t('settings.trial_started'));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('settings.trial_failed');
      error(msg);
    }
  };

  const handleCancelBilling = async () => {
    if (!confirm(t('settings.cancel_confirm_billing'))) return;
    try {
      await cancelBillingMutation.mutateAsync();
      success(t('settings.cancelled_success'));
    } catch {
      error(t('settings.cancel_failed'));
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    try {
      await proInviteMutation.mutateAsync(inviteEmail);
      success(t('settings.invite_sent', { email: inviteEmail }));
      setInviteEmail('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('settings.invite_failed');
      error(msg);
    }
  };

  const handleRemoveInvite = async () => {
    if (!confirm(t('settings.invite_remove_confirm'))) return;
    try {
      await removeInviteMutation.mutateAsync();
      success(t('settings.invite_removed'));
    } catch {
      error(t('settings.invite_remove_failed'));
    }
  };

  const isPro = billing?.plan === 'pro' || billing?.plan === 'team';
  const isOrg = billing?.plan === 'team';
  const isTrialing = billing?.status === 'trialing';
  const canTrial = billing && !billing.trialUsed && billing.plan === 'free';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <p className="text-gray-400 text-sm mt-1">{t('settings.manage_account')}</p>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">{t('settings.account')}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('settings.name')}</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('settings.email')}</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-60">
            {updateProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('common.save')}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">{t('settings.preferences')}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t('settings.theme')}</p>
              <p className="text-xs text-gray-400">{theme === 'dark' ? t('settings.dark_mode') : t('settings.light_mode')}</p>
            </div>
            <button onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-all ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('settings.language')}</label>
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('settings.currency')}</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">{t('settings.notifications')}</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm capitalize">{t('settings.notifications_label', { type: key.replace(/([A-Z])/g, ' $1') })}</p>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !val })}
                className={`relative w-10 h-5 rounded-full transition-all ${val ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${val ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plan & Billing */}
      <div className={`glass-card rounded-2xl p-5 border ${isPro ? 'border-purple-500/30' : 'border-white/10'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h3 className="font-semibold">
            SubRadar {isOrg ? t('settings.plan_team') : isPro ? t('settings.plan_pro') : t('settings.plan_free')}
          </h3>
          {isTrialing && (
            <span className="ml-auto flex items-center gap-1 text-xs bg-blue-400/20 text-blue-400 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {t('settings.trial_days_left', { days: billing?.trialDaysLeft })}
            </span>
          )}
          {isPro && !isTrialing && (
            <span className="ml-auto text-xs bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full">ACTIVE</span>
          )}
          {!isPro && (
            <span className="ml-auto text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">FREE</span>
          )}
        </div>

        {billing && (
          <div className="mb-4">
            <PlanUsageBar billing={billing} onUpgradeClick={() => setUpgradeOpen(true)} />
          </div>
        )}

        {isPro ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              {isTrialing
                ? t('settings.plan_trial_ends', { date: billing?.currentPeriodEnd ? new Date(billing.currentPeriodEnd).toLocaleDateString() : '—' })
                : t('settings.plan_renews', { date: billing?.currentPeriodEnd ? new Date(billing.currentPeriodEnd).toLocaleDateString() : '—' })}
              {billing?.cancelAtPeriodEnd && ` (${t('settings.plan_cancels_period_end')})`}
            </p>

            {/* Pro Invite section */}
            {!isOrg && (
              <div className="pt-3 border-t border-white/8">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <p className="text-sm font-medium">{t('settings.pro_invite_title')}</p>
                </div>
                {billing?.proInviteeEmail ? (
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-sm text-gray-300">{billing.proInviteeEmail}</span>
                    <button
                      onClick={handleRemoveInvite}
                      disabled={removeInviteMutation.isPending}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="friend@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleSendInvite}
                      disabled={proInviteMutation.isPending || !inviteEmail}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-60"
                    >
                      {proInviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('settings.invite')}
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('settings.pro_invite_hint')}
                </p>
              </div>
            )}

            {isOrg && (
              <div className="pt-3 border-t border-white/8">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <a href="/app/workspace" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    {t('settings.manage_workspace')} →
                  </a>
                </div>
              </div>
            )}

            {!billing?.cancelAtPeriodEnd && !isTrialing && (
              <button onClick={handleCancelBilling} disabled={cancelBillingMutation.isPending}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all disabled:opacity-60">
                {cancelBillingMutation.isPending ? t('settings.cancelling') : t('settings.cancel_subscription')}
              </button>
            )}

            <button onClick={() => setUpgradeOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/8 text-gray-300 text-sm font-medium transition-all">
              {t('settings.view_all_plans')}
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {t('settings.upgrade_unlock')}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold gradient-text">$2.99</p>
                <p className="text-xs text-gray-400">{t('settings.per_month')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold gradient-text">$24.99</p>
                <p className="text-xs text-gray-400">{t('settings.per_year')} <span className="text-green-400">{t('settings.year_discount')}</span></p>
              </div>
            </div>
            {canTrial ? (
              <div className="space-y-2">
                <button
                  onClick={handleStartTrial}
                  disabled={startTrialMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-bold transition-all disabled:opacity-60"
                >
                  {startTrialMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('settings.start_trial')}
                </button>
                <button onClick={handleUpgrade} disabled={checkoutMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/8 text-gray-400 text-sm transition-all disabled:opacity-60">
                  {t('settings.upgrade_directly')}
                </button>
              </div>
            ) : (
              <button onClick={handleUpgrade} disabled={checkoutMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-bold transition-all disabled:opacity-60">
                {checkoutMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('settings.upgrade_to_pro')}
              </button>
            )}
          </>
        )}
      </div>

      <div className="glass-card rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-red-400">{t('settings.danger_zone')}</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all">
            {t('settings.export_data')}
          </button>
          <button className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all">
            {t('settings.delete_account')}
          </button>
        </div>
      </div>

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} billing={billing} />
    </div>
  );
}
