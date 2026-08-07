import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { servicePages } from "@/data/service-pages";
import { serviceCategories } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Business IT",
  description:
    "Managed IT, software, CRM, cloud, websites and digital marketing for Australian businesses.",
};

export default function BusinessItPage() {
  const businessCategories = serviceCategories.filter(
    (category) => category.id !== "home-it-support",
  );

  return (
    <MarketingPageShell
      eyebrow="Business IT"
      title="Technology that keeps your business moving."
      description="From managed support to custom software and cloud — practical solutions built for Australian teams."
      heroImage="/orca-business-it-team.png"
      heroImageAlt="Orca IT business team standing together in the office"
      heroImagePosition="object-[center_40%]"
    >
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Our business services</p>
            <h2 className="section-title">Choose the capability your team needs next.</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {servicePages.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group rounded-[1.75rem] border border-red-100 bg-surface p-7 transition hover:-translate-y-1 hover:border-brand-fun hover:shadow-xl"
                >
                  <span className="inline-flex rounded-2xl bg-brand-mist p-3 text-brand-navy">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold text-brand-navy">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">{service.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-blue">
                    View details
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-mist/40 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">How we cover your stack</p>
            <h2 className="section-title">Support across every part of your technology.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {businessCategories.map((category) => (
              <article
                key={category.id}
                className="rounded-[1.75rem] border border-red-100 bg-white p-7"
              >
                <h3 className="text-xl font-extrabold text-brand-navy">{category.label}</h3>
                <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
                <ul className="mt-6 space-y-2">
                  {category.services.slice(0, 5).map((service) => (
                    <li key={service.title} className="text-sm font-semibold text-brand-navy/80">
                      • {service.title}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
