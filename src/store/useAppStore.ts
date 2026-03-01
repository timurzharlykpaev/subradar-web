import { create } from 'zustand';
import { User } from '@/types';

interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  currency: string;
  language: string;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (lang: string) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'dark',
  currency: 'USD',
  language: 'en',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setCurrency: (currency) => set({ currency }),
  setLanguage: (language) => set({ language }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
