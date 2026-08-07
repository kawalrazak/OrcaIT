import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Mail,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { servicePages } from "@/data/service-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getService(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <main className="overflow-hidden bg-white">
      <SiteHeader />

      <section className={`relative overflow-hidden bg-gradient-to-br ${service.gradient} px-5 py-20 text-white lg:px-8 lg:py-28`}>
        <div className="absolute -right-20 top-12 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-brand-sky/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <Link
              href="/business-it"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-sky-100/85 transition hover:text-white"
            >
              <ChevronLeft className="size-4" />
              Back to Business IT
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">
              <Sparkles className="size-4" />
              {service.eyebrow}
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50/90">
              {service.hero}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-7 py-4 font-black text-white shadow-xl shadow-red-900/25 transition hover:-translate-y-0.5 hover:bg-red-600"
              >
                Talk to Orca IT
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-4 font-bold transition hover:border-white/50 hover:bg-white/5"
              >
                View all services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-brand-navy">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-mist text-brand-navy">
                  <Icon className="size-7" />
                </span>
                <h2 className="mt-8 text-2xl font-extrabold tracking-tight">
                  {service.summary}
                </h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {service.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-brand-mist p-4">
                      <p className="text-2xl font-black text-brand-fun">{stat.value}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-navy/55">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="eyebrow">Solutions</p>
            <h2 className="section-title">{service.solutionsTitle}</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {service.solutions.map(({ title, copy, icon: SolutionIcon }) => (
              <article key={title} className="service-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-blue shadow-sm">
                  <SolutionIcon className="size-6" />
                </span>
                <h3 className="mt-7 text-xl font-extrabold tracking-tight text-brand-navy">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Benefits</p>
            <h2 className="section-title">Designed to make technology easier to manage.</h2>
            <p className="section-copy">
              Every service is shaped around practical outcomes: fewer surprises,
              clearer systems and better support for your team.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                <Check className="size-5 text-brand-fun" strokeWidth={3} />
                <p className="mt-4 font-bold leading-7 text-brand-navy">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy px-5 py-24 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sky">How we work</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              A clear path from idea to outcome.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {service.process.map((step, index) => (
              <article key={step.title} className="rounded-3xl border border-white/10 bg-white/10 p-7 backdrop-blur">
                <p className="text-sm font-black text-brand-sky">0{index + 1}</p>
                <h3 className="mt-6 text-xl font-extrabold">{step.title}</h3>
                <p className="mt-3 leading-7 text-sky-50/80">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-brand-mist p-8 text-center sm:p-12">
          <Mail className="mx-auto size-8 text-brand-fun" />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            Ready to improve your {service.shortTitle.toLowerCase()}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Tell us what you need and we’ll recommend the simplest, most practical next step.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-fun px-7 py-4 font-black text-white transition hover:bg-red-600"
          >
            Book an appointment
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
