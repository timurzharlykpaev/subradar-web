import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Radar, Mail, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import api from '@/lib/api';

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function LoginContent() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState<'google' | 'email'>('google');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectTo = searchParams.get('redirect') || '/app/dashboard';

  const handleGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data } = await api.post('/auth/google/token', {
          accessToken: tokenResponse.access_token,
        });
        localStorage.setItem('auth_token', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
        navigate(redirectTo);
      } catch {
        setErrorMsg('Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrorMsg('Google sign-in failed. Please try again.'),
  });

  const sendMagicLink = async (targetEmail: string) => {
    await api.post('/auth/magic-link', { email: targetEmail });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await sendMagicLink(email);
      setSent(true);
    } catch {
      setErrorMsg('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    setErrorMsg('');
    try {
      await sendMagicLink(email);
      // start 60s cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse 100% 60% at 50% -5%, rgba(109,40,217,0.35) 0%, #080810 55%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/">
            <div
              style={{
                width: '68px', height: '68px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                boxShadow: '0 8px 40px rgba(124,58,237,0.5), 0 0 0 1px rgba(139,92,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Radar size={32} color="white" />
            </div>
          </Link>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {t('auth.welcome')}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {t('auth.sign_in')}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '24px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '3px',
              marginBottom: '20px',
              gap: '2px',
            }}
          >
            {(['google', 'email'] as const).map((id) => (
              <button
                key={id}
                onClick={() => { setTab(id); setSent(false); setErrorMsg(''); }}
                style={{
                  flex: 1, padding: '8px 12px',
                  borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500,
                  transition: 'all 0.2s',
                  background: tab === id ? 'rgba(124,58,237,0.8)' : 'transparent',
                  color: tab === id ? '#fff' : 'rgba(255,255,255,0.35)',
                  boxShadow: tab === id ? '0 2px 8px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                {id === 'google' ? 'Google' : 'Magic Link'}
              </button>
            ))}
          </div>

          {/* Google */}
          {tab === 'google' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => handleGoogle()}
                disabled={loading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', padding: '13px', borderRadius: '14px',
                  background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 600, color: '#111',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.15s',
                }}
              >
                <GoogleIcon />
                {loading ? 'Signing in...' : t('auth.google')}
              </button>
              {errorMsg && (
                <p style={{ fontSize: '12px', color: '#f87171', textAlign: 'center', margin: 0 }}>{errorMsg}</p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              </div>
              <button
                onClick={() => setTab('email')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '13px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.7)',
                  transition: 'all 0.15s',
                }}
              >
                <Mail size={16} />
                Magic Link (Email)
              </button>
            </div>
          )}

          {/* Email form */}
          {tab === 'email' && !sent && (
            <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  color="rgba(255,255,255,0.3)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email_placeholder')}
                  style={{
                    width: '100%', padding: '13px 14px 13px 40px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errorMsg && (
                <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '13px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  color: '#fff', fontSize: '14px', fontWeight: 600,
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                  transition: 'all 0.15s',
                }}
              >
                {loading ? (
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.8s linear infinite',
                  }} />
                ) : (
                  <>
                    {t('auth.send_link')}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sent state */}
          {tab === 'email' && sent && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <CheckCircle2 size={28} color="#4ade80" />
              </div>
              <p style={{ fontWeight: 600, color: '#fff', margin: '0 0 6px', fontSize: '15px' }}>
                {t('auth.sent')}
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>
                {t('auth.sent_sub')}{' '}
                <span style={{ color: '#a78bfa', fontWeight: 500 }}>{email}</span>
              </p>

              {/* Resend button */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>
                  Didn't receive the email? Check spam or resend.
                </p>
                <button
                  onClick={handleResend}
                  disabled={resending || resendCooldown > 0}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '12px',
                    background: resendCooldown > 0 ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.15)',
                    border: `1px solid ${resendCooldown > 0 ? 'rgba(255,255,255,0.07)' : 'rgba(139,92,246,0.3)'}`,
                    color: resendCooldown > 0 ? 'rgba(255,255,255,0.25)' : '#a78bfa',
                    fontSize: '13px', fontWeight: 500,
                    cursor: resendCooldown > 0 || resending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resending
                    ? 'Sending...'
                    : 'Resend email'}
                </button>
              </div>

              {errorMsg && (
                <p style={{ fontSize: '12px', color: '#f87171', marginTop: '10px' }}>{errorMsg}</p>
              )}

              <button
                onClick={() => { setSent(false); setResendCooldown(0); }}
                style={{
                  marginTop: '10px', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        {/* Legal */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '18px' }}>
          By signing in, you agree to our{' '}
          <a href="/legal/terms" style={{ color: 'rgba(167,139,250,0.7)' }}>Terms</a>{' '}
          and{' '}
          <a href="/legal/privacy" style={{ color: 'rgba(167,139,250,0.7)' }}>Privacy Policy</a>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
