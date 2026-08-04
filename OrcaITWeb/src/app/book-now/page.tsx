import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { BookNowWizard } from "@/components/book-now-wizard";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Book Orca IT Online | Fast Home & Business Support",
  description:
    "Book Orca IT in minutes. Friendly technicians, clear pricing, remote or on-site help for homes and businesses across Australia.",
};

const trustPoints = [
  { icon: Clock3, label: "Book in under 2 minutes" },
  { icon: ShieldCheck, label: "Insured technicians" },
  { icon: MapPin, label: "Remote & on-site options" },
  { icon: Zap, label: "Same-day slots often available" },
];

const highlights = [
  {
    title: "Clear pricing",
    copy: "See service options and pricing before you confirm — no confusing quotes.",
  },
  {
    title: "Real people",
    copy: "Friendly Orca technicians who explain the fix in plain English.",
  },
  {
    title: "Home & business",
    copy: "From Wi-Fi and virus cleanup to managed support for your workplace.",
  },
];

export default function BookNowPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb]">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Limited same-day slots — call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>{" "}
        or book online now
      </div>

      <SiteHeader />

      <section className="relative overflow-hidden text-white">
        <Image
          src="/orca-team.png"
          alt="Orca IT technicians ready to help"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-blue/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/85 via-brand-navy/65 to-brand-blue/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-transparent to-brand-ink/20" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-brand-sky backdrop-blur">
              <Star className="size-3.5 fill-yellow-300 text-yellow-300" />
              4.9★ rated local IT support
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Book IT help that gets you back to life.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              Choose your service, pick a time, and we&apos;ll take care of the rest —
              remotely or on-site, with clear advice and no jargon.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#book"
                className="inline-flex items-center justify-center rounded-full bg-brand-fun px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl shadow-red-900/30 transition hover:-translate-y-0.5 hover:bg-red-600"
              >
                Start booking
              </a>
              <a
                href={`tel:${ORCA_PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-brand-sky hover:text-brand-sky"
              >
                <Phone className="size-4" />
                Call {ORCA_PHONE_DISPLAY}
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustPoints.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  <Icon className="size-5 shrink-0 text-brand-sky" />
                  <span className="text-sm font-semibold text-white">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/20 bg-white/95 p-6 text-brand-navy shadow-2xl backdrop-blur sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-fun">
              Why book with Orca
            </p>
            <ul className="mt-5 space-y-4">
              {[
                "Online booking in a few taps",
                "Friendly technicians, not call-centre scripts",
                "Home Wi-Fi, virus cleanup, Mac & PC help",
                "Business support when you need it most",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-6">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-fun" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-brand-mist px-4 py-3 text-sm font-bold text-brand-navy">
              Prefer to talk first? Call{" "}
              <a href={`tel:${ORCA_PHONE_TEL}`} className="text-brand-fun underline">
                {ORCA_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-red-100 bg-white px-5 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-red-100 bg-surface p-5">
              <h2 className="text-lg font-extrabold text-brand-navy">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="book" className="scroll-mt-24 px-5 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="eyebrow">Book online</p>
          <h2 className="section-title">Reserve your appointment now</h2>
          <p className="section-copy mx-auto">
            Enter your postcode, choose a service and time, and we&apos;ll confirm your booking.
          </p>
        </div>
        <BookNowWizard />
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-brand-navy px-8 py-12 text-center text-white sm:px-12">
          <div className="absolute left-1/2 top-0 h-48 w-80 -translate-x-1/2 rounded-full bg-brand-sky/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-sky">
              Still deciding?
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              One call can fix your day.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">
              Speak with Orca IT and we&apos;ll help you choose remote or on-site support that fits.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`tel:${ORCA_PHONE_TEL}`}
                className="inline-flex rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
              >
                Call {ORCA_PHONE_DISPLAY}
              </a>
              <Link
                href="/what-we-do"
                className="inline-flex rounded-full border border-white/25 px-7 py-4 font-bold transition hover:border-brand-sky hover:text-brand-sky"
              >
                See what we fix
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
