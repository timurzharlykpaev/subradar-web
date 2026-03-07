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

const getStored = (key: string, fallback: string) =>
  typeof window !== 'undefined' ? (localStorage.getItem(key) || fallback) : fallback;

export const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: getStored('subradar-theme', 'dark') as 'dark' | 'light',
  currency: getStored('subradar-currency', 'USD'),
  language: getStored('subradar-language', 'en'),
  setUser: (user) => set({ user }),
  setTheme: (theme) => {
    localStorage.setItem('subradar-theme', theme);
    set({ theme });
  },
  setCurrency: (currency) => {
    localStorage.setItem('subradar-currency', currency);
    set({ currency });
  },
  setLanguage: (language) => {
    localStorage.setItem('subradar-language', language);
    set({ language });
  },
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('subradar-theme', next);
      return { theme: next };
    }),
}));
