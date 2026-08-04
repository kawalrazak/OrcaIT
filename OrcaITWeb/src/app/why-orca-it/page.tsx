import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  HeartHandshake,
  Phone,
  ShieldCheck,
  Smile,
  Star,
  UserCheck,
  Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Why Orca IT",
  description:
    "Powerful technology with refreshingly human support. Proactive, personal, practical IT for homes and businesses.",
};

const trustPoints = [
  { icon: Star, label: "4.9★ from happy clients" },
  { icon: HeartHandshake, label: "Human, jargon-free support" },
  { icon: ShieldCheck, label: "Accountable from start to finish" },
  { icon: UserCheck, label: "One team that owns the outcome" },
];

const highlights = [
  {
    title: "Less downtime",
    copy: "Proactive management helps identify and resolve risks early.",
  },
  {
    title: "Stronger security",
    copy: "Sensible protection and guidance for your entire team.",
  },
  {
    title: "Better decisions",
    copy: "Clear advice helps you invest confidently in the right technology.",
  },
];

export default function WhyOrcaItPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb]">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Ready for simpler IT? Call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>{" "}
        or{" "}
        <Link href="/book-now" className="underline underline-offset-4">
          book online
        </Link>
      </div>

      <SiteHeader />

      <section className="relative overflow-hidden text-white">
        <Image
          src="/orca-team.png"
          alt="The friendly Orca IT team giving thumbs up"
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
              Why Orca IT
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              We take ownership of your technology.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              No finger-pointing. No confusing technical talk. Just accountable,
              expert support built for the way you work.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-brand-fun px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl shadow-red-900/30 transition hover:-translate-y-0.5 hover:bg-red-600"
              >
                Book Orca
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
              The Orca difference
            </p>
            <ul className="mt-5 space-y-4">
              {[
                "Proactive — we solve issues before they slow you down",
                "Personal — real people who understand your world",
                "Practical — the right solution, without the jargon",
                "Prepared — a clear roadmap for what’s next",
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

      <section className="bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Powerful technology</p>
            <h2 className="section-title">Refreshingly human support.</h2>
            <p className="section-copy">
              Behind every booking is a team that listens first, explains clearly,
              and stays accountable until the job is done.
            </p>
            <div className="mt-10 space-y-6">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-brand-mist text-brand-navy">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-brand-navy">{item.title}</h3>
                    <p className="mt-1 leading-7 text-slate-600">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Proactive", "We solve issues before they slow you down."],
              ["Personal", "Real people who understand your business."],
              ["Practical", "The right solution, without the jargon."],
              ["Prepared", "A clear technology roadmap for what’s next."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-red-100 bg-gradient-to-br from-brand-ink via-brand-navy to-brand-blue p-6 text-white shadow-lg shadow-brand-navy/15"
              >
                <p className="font-extrabold text-brand-sky">{title}</p>
                <p className="mt-3 text-sm leading-6 text-white/90">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center gap-1 text-yellow-400">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-6 fill-current" />
              ))}
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.045em] text-brand-navy sm:text-5xl">
              Trusted support. Real feedback.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "Thank you for a job well done. Professional service delivered with care and patience.",
                name: "Robert",
                place: "Melbourne",
              },
              {
                quote:
                  "As older computer users, the technician solved our problems with good grace and clear explanations.",
                name: "Rose",
                place: "Glen Waverley",
              },
              {
                quote:
                  "Fast booking, friendly support and our Wi-Fi was sorted the same day. Highly recommend Orca IT.",
                name: "Daniel",
                place: "Richmond",
              },
            ].map((review) => (
              <article
                key={review.name}
                className="rounded-[1.75rem] border border-red-100 bg-white p-7"
              >
                <p className="leading-7 text-slate-700">&ldquo;{review.quote}&rdquo;</p>
                <p className="mt-6 font-extrabold text-brand-navy">{review.name}</p>
                <p className="text-sm text-slate-500">{review.place}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Support that feels human</p>
            <h2 className="section-title">We speak people, not just technology.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: "We find the real issue",
                copy: "Not just a temporary workaround—we look for the cause and the practical fix.",
              },
              {
                icon: Smile,
                title: "We keep it simple",
                copy: "You get a clear explanation of what happened and what we recommend next.",
              },
              {
                icon: UserCheck,
                title: "We take ownership",
                copy: "One helpful team stays accountable instead of sending you around in circles.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[1.75rem] border border-red-100 bg-surface p-7">
                <Icon className="size-8 text-brand-fun" />
                <h3 className="mt-6 text-xl font-black text-brand-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-brand-navy px-8 py-12 text-center text-white sm:px-12">
          <div className="absolute left-1/2 top-0 h-48 w-80 -translate-x-1/2 rounded-full bg-brand-sky/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-sky">
              Ready to feel the difference?
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Book support that takes ownership.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">
              Speak with Orca IT or book online — we&apos;ll help you get back up and running.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
              >
                Book Online
              </a>
              <a
                href={`tel:${ORCA_PHONE_TEL}`}
                className="inline-flex rounded-full border border-white/25 px-7 py-4 font-bold transition hover:border-brand-sky hover:text-brand-sky"
              >
                Call {ORCA_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
