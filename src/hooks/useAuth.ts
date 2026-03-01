import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { User } from '@/types';

export function useAuth() {
  const setUser = useAppStore((s) => s.setUser);
  const user = useAppStore((s) => s.user);
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get<User>('/auth/me');
      setUser(data);
      return data;
    },
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      setUser(null);
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  const loginWithGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  };

  const loginWithMagicLink = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post('/auth/magic-link', { email });
      return data;
    },
  });

  return { user, isLoading, logout, loginWithGoogle, loginWithMagicLink };
}
