import { create } from 'zustand';
import { User } from '@/types';

interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  currency: string;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrency: (currency: string) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'dark',
  currency: 'USD',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setCurrency: (currency) => set({ currency }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
