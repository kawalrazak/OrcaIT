import type { ReactNode } from 'react';

export default function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-200/60 p-3">
      <div
        id="app-chrome"
        className="relative flex h-[80vh] w-[80vw] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-300 bg-slate-50 shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}
