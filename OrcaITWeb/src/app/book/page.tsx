import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { BookNowWizard } from "@/components/book-now-wizard";
import { ReviewRatingTrigger } from "@/components/customer-trust";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import { reviewStats } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Book Online | Orca IT Appointment Booking",
  description:
    "Book Orca IT online in a few easy steps. Choose your service, pick a time, and get trusted home or business IT support. No solution, no fee.",
};

const trustPoints = [
  "No solution, no fee",
  "Friendly local technicians",
  "Remote or on-site support",
  "Clear pricing before we start",
];

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb]">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Prefer to talk? Call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>{" "}
        — we&apos;re happy to help
      </div>

      <SiteHeader />

      <section className="bg-brand-navy px-5 py-10 text-white lg:px-8 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sky">
              Book online
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Book trusted IT help in a few easy steps
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Tell us where you are, choose a service, pick a time that suits you, and we&apos;ll
              take care of the rest. Clear advice. Friendly support. No jargon.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-brand-fun">
              <ShieldCheck className="size-4" />
              No solution, no fee
            </div>
          </div>

          <ReviewRatingTrigger className="rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur transition hover:bg-white/15 sm:min-w-[240px]">
            <span className="flex gap-1 text-yellow-300">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-5 fill-current" />
              ))}
            </span>
            <span className="mt-3 block text-2xl font-black tracking-tight text-white">
              {reviewStats.averageRating} stars
            </span>
            <span className="mt-1 block text-sm text-white/80">
              Based on {reviewStats.totalReviews}+ customer reviews — click to read
            </span>
          </ReviewRatingTrigger>
        </div>
      </section>

      <section className="border-b border-blue-100 bg-white px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center sm:justify-between">
          {trustPoints.map((point) => (
            <p
              key={point}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy"
            >
              <span className="size-1.5 rounded-full bg-brand-fun" />
              {point}
            </p>
          ))}
        </div>
      </section>

      <section className="px-5 py-10 sm:py-14 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Complete your booking below
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            It only takes a minute. We&apos;ll confirm your appointment and get you back up and
            running as soon as possible.
          </p>
        </div>
        <BookNowWizard />
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-slate-500">
          Need help choosing a service?{" "}
          <a href={`tel:${ORCA_PHONE_TEL}`} className="font-bold text-brand-blue hover:text-brand-navy">
            Call {ORCA_PHONE_DISPLAY}
          </a>{" "}
          or{" "}
          <Link href="/what-we-do" className="font-bold text-brand-blue hover:text-brand-navy">
            browse what we do
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
