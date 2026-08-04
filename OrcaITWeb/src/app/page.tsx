import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  DatabaseBackup,
  Headphones,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Printer,
  Router,
  ShieldCheck,
  Smile,
  Star,
  Stethoscope,
  UserCheck,
  UserX,
  Wifi,
  Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import {
  industries,
  serviceCategories,
} from "@/data/site-content";
import { servicePageLinks, servicePages } from "@/data/service-pages";

const serviceHrefByTitle = new Map<string, string>(
  servicePages.flatMap((service) => [
    [service.title, `/services/${service.slug}`] as const,
    [service.shortTitle, `/services/${service.slug}`] as const,
  ]),
);

const quickFixes = [
  {
    icon: Laptop,
    title: "Computers & laptops",
    copy: "Slow, crashing or refusing to start? We’ll get to the bottom of it.",
  },
  {
    icon: Wifi,
    title: "Internet & Wi-Fi",
    copy: "Fix dropouts, dead zones, router issues and unreliable connections.",
  },
  {
    icon: ShieldCheck,
    title: "Virus & security",
    copy: "Remove threats and help protect your devices, accounts and data.",
  },
  {
    icon: Mail,
    title: "Email problems",
    copy: "Account setup, sync issues, lost access and inbox troubleshooting.",
  },
  {
    icon: Printer,
    title: "Printers & scanners",
    copy: "Setup, connection and everyday printing problems made simple.",
  },
  {
    icon: DatabaseBackup,
    title: "Backup & recovery",
    copy: "Protect important files and recover data when something goes wrong.",
  },
  {
    icon: Router,
    title: "Home & office networks",
    copy: "Reliable networking for every room, device and member of your team.",
  },
  {
    icon: Headphones,
    title: "Remote IT support",
    copy: "Fast help without the wait when your issue can be solved online.",
  },
];

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

function ArrowLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 font-bold text-brand-navy transition hover:text-brand-blue"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function Home() {
  return (
    <main id="top" className="overflow-hidden bg-background">
      <div className="bg-brand-fun px-5 py-2.5 text-center text-sm font-bold text-white">
        Fast IT help for home &amp; business —{" "}
        <a href="/book-now" className="underline underline-offset-4">
          Book Orca IT today
        </a>
      </div>

      <SiteHeader />

      <section className="relative min-h-[70vh] overflow-hidden text-white sm:min-h-[78vh]">
        <Image
          src="/hero-van.jpg"
          alt="ORCA IT service van providing IT services for home and business"
          fill
          priority
          className="object-cover object-[center_45%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-blue/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/45 via-brand-blue/10 to-brand-fun/10" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-5 py-20 sm:min-h-[78vh] lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex rounded-full bg-brand-fun px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white">
              Friendly experts. Fast solutions.
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              IT help that gets you back to life
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              Friendly on-site and online support for homes and businesses —
              so you can stop stressing about tech and get on with your day.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book-now"
                className="inline-flex rounded-full bg-brand-fun px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl shadow-red-900/25 transition hover:-translate-y-0.5 hover:bg-red-600"
              >
                Book Orca IT
              </Link>
              <Link
                href="#services"
                className="inline-flex rounded-full border-2 border-white/40 px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-brand-sky hover:text-brand-sky"
              >
                What we fix
              </Link>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
              <div className="flex gap-1 text-yellow-300">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-5 fill-current" />
                ))}
              </div>
              <p className="text-sm font-semibold text-white/90">
                4.9 stars from our happy clients
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-5 lg:px-8">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-brand-ink/15 lg:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 sm:p-10">
            <p className="eyebrow">Need a hand?</p>
            <h2 className="text-2xl font-black tracking-tight text-brand-navy sm:text-3xl">
              Tell us what your tech is doing.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              We’ll listen, explain the options clearly and organise the right
              support for your home or business.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-6 py-3.5 font-black text-white transition hover:bg-red-600"
              >
                <CalendarCheck className="size-5" />
                Book online
              </Link>
              <a
                href={`tel:${ORCA_PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-navy px-6 py-3.5 font-black text-brand-navy transition hover:bg-brand-navy hover:text-white"
              >
                <Phone className="size-5" />
                {ORCA_PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 bg-brand-navy p-7 text-center text-white sm:p-10">
            {[
              ["On-site", "We come to you"],
              ["Remote", "Fast online help"],
              ["Clear", "No tech jargon"],
            ].map(([title, copy]) => (
              <div key={title} className="flex flex-col justify-center border-white/10 px-2 first:border-0 [&+&]:border-l">
                <p className="text-xl font-black text-brand-sky sm:text-2xl">{title}</p>
                <p className="mt-2 text-xs leading-5 text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-red-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 pb-10 pt-20 text-center md:flex-row md:text-left lg:px-8">
          <p className="max-w-xs text-sm font-bold text-brand-navy/60">
            Fun, fast tech support for Australian homes &amp; businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-bold text-brand-navy/45">
            {["Microsoft 365", "Cloud", "Cyber Security", "Modern Workplace"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <BadgeCheck className="size-5 text-brand-fun" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">What we fix</p>
            <h2 className="section-title">Your everyday technology experts.</h2>
            <p className="section-copy">
              From a stubborn laptop to a whole business network, no technology
              problem is too ordinary or too complicated.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickFixes.map(({ icon: Icon, title, copy }, index) => (
              <Link
                key={title}
                href="/book-now"
                className="quick-fix-card group"
              >
                <span
                  className={`grid size-14 place-items-center rounded-2xl ${
                    index % 2 === 0
                      ? "bg-brand-sky text-brand-navy"
                      : "bg-brand-navy text-brand-sky"
                  }`}
                >
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg font-black text-brand-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-fun">
                  Let&apos;s fix it
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-blue py-20 text-white lg:py-24">
        <div className="absolute -left-16 -top-20 size-64 rounded-full border-[40px] border-white/20" />
        <div className="absolute -bottom-24 right-0 size-72 rounded-full border-[45px] border-brand-fun/15" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em]">
              Getting help is easy
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Sorted in 1, 2, 3.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: CalendarCheck,
                number: "01",
                title: "Book your support",
                copy: "Use our online booking page or call us to tell us what is going wrong.",
              },
              {
                icon: MapPin,
                number: "02",
                title: "We come to you",
                copy: "A friendly technician helps on-site or connects remotely when that is faster.",
              },
              {
                icon: Smile,
                number: "03",
                title: "Enjoy your tech",
                copy: "We solve the issue, explain what happened and help you avoid it next time.",
              },
            ].map(({ icon: Icon, number, title, copy }) => (
              <article key={number} className="rounded-[1.75rem] bg-white p-7 shadow-xl shadow-red-900/10">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-navy text-brand-sky">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-4xl font-black text-brand-mist">{number}</span>
                </div>
                <h3 className="mt-7 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Our services</p>
            <h2 className="section-title">Whatever your technology needs, we’re ready.</h2>
            <p className="section-copy">
              IT services built specifically for your business — from managed support
              and cloud computing to development, hardware and communications.
            </p>
          </div>

          <div className="mt-16 space-y-20">
            {serviceCategories.map((category) => (
              <div key={category.id} id={category.id}>
                <div className="mb-8 max-w-2xl">
                  <h3 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
                    {category.label}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {category.services.map(({ icon: Icon, title, copy, accent }) => (
                    <article
                      key={title}
                      id={title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}
                      className="service-card group scroll-mt-36"
                    >
                      <span className={`grid size-12 place-items-center rounded-2xl ${accent}`}>
                        <Icon className="size-6" />
                      </span>
                      <h4 className="mt-7 text-xl font-extrabold tracking-tight text-brand-navy">
                        {title}
                      </h4>
                      <p className="mt-3 leading-7 text-slate-600">{copy}</p>
                      <div className="mt-7">
                        <ArrowLink href={serviceHrefByTitle.get(title) ?? "/book-now"}>
                          Learn more
                        </ArrowLink>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-ink py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-sky">
              Reliable help, minus the fuss
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Technology should make life easier—not slow it down.
            </h2>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-white/75">
              {["Home & business support", "On-site and remote", "Clear, honest advice"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-brand-sky" strokeWidth={3} />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/book-now"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
            >
              Book Orca IT
              <ArrowRight className="size-5" />
            </Link>
            <a
              href={`tel:${ORCA_PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 px-7 py-4 font-black text-white transition hover:border-brand-sky hover:text-brand-sky"
            >
              Call {ORCA_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section id="why-orca" className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
          <div className="relative min-h-[500px] rounded-[2.5rem] bg-gradient-to-br from-brand-ink via-brand-navy to-brand-fun p-8 text-white shadow-2xl shadow-brand-navy/20 sm:p-12">
            <div className="absolute right-0 top-0 size-64 rounded-full bg-brand-sky/25 blur-3xl" />
            <p className="relative text-sm font-bold uppercase tracking-[0.18em] text-brand-sky">
              The Orca difference
            </p>
            <p className="relative mt-6 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Powerful technology. Refreshingly human support.
            </p>
            <div className="relative mt-14 grid gap-4 sm:grid-cols-2">
              {[
                ["Proactive", "We solve issues before they slow you down."],
                ["Personal", "Real people who understand your business."],
                ["Practical", "The right solution, without the jargon."],
                ["Prepared", "A clear technology roadmap for what’s next."],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                >
                  <p className="font-extrabold text-brand-sky">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/85">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Why Orca IT</p>
            <h2 className="section-title">We take ownership of your technology.</h2>
            <p className="section-copy">
              No finger-pointing. No confusing technical talk. Just accountable,
              expert support and solutions built for the way your business works.
            </p>
            <div className="mt-9 space-y-6">
              {[
                [
                  "Less downtime",
                  "Proactive management helps identify and resolve risks early.",
                ],
                [
                  "Stronger security",
                  "Sensible protection and guidance for your entire team.",
                ],
                [
                  "Better decisions",
                  "Clear advice helps you invest confidently in the right technology.",
                ],
              ].map(([title, copy]) => (
                <div key={title} className="flex gap-4">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-brand-mist text-brand-navy">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-brand-navy">{title}</h3>
                    <p className="mt-1 leading-7 text-slate-600">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <ArrowLink href="/book-now">Meet your new IT partner</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center gap-1 text-yellow-400">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-6 fill-current" />
              ))}
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-brand-fun">
              Our happy customers love us
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-brand-navy sm:text-5xl">
              Trusted support. Real feedback.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Rated 4.9 stars by home and business clients who wanted clear help
              and technology that just works.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "Thank you for a job well done. Professional service delivered with care and patience.",
                name: "Robert",
                place: "Melbourne",
              },
              {
                quote:
                  "As older computer users, the technician solved our problems with good grace and clear explanations.",
                name: "Rose",
                place: "Glen Waverley",
              },
              {
                quote:
                  "Fast booking, friendly support and our Wi-Fi was sorted the same day. Highly recommend Orca IT.",
                name: "Daniel",
                place: "Richmond",
              },
            ].map((review) => (
              <article
                key={review.name}
                className="rounded-[1.75rem] border border-red-100 bg-surface p-7"
              >
                <div className="flex gap-1 text-yellow-400">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 leading-7 text-slate-700">&ldquo;{review.quote}&rdquo;</p>
                <p className="mt-6 font-extrabold text-brand-navy">{review.name}</p>
                <p className="text-sm text-slate-500">{review.place}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-mist/30 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-brand-fun">
              Support that feels human
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-brand-navy sm:text-5xl">
              We speak people, not just technology.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Patient explanations, practical fixes and no confusing jargon. That
              is how technology support should feel.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: "We find the real issue",
                copy: "Not just a temporary workaround—we look for the cause and the practical fix.",
              },
              {
                icon: Smile,
                title: "We keep it simple",
                copy: "You get a clear explanation of what happened and what we recommend next.",
              },
              {
                icon: UserCheck,
                title: "We take ownership",
                copy: "One helpful team stays accountable instead of sending you around in circles.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[1.75rem] border border-red-100 bg-white p-7">
                <Icon className="size-8 text-brand-fun" />
                <h3 className="mt-6 text-xl font-black text-brand-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="bg-brand-mist/40 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="eyebrow">Industries we serve</p>
          <h2 className="section-title mx-auto max-w-2xl">
            Managed IT services customized for your industry
          </h2>
          <p className="section-copy mx-auto max-w-2xl">
            Our vertical solutions expertise allows your business to streamline
            workflow and increase productivity with industry-compliant support.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {industries.map(({ icon: Icon, label, copy }) => (
              <a
                key={label}
                href="/book-now"
                className="group rounded-2xl border border-red-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand-fun hover:shadow-xl"
              >
                <Icon className="size-7 text-brand-blue" />
                <h3 className="mt-8 font-extrabold text-brand-navy">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-blue">Learn more</span>
                  <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-blue" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          <a
            href="/book-now"
            className="group rounded-[2rem] border border-red-100 bg-brand-mist/50 p-8 transition hover:border-brand-fun hover:shadow-xl"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-fun shadow-sm">
              <UserCheck className="size-6" />
            </span>
            <h3 className="mt-6 text-2xl font-extrabold text-brand-navy">
              We have an IT department
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Partner with us for IT management services to grow your existing
              infrastructure and strengthen day-to-day operations.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-blue">
              Contact us today
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
          <a
            href="/book-now"
            className="group rounded-[2rem] border border-red-100 bg-brand-mist/50 p-8 transition hover:border-brand-fun hover:shadow-xl"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-fun shadow-sm">
              <UserX className="size-6" />
            </span>
            <h3 className="mt-6 text-2xl font-extrabold text-brand-navy">
              We don&apos;t have an IT department
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Work with us as your one-stop shop for IT management, support and
              technology solutions tailored to your business.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-blue">
              Contact us today
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </section>

      <section id="about" className="bg-surface py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="eyebrow">Our promise</p>
            <h2 className="section-title">IT should feel this simple.</h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            {[
              {
                number: "01",
                title: "We listen first",
                copy: "We learn how your team works, what matters and where technology is getting in the way.",
              },
              {
                number: "02",
                title: "We make a plan",
                copy: "You get clear priorities, honest recommendations and solutions that fit your business.",
              },
              {
                number: "03",
                title: "We take care of it",
                copy: "Our team handles the day-to-day details and keeps your technology healthy.",
              },
              {
                number: "04",
                title: "We keep improving",
                copy: "As your needs change, we help your systems, security and strategy evolve with you.",
              },
            ].map(({ number, title, copy }) => (
              <div key={number} className="border-t border-red-100 pt-5">
                <p className="text-sm font-extrabold text-brand-fun">{number}</p>
                <h3 className="mt-5 text-xl font-extrabold text-brand-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-brand-navy px-6 py-16 text-center text-white sm:px-12 lg:py-24">
          <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-brand-sky/25 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-fun text-white">
              <Stethoscope className="size-7" />
            </span>
            <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              Fix your tech &amp; get on with your life
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Don&apos;t let broken technology ruin your day. Book Orca IT and we&apos;ll
              help you get back up and running — fast.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
              >
                Book an appointment
              </Link>
              <a
                href="mailto:hello@orcait.com.au?subject=Free%20IT%20consultation"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 font-bold text-white transition hover:border-brand-sky hover:text-brand-sky"
              >
                <Mail className="size-5" />
                hello@orcait.com.au
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-red-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm leading-7 text-slate-600">
              Simple, secure and reliable technology for Australian businesses.
            </p>
          </div>
          <div>
            <p className="font-extrabold text-brand-navy">Services</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              {servicePageLinks.map((service) => (
                <Link key={service.href} href={service.href} className="hover:text-brand-blue">
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-extrabold text-brand-navy">Company</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link href="/why-orca-it" className="hover:text-brand-blue">
                Why Orca IT
              </Link>
              <Link href="/about" className="hover:text-brand-blue">
                About
              </Link>
            </div>
            <p className="mt-8 font-extrabold text-brand-navy">Let&apos;s talk</p>
            <a
              href="mailto:hello@orcait.com.au"
              className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:text-brand-navy"
            >
              hello@orcait.com.au
            </a>
          </div>
        </div>
        <div className="border-t border-red-100 px-5 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Orca IT. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
