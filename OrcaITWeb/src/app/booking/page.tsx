import type { Metadata } from "next";
import Link from "next/link";
import {
  HardDrive,
  Headphones,
  Laptop,
  Mail,
  Monitor,
  Printer,
  Router,
  ShieldCheck,
  Tv,
  Wifi,
} from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { SiteHeader } from "@/components/site-header";
import {
  ORCA_EMAIL,
  ORCA_PHONE_DISPLAY,
  ORCA_PHONE_TEL,
} from "@/data/contact";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book Orca IT support online or call 0498 082 750. Home and business technology help with fast, clear next steps.",
};

const whyUs = [
  "Trained & friendly IT experts",
  "Fully insured & professional technicians",
  "Locally owned & operated",
  "Home and Business IT Solutions",
  "Clear advice with no jargon",
  "Remote and on-site support available",
];

const serviceAreas = [
  { icon: Monitor, label: "Desktop PC repairs" },
  { icon: Wifi, label: "Internet & networking" },
  { icon: ShieldCheck, label: "Virus removal" },
  { icon: Mail, label: "Email troubleshooting" },
  { icon: Printer, label: "Printer setup" },
  { icon: Laptop, label: "Mac repairs" },
  { icon: HardDrive, label: "Data recovery" },
  { icon: Tv, label: "Smart TV setup" },
  { icon: Headphones, label: "Remote & phone support" },
  { icon: Router, label: "Broadband" },
];

export default function BookingPage() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Need help now? Call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>
      </div>

      <SiteHeader />

      <section className="bg-brand-navy px-5 py-12 text-white lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Looking for – Expert Help?
          </h1>
          <a
            href={`tel:${ORCA_PHONE_TEL}`}
            className="mt-6 inline-flex text-3xl font-black tracking-tight text-brand-sky transition hover:text-white sm:text-4xl"
          >
            Call Orca IT – {ORCA_PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <section id="book-form" className="bg-slate-50 px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <BookingForm />

          <aside className="mt-8 rounded-xl bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
              Why Us?
            </h2>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {whyUs.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-brand-fun" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-xl bg-brand-navy p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-sky">
                Get in Touch
              </p>
              <a
                href={`tel:${ORCA_PHONE_TEL}`}
                className="mt-3 block text-3xl font-black tracking-tight hover:text-brand-sky"
              >
                {ORCA_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${ORCA_EMAIL}`}
                className="mt-2 inline-block text-sm font-semibold text-white/90 hover:text-brand-sky"
              >
                {ORCA_EMAIL}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="eyebrow">Our services</p>
            <h2 className="section-title">What can we help with?</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand-mist text-brand-navy">
                  <Icon className="size-5" />
                </span>
                <p className="font-extrabold text-brand-navy">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-brand-navy px-8 py-12 text-center text-white sm:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-sky">
            Let&apos;s get started
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Are you ready for less hassle and a more productive business and life?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">
            Stop worrying about your technology problems. Focus on your day while we take
            care of the support you deserve.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`tel:${ORCA_PHONE_TEL}`}
              className="inline-flex rounded-md bg-brand-fun px-7 py-4 text-lg font-black text-white transition hover:bg-red-600"
            >
              Contact us Now — {ORCA_PHONE_DISPLAY}
            </a>
            <Link
              href="/#services"
              className="inline-flex rounded-md border border-white/25 px-7 py-4 font-bold transition hover:border-brand-sky hover:text-brand-sky"
            >
              Explore services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
