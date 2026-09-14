import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Home, Mail, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your payment to Orca IT was received successfully. Thank you.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-mist/40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-24 size-[28rem] rounded-full bg-brand-sky/30 blur-3xl" />
        <div className="absolute -left-20 bottom-10 size-[24rem] rounded-full bg-brand-fun/10 blur-3xl" />
        <div className="hero-grid absolute inset-0 opacity-40" />
      </div>

      <SiteHeader showActions={false} />

      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col items-center justify-center px-5 py-16 text-center lg:px-8 lg:py-24">
        <Image
          src="/orca-logo.png?v=5"
          alt="Orca IT"
          width={440}
          height={223}
          className="h-16 w-auto object-contain sm:h-20"
          priority
          unoptimized
        />

        <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
          <CheckCircle2 className="size-5" />
          Payment received
        </div>

        <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] text-brand-ink sm:text-5xl">
          Thank you for your payment
        </h1>

        <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-navy/75 sm:text-lg">
          Your payment to Orca IT was successful. A confirmation may also appear in
          your email or bank app. If you need a receipt or have any questions, we’re
          here to help.
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          <a
            href={`tel:${ORCA_PHONE_TEL}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-fun px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-fun/20 transition hover:brightness-110"
          >
            <Phone className="size-4" />
            Call {ORCA_PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${ORCA_EMAIL}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-brand-navy ring-1 ring-brand-sky/50 transition hover:bg-brand-mist"
          >
            <Mail className="size-4" />
            Email {ORCA_EMAIL}
          </a>
        </div>

        <div className="mt-12 w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/80 p-6 text-left shadow-sm backdrop-blur sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-fun">
            What happens next
          </p>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-brand-navy/80">
            <li>Your payment has been recorded against your Orca IT invoice.</li>
            <li>Our team will continue or complete your support as arranged.</li>
            <li>
              Need help sooner? Call us on {ORCA_PHONE_DISPLAY} or email {ORCA_EMAIL}.
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition hover:text-brand-ink"
        >
          <Home className="size-4" />
          Back to orcait.com.au
        </Link>
      </section>
    </main>
  );
}
