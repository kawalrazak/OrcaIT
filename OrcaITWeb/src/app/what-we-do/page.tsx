import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageShell, slugifyTitle } from "@/components/marketing-page-shell";
import { serviceCategories } from "@/data/site-content";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Home IT support from Orca IT — PC repairs, Wi-Fi, virus removal, Mac support, data recovery and more.",
};

export default function WhatWeDoPage() {
  const homeSupport = serviceCategories.find((category) => category.id === "home-it-support");

  return (
    <MarketingPageShell
      eyebrow="What We Do"
      title="Practical IT help for your home."
      description="Friendly, clear support for the technology you use every day — remotely or at your place."
    >
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{homeSupport?.label ?? "Home IT Support"}</p>
            <h2 className="section-title">{homeSupport?.description}</h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeSupport?.services.map(({ icon: Icon, title, copy, accent }) => (
              <article
                key={title}
                id={slugifyTitle(title)}
                className="scroll-mt-28 rounded-[1.75rem] border border-red-100 bg-white p-7 shadow-sm"
              >
                <span className={`inline-flex rounded-2xl p-3 ${accent}`}>
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-extrabold text-brand-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/book-now"
              className="inline-flex items-center gap-2 font-bold text-brand-blue hover:text-brand-navy"
            >
              Book home support
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
