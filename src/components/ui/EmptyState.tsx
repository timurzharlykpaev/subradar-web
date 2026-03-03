import { LucideIcon } from 'lucide-react';
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
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center animate-fade-in">
      {illustration ? (
        <img
          src={illustration}
          alt=""
          className="w-40 h-40 object-contain mb-4 opacity-80"
        />
      ) : Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-gray-500" />
        </div>
      ) : null}
      <p className="font-semibold text-gray-200 text-base">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1.5 max-w-xs leading-relaxed">{description}</p>
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
