import type { Metadata } from "next";
import Link from "next/link";
import { CustomerTrust } from "@/components/customer-trust";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import { reviewStats } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Customer Reviews | Orca IT",
  description: `Read Orca IT customer reviews. Rated ${reviewStats.averageRating}/5 from ${reviewStats.totalReviews}+ homes and businesses.`,
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Ready to book? Call{" "}
        <a href={`tel:${ORCA_PHONE_TEL}`} className="underline underline-offset-4">
          {ORCA_PHONE_DISPLAY}
        </a>{" "}
        or{" "}
        <Link href="/booking" className="underline underline-offset-4">
          request a quote online
        </Link>
      </div>
      <SiteHeader />
      <div className="px-5 pt-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Reviews
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Click the rating card below to open the full list of customer feedback.
          </p>
        </div>
      </div>
      <CustomerTrust />
    </main>
  );
}
