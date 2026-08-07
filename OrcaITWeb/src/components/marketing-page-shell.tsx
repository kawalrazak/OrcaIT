import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import { servicePageLinks } from "@/data/service-pages";

type MarketingPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  heroImage?: string;
  heroImageAlt?: string;
  heroImagePosition?: string;
  bookHref?: string;
};

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  children,
  heroImage,
  heroImageAlt = "Orca IT",
  heroImagePosition = "object-[center_30%]",
  bookHref = "/book",
}: MarketingPageShellProps) {
  return (
    <main className="overflow-hidden bg-white">
      <SiteHeader />

      <section
        className={`relative overflow-hidden text-white ${
          heroImage
            ? "min-h-[70vh] sm:min-h-[78vh]"
            : "bg-gradient-to-br from-brand-ink via-brand-navy to-brand-blue px-5 py-16 lg:px-8 lg:py-24"
        }`}
      >
        {heroImage ? (
          <>
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              priority
              className={`object-cover ${heroImagePosition}`}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-brand-blue/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/75 via-brand-navy/45 to-brand-blue/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/55 via-transparent to-brand-ink/10" />
          </>
        ) : (
          <>
            <div className="absolute -right-20 top-12 size-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-brand-sky/20 blur-3xl" />
          </>
        )}

        <div
          className={`relative mx-auto max-w-7xl ${
            heroImage
              ? "flex min-h-[70vh] flex-col justify-end px-5 py-16 sm:min-h-[78vh] sm:py-20 lg:px-8 lg:py-24"
              : ""
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-100">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50/90">
            {description}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href={bookHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
            >
              Book Online
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={`tel:${ORCA_PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 font-bold text-white transition hover:border-brand-sky hover:text-brand-sky"
            >
              Call {ORCA_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {children}

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-brand-navy px-6 py-16 text-center text-white sm:px-12 lg:py-20">
          <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-brand-sky/25 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Book online or call us and we&apos;ll help you get back up and running.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={bookHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
              >
                Book an appointment
              </Link>
              <a
                href={`mailto:${ORCA_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 font-bold text-white transition hover:border-brand-sky hover:text-brand-sky"
              >
                <Mail className="size-5" />
                {ORCA_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-red-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <p className="text-lg font-extrabold text-brand-navy">Orca IT</p>
            <p className="mt-5 max-w-sm leading-7 text-slate-600">
              Simple, secure and reliable technology for Australian homes and businesses.
            </p>
          </div>
          <div>
            <p className="font-extrabold text-brand-navy">Services</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              {servicePageLinks.slice(0, 5).map((service) => (
                <Link key={service.href} href={service.href} className="hover:text-brand-blue">
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-extrabold text-brand-navy">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link href="/what-we-do" className="hover:text-brand-blue">
                What We Do
              </Link>
              <Link href="/business-it" className="hover:text-brand-blue">
                Business IT
              </Link>
              <Link href="/why-orca-it" className="hover:text-brand-blue">
                Why Orca IT
              </Link>
              <Link href="/about" className="hover:text-brand-blue">
                About
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-red-100 px-5 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Orca IT. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
