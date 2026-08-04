import type { Metadata } from "next";
import { BookNowWizard } from "@/components/book-now-wizard";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Reserve Your Appointment | Book Orca IT",
  description:
    "Reserve your Orca IT appointment online. Enter your postcode, choose a service and time, and we'll confirm your booking.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb]">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Need help now? Call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>
      </div>

      <SiteHeader />

      <section className="px-5 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="eyebrow">Book online</p>
          <h1 className="section-title">Reserve your appointment now</h1>
          <p className="section-copy mx-auto">
            Enter your postcode, choose a service and time, and we&apos;ll confirm your booking.
          </p>
        </div>
        <BookNowWizard />
      </section>
    </main>
  );
}
