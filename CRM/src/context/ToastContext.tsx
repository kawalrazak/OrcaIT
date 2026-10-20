import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

export type ToastInput = {
  type: ToastType;
  title: string;
  message: string;
};

type ToastItem = ToastInput & { id: string };

type ToastContextType = {
  notify: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const styles: Record<ToastType, { border: string; bg: string; iconWrap: string; title: string; text: string; Icon: typeof Info }> = {
  success: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    title: 'text-emerald-800',
    text: 'text-emerald-700',
    Icon: CheckCircle2,
  },
  error: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    iconWrap: 'bg-red-100 text-red-600',
    title: 'text-red-800',
    text: 'text-red-700',
    Icon: XCircle,
  },
  info: {
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    iconWrap: 'bg-sky-100 text-sky-700',
    title: 'text-sky-800',
    text: 'text-sky-700',
    Icon: Info,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((toast: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current.slice(-3), { ...toast, id }]);
    window.setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,24rem)] flex-col gap-2">
        {toasts.map((toast) => {
          const style = styles[toast.type];
          const Icon = style.Icon;
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto overflow-hidden rounded-xl border bg-white shadow-2xl ${style.border}`}
            >
              <div className={`flex items-start gap-3 px-4 py-3 ${style.bg}`}>
                <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${style.iconWrap}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${style.title}`}>{toast.title}</p>
                  <p className={`mt-0.5 text-sm leading-5 ${style.text}`}>{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="grid size-7 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-white/80"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
