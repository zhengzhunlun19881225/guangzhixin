import React from 'react';
import { ChevronRight, LoaderCircle } from 'lucide-react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  loading?: boolean;
};
export function Button({ variant = 'secondary', loading = false, disabled, className = '', children, type = 'button', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`ui-button ui-button-${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined}>
    {loading && <LoaderCircle size={14} className="ui-spinner" aria-hidden="true" />}{children}
  </button>;
}

export function PanelHeading({ title, icon, actionLabel = '更多', onAction, className = '' }: {
  title: string; icon?: React.ReactNode; actionLabel?: string; onAction?: () => void; className?: string;
}) {
  return <div className={`ui-panel-heading ${className}`}><h3>{icon}{title}</h3>
    {onAction && <button type="button" onClick={onAction} aria-label={`${title}${actionLabel}`}>{actionLabel}<ChevronRight size={13} aria-hidden="true" /></button>}
  </div>;
}

export function StatusBadge({ tone = 'neutral', children, className = '' }: {
  tone?: 'success' | 'info' | 'warning' | 'danger' | 'neutral'; children: React.ReactNode; className?: string;
}) {
  return <span className={`ui-status ui-status-${tone} ${className}`}>{children}</span>;
}

export function EmptyState({ title = '暂无内容', description, action, className = '' }: {
  title?: string; description?: string; action?: React.ReactNode; className?: string;
}) {
  return <div className={`ui-empty ${className}`}><p role="status">{title}</p>{description && <p className="ui-empty-description">{description}</p>}{action}</div>;
}
