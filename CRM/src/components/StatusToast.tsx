import { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

interface StatusToastProps {
  open: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function StatusToast({
  open,
  type,
  title,
  message,
  onClose,
  autoCloseMs = 5000,
}: StatusToastProps) {
  useEffect(() => {
    if (!open) return undefined;
    if (type === 'info' && autoCloseMs <= 0) return undefined;
    const timer = window.setTimeout(onClose, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [open, type, title, message, autoCloseMs, onClose]);

  if (!open) return null;

  const styles =
    type === 'success'
      ? {
          border: 'border-emerald-200',
          bg: 'bg-emerald-50',
          iconWrap: 'bg-emerald-100 text-emerald-700',
          title: 'text-emerald-800',
          text: 'text-emerald-700',
          Icon: CheckCircle2,
        }
      : type === 'error'
        ? {
            border: 'border-red-200',
            bg: 'bg-red-50',
            iconWrap: 'bg-red-100 text-red-600',
            title: 'text-red-800',
            text: 'text-red-700',
            Icon: XCircle,
          }
        : {
            border: 'border-sky-200',
            bg: 'bg-sky-50',
            iconWrap: 'bg-sky-100 text-sky-700',
            title: 'text-sky-800',
            text: 'text-sky-700',
            Icon: Info,
          };

  const Icon = styles.Icon;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] w-[min(100%-2rem,24rem)]">
      <div
        role="status"
        className={`pointer-events-auto overflow-hidden rounded-xl border bg-white shadow-2xl ${styles.border}`}
      >
        <div className={`flex items-start gap-3 px-4 py-3 ${styles.bg}`}>
          <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${styles.iconWrap}`}>
            <Icon size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-semibold ${styles.title}`}>{title}</p>
            <p className={`mt-0.5 text-sm leading-5 ${styles.text}`}>{message}</p>
          </div>
          {type !== 'info' && (
            <button
              type="button"
              onClick={onClose}
              className="grid size-7 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-white/80"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
