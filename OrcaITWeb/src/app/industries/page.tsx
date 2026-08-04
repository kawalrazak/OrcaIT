import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserCheck, UserX } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { industries } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Managed IT services tailored for banking, capital markets, manufacturing, healthcare and higher education.",
};

export default function IndustriesPage() {
  return (
    <MarketingPageShell
      eyebrow="Industries we serve"
      title="Managed IT services customized for your industry."
      description="Vertical expertise to streamline workflow, stay compliant and keep your teams productive."
    >
      <section className="bg-brand-mist/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(({ icon: Icon, label, copy }) => (
              <article
                key={label}
                className="rounded-[1.75rem] border border-red-100 bg-white p-7 shadow-sm"
              >
                <Icon className="size-8 text-brand-blue" />
                <h2 className="mt-8 text-2xl font-extrabold text-brand-navy">{label}</h2>
                <p className="mt-4 leading-7 text-slate-600">{copy}</p>
                <ul className="mt-6 space-y-2 text-sm font-semibold text-brand-navy/80">
                  <li>• Industry-aware support and advice</li>
                  <li>• Secure, reliable day-to-day operations</li>
                  <li>• Clear communication with your team</li>
                </ul>
                <Link
                  href="/book-now"
                  className="mt-8 inline-flex items-center gap-2 font-bold text-brand-blue hover:text-brand-navy"
                >
                  Talk to us
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          <Link
            href="/book-now"
            className="group rounded-[2rem] border border-red-100 bg-brand-mist/50 p-8 transition hover:border-brand-fun hover:shadow-xl"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-fun shadow-sm">
              <UserCheck className="size-6" />
            </span>
            <h3 className="mt-6 text-2xl font-extrabold text-brand-navy">
              We have an IT department
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Partner with us to strengthen existing infrastructure and day-to-day operations.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-blue">
              Contact us today
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            href="/book-now"
            className="group rounded-[2rem] border border-red-100 bg-brand-mist/50 p-8 transition hover:border-brand-fun hover:shadow-xl"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-fun shadow-sm">
              <UserX className="size-6" />
            </span>
            <h3 className="mt-6 text-2xl font-extrabold text-brand-navy">
              We don&apos;t have an IT department
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Work with us as your one-stop shop for IT management, support and solutions.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-blue">
              Contact us today
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
