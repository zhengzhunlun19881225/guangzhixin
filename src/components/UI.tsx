import React from 'react';
import { ChevronRight, LoaderCircle } from 'lucide-react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'solid' | 'secondary' | 'text' | 'danger';
  size?: 'default' | 'small';
  loading?: boolean;
};
export function Button({ variant = 'secondary', size = 'default', loading = false, disabled, className = '', children, type = 'button', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`ui-button ui-button-${variant}${size === 'small' ? ' ui-button-small' : ''} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined}>
    {loading && <LoaderCircle size={14} className="ui-spinner" aria-hidden="true" />}{children}
  </button>;
}

export function PanelHeading({ title, icon, actionLabel = '更多', onAction, className = '' }: {
  title: string; icon?: React.ReactNode; actionLabel?: string; onAction?: () => void; className?: string;
}) {
  return <div className={`ui-panel-heading ${className}`}><h3>{icon}{title}</h3>
    {onAction && <button className="ui-more" type="button" onClick={onAction} aria-label={`${title}${actionLabel}`}>{actionLabel}<ChevronRight size={13} aria-hidden="true" /></button>}
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


/** Shared native modal surface. Business dialogs use gx-dialog-header/body/footer slots. */
export function ModalSurface({ label, className = '', onClose, children }: {
  label: string; className?: string; onClose: () => void; children: React.ReactNode;
}) {
  const dialog = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal();
    return () => { element.close(); trigger?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`gx-dialog ${className}`} aria-label={label}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button,input,textarea,[tabindex]')).filter(element => element.tabIndex >= 0 && !element.hasAttribute('disabled') && element.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>{children}</dialog>;
}
