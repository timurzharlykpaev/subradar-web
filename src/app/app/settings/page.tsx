'use client';

import { useState } from 'react';
import { User, Bell, Globe, CreditCard, Shield, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

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
  const { theme, toggleTheme, currency, setCurrency, language, setLanguage } = useAppStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    renewals: true,
  });
  const [profile, setProfile] = useState({
    name: 'Timur Zharlykpaev',
    email: 'timur@example.com',
  });

  const currencies = ['USD', 'EUR', 'GBP', 'KZT', 'RUB', 'AED'];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('subradar-language', lang);
    setLanguage(lang);
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">{t('settings.account')}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
            {t('common.save')}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t('settings.theme')}</p>
              <p className="text-xs text-gray-400">{theme === 'dark' ? t('settings.dark_mode') : t('settings.light_mode')}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-all ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('settings.language')}</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('settings.currency')}</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500"
            >
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">{t('settings.notifications')}</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')} notifications</p>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !val })}
                className={`relative w-10 h-5 rounded-full transition-all ${val ? 'bg-purple-600' : 'bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${val ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Plan */}
      <div className="glass-card rounded-2xl p-5 border border-purple-500/30 animate-pulse-glow">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h3 className="font-semibold">SubRadar Pro</h3>
          <span className="ml-auto text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">UPGRADE</span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Unlock unlimited subscriptions, AI features, PDF reports, and priority support.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold gradient-text">$2.99</p>
            <p className="text-xs text-gray-400">per month</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold gradient-text">$24.99</p>
            <p className="text-xs text-gray-400">per year <span className="text-green-400">30% off</span></p>
          </div>
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm font-bold transition-all">
          Upgrade to Pro
        </button>
      </div>

      {/* Danger zone */}
      <div className="glass-card rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all">
            Export My Data
          </button>
          <button className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
