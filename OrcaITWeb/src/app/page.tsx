import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, ShieldCheck, Smile, Star } from "lucide-react";
import { CustomerTrust, ReviewRatingTrigger } from "@/components/customer-trust";
import { HeroSlider } from "@/components/hero-slider";
import { HomeContactForm } from "@/components/home-contact-form";
import { SiteHeader } from "@/components/site-header";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import { servicePageLinks } from "@/data/service-pages";
import { reviewStats } from "@/data/reviews";

function Logo() {
  return (
    <a href="#top" className="inline-flex items-center" aria-label="Orca IT home">
      <Image
        src="/orca-logo.png?v=5"
        alt="ORCA IT"
        width={440}
        height={223}
        className="h-16 w-auto object-contain sm:h-20"
        priority
        unoptimized
      />
    </a>
  );
}

const promises = [
  {
    icon: Home,
    title: "We come to you",
    copy: "On-site help at your home or workplace — simple and convenient.",
  },
  {
    icon: Smile,
    title: "Friendly support",
    copy: "Clear help for both home and business, without the jargon.",
  },
  {
    icon: ShieldCheck,
    title: "No solution, no fee",
    copy: "We work to find a fix. If we can’t, you don’t pay.",
  },
];

export default function HomePage() {
  return (
    <main id="top" className="overflow-hidden bg-background">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Fast IT help for home &amp; business —{" "}
        <a href="/book" className="underline underline-offset-4">
          Book Orca IT today
        </a>
      </div>

      <SiteHeader />

      <section className="overflow-hidden">
        {/* Image band — short overlay on mobile, full hero copy on desktop */}
        <div className="relative h-[46vh] min-h-[260px] overflow-hidden text-white lg:min-h-[78vh] lg:h-auto">
          <HeroSlider />
          <div className="absolute inset-0 bg-brand-blue/40 lg:bg-brand-blue/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/20 to-transparent lg:from-brand-ink/45 lg:via-brand-blue/10 lg:to-brand-fun/10" />

          {/* Mobile overlay — short, readable */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-16 lg:hidden">
            <p className="text-sm font-semibold lowercase tracking-wide text-white/85">
              need help with your tech?
            </p>
            <h1 className="mt-1 text-4xl font-extrabold lowercase leading-[1.05] tracking-[-0.04em] text-white">
              we come to you
            </h1>
            <div className="mt-3 h-1 w-14 rounded-full bg-white" />
          </div>

          {/* Desktop / large tablet — full hero message */}
          <div className="relative mx-auto hidden min-h-[78vh] max-w-7xl flex-col justify-center px-5 py-20 lg:flex lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-brand-fun shadow-lg shadow-white/20">
                <ShieldCheck className="size-5" />
                No solution, no fee
              </p>
              <h1 className="text-5xl font-extrabold leading-tight tracking-[-0.04em] text-white lg:text-6xl">
                IT help that gets you back to life
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/90">
                Friendly on-site and online support for homes and businesses —
                so you can stop stressing about tech and get on with your day.
              </p>
              <div className="mt-9 flex flex-row items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="inline-flex rounded-full bg-brand-fun px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl shadow-red-900/25 transition hover:-translate-y-0.5 hover:bg-red-600"
                >
                  Book Orca IT
                </Link>
                <a
                  href={`tel:${ORCA_PHONE_TEL}`}
                  className="inline-flex rounded-full border-2 border-white/40 px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-brand-sky hover:text-brand-sky"
                >
                  Call {ORCA_PHONE_DISPLAY}
                </a>
              </div>
              <ReviewRatingTrigger className="mt-8">
                <span className="flex flex-row items-center justify-center gap-3">
                  <span className="flex gap-1 text-yellow-300">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-5 fill-current" />
                    ))}
                  </span>
                  <span className="text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4">
                    {reviewStats.averageRating}★ from {reviewStats.totalReviews}+ reviews — tap
                    to read
                  </span>
                </span>
              </ReviewRatingTrigger>
            </div>
          </div>
        </div>

        {/* Mobile trust panel — sits under the photo */}
        <div className="bg-brand-navy px-5 py-10 text-white lg:hidden">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sky">
            Why Orca IT
          </p>
          <h2 className="mt-4 text-[1.65rem] font-extrabold leading-snug tracking-[-0.03em]">
            Your trusted local IT support for homes and businesses.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-7 text-white/85">
            Friendly technicians, clear advice, and practical fixes — remotely or at your door.
            We help you get back online without the jargon or stress.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-brand-fun">
            <ShieldCheck className="size-4" />
            No solution, no fee
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-brand-fun px-7 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-red-600"
            >
              Book Orca IT
            </Link>
            <a
              href={`tel:${ORCA_PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-full border-2 border-white/35 px-7 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-brand-sky hover:text-brand-sky"
            >
              Call {ORCA_PHONE_DISPLAY}
            </a>
          </div>

          <ReviewRatingTrigger className="mt-6">
            <span className="flex items-center gap-2">
              <span className="flex gap-0.5 text-yellow-300">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-4 fill-current" />
                ))}
              </span>
              <span className="text-xs font-semibold text-white/80 underline decoration-white/40 underline-offset-4">
                {reviewStats.averageRating}★ from {reviewStats.totalReviews}+ reviews — tap to
                read
              </span>
            </span>
          </ReviewRatingTrigger>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-3 lg:px-8">
          {promises.map(({ icon: Icon, title, copy }) => {
            const isHighlight = title === "No solution, no fee";
            return (
              <article
                key={title}
                className={`rounded-[1.75rem] p-7 text-center transition ${
                  isHighlight
                    ? "border-2 border-brand-fun bg-brand-fun/5 shadow-lg shadow-brand-fun/10"
                    : "border border-red-100 bg-white shadow-sm"
                }`}
              >
                <span
                  className={`mx-auto grid size-14 place-items-center rounded-2xl ${
                    isHighlight ? "bg-brand-fun text-white" : "bg-brand-mist text-brand-fun"
                  }`}
                >
                  <Icon className="size-7" />
                </span>
                <h2
                  className={`mt-5 text-xl font-black uppercase tracking-wide ${
                    isHighlight ? "text-brand-fun" : "text-brand-navy"
                  }`}
                >
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                {isHighlight ? (
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-fun/70">
                    Our promise to you
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <CustomerTrust />

      <section id="contact" className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-brand-navy sm:text-4xl">
            Have a question?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Send us a message and our team will be in touch.
          </p>
          <HomeContactForm />
        </div>
      </section>

      <section className="bg-brand-navy px-5 py-16 text-center text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Book Orca IT online
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/85">
            No fuss booking — pick a time that suits you and we&apos;ll take care of the rest.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-fun px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-red-600"
          >
            Book Online
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-red-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <Logo />
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
              <Link href="/about" className="hover:text-brand-blue">
                About
              </Link>
              <Link href="/privacy" className="hover:text-brand-blue">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-brand-blue">
                Terms of Service
              </Link>
            </div>
            <p className="mt-8 font-extrabold text-brand-navy">Let&apos;s talk</p>
            <a
              href={`mailto:${ORCA_EMAIL}`}
              className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:text-brand-navy"
            >
              {ORCA_EMAIL}
            </a>
          </div>
        </div>
        <div className="border-t border-red-100 px-5 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Orca IT. All rights reserved.
          {" · "}
          <Link href="/privacy" className="hover:text-brand-blue">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-brand-blue">
            Terms
          </Link>
        </div>
      </footer>
    </main>
  );
}
