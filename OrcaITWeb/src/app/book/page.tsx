import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/booking-form";
import { CustomerTrust } from "@/components/customer-trust";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Book Online | Request a Quote — Orca IT",
  description:
    "Book Orca IT online. Choose remote or on-site support, select services, and request a quote. No solution, no fee.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb]">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Prefer to talk? Call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>
      </div>

      <SiteHeader />

      <section className="px-5 pb-10 pt-8 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Booking
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Choose <strong>Remote</strong> or <strong>On-site</strong> first — each path uses its
            own form. Remote bookings do not ask for an address.
          </p>

          <div className="mt-8">
            <BookingForm />
          </div>

          <div className="mt-10">
            <CustomerTrust compact />
          </div>

          <p className="mt-8 pb-8 text-center text-sm text-slate-500">
            Prefer to pick an exact appointment time?{" "}
            <Link href="/book-now" className="font-bold text-brand-blue hover:text-brand-navy">
              Open the schedule booking
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
