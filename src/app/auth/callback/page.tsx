'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Radar } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (!accessToken) {
      router.replace('/login?error=auth_failed');
      return;
    }
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    router.replace('/app/dashboard');
  }, [params, router]);

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100dvh', background: '#0f0f13' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Radar className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-400 text-sm mt-3">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0f0f13', minHeight: '100dvh' }} />}>
      <CallbackContent />
    </Suspense>
  );
}
