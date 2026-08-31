import type { ReactNode } from "react";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-red-100 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-extrabold text-brand-navy">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">{children}</div>
    </section>
  );
}
