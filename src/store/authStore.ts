import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : false,
  setAuth: (user, token, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    }
    set({ user, accessToken: token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
