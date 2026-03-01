'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Radar, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState<'google' | 'email'>('google');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  const handleGoogle = () => {
    window.location.href = '/app/dashboard';
  };

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #2d0a5e 0%, #0f0f13 55%)',
      }}
    >
      {/* Top hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-6">
        {/* Logo */}
        <Link href="/" className="mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.45)',
            }}
          >
            <Radar className="w-10 h-10 text-white" />
          </div>
        </Link>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {t('auth.welcome')}
        </h1>
        <p className="text-gray-400 text-base text-center max-w-xs">
          {t('auth.sign_in')}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {['AI-powered', 'Smart alerts', 'Tax reports'].map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(124,58,237,0.18)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <Sparkles className="w-3 h-3" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom card */}
      <div
        className="w-full px-4 pb-8"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 1.5rem))' }}
      >
        <div
          className="rounded-3xl p-6 w-full max-w-sm mx-auto"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Tabs */}
          <div
            className="flex rounded-xl mb-5 p-1"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {[
              { id: 'google', label: 'Google' },
              { id: 'email', label: 'Magic Link' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as 'google' | 'email')}
                className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
                style={
                  tab === item.id
                    ? { background: 'rgba(124,58,237,0.7)', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.45)' }
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Google tab */}
          {tab === 'google' && (
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white text-gray-900 text-sm font-semibold transition-all active:scale-95"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            >
              <GoogleIcon />
              {t('auth.google')}
            </button>
          )}

          {/* Email tab */}
          {tab === 'email' && !sent && (
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email_placeholder')}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t('auth.send_link')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {tab === 'email' && sent && (
            <div className="text-center py-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(34,197,94,0.15)' }}
              >
                <Mail className="w-7 h-7 text-green-400" />
              </div>
              <p className="font-semibold text-white">{t('auth.sent')}</p>
              <p className="text-sm text-gray-400 mt-1">
                {t('auth.sent_sub')} <span className="text-purple-400">{email}</span>
              </p>
            </div>
          )}

          {/* Legal */}
          <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            By signing in, you agree to our{' '}
            <a href="/legal/terms" className="text-purple-400 hover:underline">Terms</a>{' '}
            and{' '}
            <a href="/legal/privacy" className="text-purple-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
