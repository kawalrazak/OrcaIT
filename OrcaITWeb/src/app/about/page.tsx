import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Orca IT makes technology feel simple — with clear plans, accountable support and a team that listens first.",
};

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="About Orca IT"
      title="IT should feel this simple."
      description="We help Australian homes and businesses with technology that works — explained clearly and supported properly."
      heroImage="/orca-about-team.png"
      heroImageAlt="The Orca IT team in the office"
      heroImagePosition="object-[center_22%]"
    >
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="section-title">A local team focused on clear, reliable support.</h2>
            <p className="section-copy">
              Orca IT exists to make technology less stressful. Whether you need a home
              computer fixed or a full business IT partner, you get real people, honest
              advice and solutions that fit how you actually work.
            </p>
            <div className="mt-8 space-y-3 text-sm font-semibold text-brand-navy">
              <p>
                Phone:{" "}
                <a href={`tel:${ORCA_PHONE_TEL}`} className="text-brand-blue hover:underline">
                  {ORCA_PHONE_DISPLAY}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${ORCA_EMAIL}`} className="text-brand-blue hover:underline">
                  {ORCA_EMAIL}
                </a>
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            {[
              {
                number: "01",
                title: "We listen first",
                copy: "We learn how your team works, what matters and where technology is getting in the way.",
              },
              {
                number: "02",
                title: "We make a plan",
                copy: "You get clear priorities, honest recommendations and solutions that fit your business.",
              },
              {
                number: "03",
                title: "We take care of it",
                copy: "Our team handles the day-to-day details and keeps your technology healthy.",
              },
              {
                number: "04",
                title: "We keep improving",
                copy: "As your needs change, we help your systems, security and strategy evolve with you.",
              },
            ].map(({ number, title, copy }) => (
              <div key={number} className="border-t border-red-100 pt-5">
                <p className="text-sm font-extrabold text-brand-fun">{number}</p>
                <h3 className="mt-5 text-xl font-extrabold text-brand-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="eyebrow">Next step</p>
          <h2 className="section-title mx-auto max-w-2xl">
            Prefer to talk it through?
          </h2>
          <p className="section-copy mx-auto max-w-2xl">
            Book online or call us — we&apos;ll help you choose the right support path.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book-now"
              className="rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
            >
              Book Online
            </Link>
            <Link
              href="/what-we-do"
              className="rounded-full border border-brand-navy/15 px-7 py-4 font-bold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
            >
              Explore what we do
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
