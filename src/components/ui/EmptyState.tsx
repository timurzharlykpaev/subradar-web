import { LucideIcon, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  illustration?: string; // path to image in /public
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, illustration, title, description, action }: EmptyStateProps) {
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
    </div>
  );
}
