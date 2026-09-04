import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Booking | Request a Quote — Orca IT",
  description:
    "Book Orca IT online. Choose remote or on-site support, select services, and request a quote.",
};

/** Keep /booking working — main form now lives on /book */
export default function BookingPage() {
  redirect("/book");
}
