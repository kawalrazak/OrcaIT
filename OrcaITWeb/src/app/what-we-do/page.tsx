import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageShell, slugifyTitle } from "@/components/marketing-page-shell";
import { homeServiceArticles } from "@/data/home-service-articles";
import { serviceCategories } from "@/data/site-content";

export const metadata: Metadata = {
  title: "What We Do | Home IT Support Services Australia",
  description:
    "Home IT support from Orca IT — desktop PC repairs, Wi-Fi setup, virus removal, Mac support, data recovery, Smart TV setup, broadband and remote help across Australia.",
  keywords: [
    "home IT support Australia",
    "computer repair",
    "Wi-Fi setup",
    "virus removal",
    "Mac repairs",
    "data recovery",
    "Orca IT",
  ],
};

function articleSlugForTitle(title: string) {
  const match = homeServiceArticles.find(
    (article) =>
      article.shortTitle.toLowerCase() === title.toLowerCase() ||
      slugifyTitle(article.shortTitle) === slugifyTitle(title),
  );
  return match?.slug ?? slugifyTitle(title);
}

export default function WhatWeDoPage() {
  const homeSupport = serviceCategories.find((category) => category.id === "home-it-support");

  return (
    <MarketingPageShell
      eyebrow="What We Do"
      title="Practical IT help for your home."
      description="Friendly, clear support for the technology you use every day — remotely or at your place. Read our service guides or book help online."
      heroImage="/orca-what-we-do-team.png"
      heroImageAlt="Orca IT support team smiling in the office with headsets"
      heroImagePosition="object-[center_35%]"
    >
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{homeSupport?.label ?? "Home IT Support"}</p>
            <h2 className="section-title">{homeSupport?.description}</h2>
            <p className="mt-5 leading-7 text-slate-600">
              Explore each service below for common problems, what’s included, FAQs and how to
              book. Every guide is written to help you find the right fix faster.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeSupport?.services.map(({ icon: Icon, title, copy, accent }) => {
              const slug = articleSlugForTitle(title);
              return (
                <Link
                  key={title}
                  href={`/what-we-do/${slug}`}
                  id={slugifyTitle(title)}
                  className="group scroll-mt-28 rounded-[1.75rem] border border-red-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-lg"
                >
                  <span className={`inline-flex rounded-2xl p-3 ${accent}`}>
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold text-brand-navy group-hover:text-brand-blue">
                    {title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">{copy}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-blue">
                    Read guide
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-12">
            <Link
              href="/book"
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
