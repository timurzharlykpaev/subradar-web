import { useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Radar } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/useAppStore';
import api from '@/lib/api';
import { User } from '@/types';

function AuthCallbackContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const redirect = searchParams.get('redirect') || '/app/dashboard';
    const errorParam = searchParams.get('error');

    if (errorParam) {
      navigate(`/login?error=${encodeURIComponent(errorParam)}`);
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get<User>('/auth/me')
      .then(({ data }) => {
        setAuth(data, token, refreshToken ?? undefined);
        setUser(data);
        navigate(redirect);
      })
      .catch(() => {
        setAuth({ id: '', email: '', name: '', isPro: false, currency: 'USD', locale: 'en' }, token);
        navigate(redirect);
      });
  }, [searchParams, navigate, setAuth, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #2d0a5e 0%, #0f0f13 55%)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
        <Radar className="w-8 h-8 text-white" />
      </div>
      <div className="flex items-center gap-3 text-gray-300">
        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
        <span>{t('auth.signing_in')}</span>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #2d0a5e 0%, #0f0f13 55%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
