
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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, toggleTheme } = useAppStore();
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    { href: '/app/workspace', icon: Users, label: t('nav.workspace') },
    { href: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  const sidebarWidth = sidebarCollapsed ? 'w-[72px]' : 'w-64';

  return (
    <div className="flex" style={{ minHeight: '100dvh' }}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300',
          'border-r border-white/8 bg-[#0c0c14]',
          // Desktop
          'hidden md:flex',
          sidebarWidth,
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center border-b border-white/8 h-16 flex-shrink-0',
          sidebarCollapsed ? 'justify-center px-0' : 'px-5 gap-3'
        )}>
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
              <Radar className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-base gradient-text truncate">SubRadar</span>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className={cn('flex-1 py-4 space-y-0.5', sidebarCollapsed ? 'px-2' : 'px-3')}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                to={href}
                title={sidebarCollapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl text-sm transition-all duration-150 group relative',
                  sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 font-medium'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-500 rounded-r-full" />
                )}
                <Icon className={cn('flex-shrink-0', isActive ? 'w-5 h-5 text-purple-400' : 'w-5 h-5')} />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className={cn('border-t border-white/8 py-4 space-y-2', sidebarCollapsed ? 'px-2' : 'px-3')}>
          {!sidebarCollapsed && (
            <Link
              to="/app/subscriptions/add"
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              Add Subscription
            </Link>
          )}

          <div className={cn('flex gap-1', sidebarCollapsed ? 'flex-col items-center' : 'items-center')}>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-gray-500 hover:text-gray-200 hover:bg-white/5 text-sm transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {!sidebarCollapsed && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
            </button>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1a1a28] border border-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-md z-10"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-30 flex flex-col md:hidden transition-transform duration-300',
          'w-72 border-r border-white/8 bg-[#0c0c14]',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Radar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base gradient-text">SubRadar</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative',
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 font-medium'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-500 rounded-r-full" />
                )}
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-purple-400' : '')} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/8 p-4 space-y-2">
          <Link
            to="/app/subscriptions/add"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-xl text-gray-500 hover:text-gray-200 hover:bg-white/5 text-sm transition-all">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'
        )}
        style={{ minHeight: '100dvh' }}
      >
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/8 dark:bg-[#0c0c14]/80 bg-white/95 backdrop-blur-xl sticky top-0 z-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Radar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text">SubRadar</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-lg"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main
          className="flex-1"
          style={{
            padding: '20px 20px',
            paddingLeft: 'max(20px, env(safe-area-inset-left))',
            paddingRight: 'max(20px, env(safe-area-inset-right))',
            paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
          }}
        >
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-white/8 bg-[#0c0c14]/90 backdrop-blur-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center">
          {navItems.slice(0, 5).map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex flex-col items-center gap-1 flex-1 py-2.5 transition-all',
                  isActive ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile FAB */}
      {(pathname.includes('/dashboard') || pathname.includes('/subscriptions')) && (
        <Link
          to="/app/subscriptions/add"
          className="fixed md:hidden z-50"
          style={{ bottom: 'calc(68px + env(safe-area-inset-bottom))', right: '16px' }}
          aria-label="Add subscription"
        >
          <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/40 hover:bg-purple-700 transition-all">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </Link>
      )}
    </div>
  );
}
