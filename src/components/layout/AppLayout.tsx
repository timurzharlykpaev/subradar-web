
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  Plus,
  Radar,
  Moon,
  Sun,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const pathname = location.pathname;
  const { theme, toggleTheme } = useAppStore();
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      navigate('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    document.cookie = 'auth_token=; path=/; max-age=0';
    navigate('/login');
  };

  const navItems = [
    { href: '/app/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { href: '/app/subscriptions', icon: Layers, label: t('nav.subscriptions') },
    { href: '/app/cards', icon: CreditCard, label: t('nav.cards') },
    { href: '/app/analytics', icon: BarChart3, label: t('nav.analytics') },
    { href: '/app/reports', icon: FileText, label: t('nav.reports') },
    { href: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <div className="flex" style={{ minHeight: "100dvh" }}>
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-black/20 fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">SubRadar</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
                  isActive
                    ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/app/subscriptions/add"
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Subscription
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button onClick={handleLogout} className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col" style={{ minHeight: "100dvh" }}>
        <main className="flex-1 px-4 pt-4 sm:px-6 sm:pt-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                  isActive ? 'text-purple-400' : 'text-gray-500'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
          <Link
            href="/app/subscriptions/add"
            className="flex flex-col items-center gap-1 px-3 py-2"
          >
            <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center -mt-5 shadow-lg shadow-purple-500/40">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile FAB */}
      <Link
        href="/app/subscriptions/add"
        className="fixed bottom-20 right-4 md:hidden w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/40 z-50 hover:bg-purple-700 transition-all"
        aria-label="Add subscription"
      >
        <Plus className="w-7 h-7 text-white" />
      </Link>
    </div>
  );
}
