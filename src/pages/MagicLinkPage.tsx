import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Radar, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { User } from '@/types';

function MagicLinkContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login');
      return;
    }

    api.get<{ accessToken: string; refreshToken: string; user: User }>(
      `/auth/magic?token=${token}`
    )
      .then(({ data }) => {
        localStorage.setItem('auth_token', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
        setAuth(data.user, data.accessToken, data.refreshToken);
        navigate('/app/dashboard');
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Link expired or already used';
        setError(msg);
      });
  }, [searchParams, navigate, setAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #2d0a5e 0%, #0f0f13 55%)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-1">Link invalid</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #2d0a5e 0%, #0f0f13 55%)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
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

export default function MagicLinkPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse 120% 60% at 50% 0%, #2d0a5e 0%, #0f0f13 55%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    }>
      <MagicLinkContent />
    </Suspense>
  );
}
