import { useEffect } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

interface StatusToastProps {
  open: boolean;
  type: 'success' | 'error';
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
  autoCloseMs = 3500,
}: StatusToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [open, onClose, autoCloseMs]);

  if (!open) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed right-4 top-4 z-[70] w-full max-w-sm">
      <div
        role="status"
        className={`overflow-hidden rounded-xl border bg-white shadow-2xl ${
          isSuccess ? 'border-emerald-200' : 'border-red-200'
        }`}
      >
        <div
          className={`flex items-start gap-3 px-4 py-3 ${
            isSuccess ? 'bg-emerald-50' : 'bg-red-50'
          }`}
        >
          <span
            className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${
              isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-semibold ${isSuccess ? 'text-emerald-800' : 'text-red-800'}`}>
              {title}
            </p>
            <p className={`mt-0.5 text-sm leading-5 ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`}>
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-white/80"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
