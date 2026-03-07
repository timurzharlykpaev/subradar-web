import { LucideIcon, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionItem {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  icon?: LucideIcon;
  illustration?: string;
  title: string;
  description?: string;
  action?: ActionItem;
  actions?: ActionItem[];
}

export function EmptyState({ icon: Icon, illustration, title, description, action, actions }: EmptyStateProps) {
  const FallbackIcon = Icon || Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {illustration ? (
        <img
          src={illustration}
          alt=""
          className="w-40 h-40 object-contain mb-5 opacity-80"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
          <FallbackIcon className="w-8 h-8 text-purple-400/70" />
        </div>
      )}
      <p className="font-semibold text-[var(--foreground)] text-base">{title}</p>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] mt-1.5 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link
            to={action.href}
            className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20"
          >
            {action.label}
          </button>
        )
      )}
      {actions && actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {actions.map((a, i) => {
            const isPrimary = (a.variant ?? (i === 0 ? 'primary' : 'secondary')) === 'primary';
            const cls = isPrimary
              ? 'px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20'
              : 'px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all';
            return a.href ? (
              <Link key={i} to={a.href} className={cls}>{a.label}</Link>
            ) : (
              <button key={i} onClick={a.onClick} className={cls}>{a.label}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}
