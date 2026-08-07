import type { Metadata } from "next";
import { BookNowWizard } from "@/components/book-now-wizard";

export const metadata: Metadata = {
  title: "Reserve Your Appointment | Book Orca IT",
  description:
    "Reserve your Orca IT appointment online. Enter your postcode, choose a service and time, and we'll confirm your booking.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb]">
      <section className="px-5 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="eyebrow">Book online</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Reserve your appointment now
          </h1>
          <p className="section-copy mx-auto mt-3">
            Enter your postcode, choose a service and time, and we&apos;ll confirm your booking.
          </p>
        </div>
        <BookNowWizard />
      </section>
    </main>
  );
}
