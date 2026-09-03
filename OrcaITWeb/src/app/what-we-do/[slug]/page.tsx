import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, ChevronLeft, Mail, Phone } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { ORCA_EMAIL, ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import {
  getHomeServiceArticle,
  getRelatedArticles,
  homeServiceArticles,
} from "@/data/home-service-articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return homeServiceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getHomeServiceArticle(slug);

  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `https://orcait.com.au/what-we-do/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://orcait.com.au/what-we-do/${article.slug}`,
      type: "article",
      locale: "en_AU",
      siteName: "Orca IT",
    },
  };
}

export default async function HomeServiceArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getHomeServiceArticle(slug);

  if (!article) notFound();

  const related = getRelatedArticles(slug);
  const moreServices = homeServiceArticles
    .filter((item) => item.slug !== slug)
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: article.title,
    description: article.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "Orca IT",
      url: "https://orcait.com.au",
      telephone: ORCA_PHONE_DISPLAY,
      areaServed: "Australia",
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    url: `https://orcait.com.au/what-we-do/${article.slug}`,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <MarketingPageShell
      eyebrow={article.eyebrow}
      title={article.title}
      description={article.hero}
      showHeroActions={false}
      showCta={false}
      showHeaderActions={false}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <article>
        <section className="border-b border-red-100 bg-white">
          <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-brand-blue">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/what-we-do" className="hover:text-brand-blue">
                What We Do
              </Link>
              <span className="mx-2">/</span>
              <span className="text-brand-navy">{article.shortTitle}</span>
            </nav>

            <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700">
              {article.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href={`tel:${ORCA_PHONE_TEL}`}
                className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-navy"
              >
                <Phone className="size-4" />
                Call {ORCA_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${ORCA_EMAIL}`}
                className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-navy"
              >
                <Mail className="size-4" />
                {ORCA_EMAIL}
              </a>
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              {article.servicesTitle}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {article.problems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-extrabold text-brand-navy">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              {article.coverageTitle}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700">
              {article.coverage.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
                {article.whyTitle}
              </h2>
              <ul className="mt-8 space-y-4">
                {article.why.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <Check className="mt-1 size-5 shrink-0 text-brand-fun" strokeWidth={3} />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
                {article.customerLoveTitle}
              </h2>
              <ol className="mt-8 space-y-4">
                {article.customerLove.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-4 rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
                  >
                    <span className="text-2xl font-black text-brand-fun">{index + 1}</span>
                    <span className="pt-1 font-semibold leading-7 text-brand-navy">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-brand-navy py-16 text-white lg:py-20">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {article.brandsTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-sky-50/90">{article.brandsCopy}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {article.brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
              {article.shortTitle} FAQs
            </h2>
            <div className="mt-8 space-y-4">
              {article.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-red-100 bg-surface p-6 open:bg-white open:shadow-sm"
                >
                  <summary className="cursor-pointer list-none text-xl font-extrabold text-brand-navy">
                    {faq.question}
                  </summary>
                  <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
              More home IT services
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Explore related guides from Orca IT for homes across Australia.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(related.length ? related : moreServices).map((item) => (
                <Link
                  key={item.slug}
                  href={`/what-we-do/${item.slug}`}
                  className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:border-brand-blue hover:shadow-md"
                >
                  <p className="font-extrabold text-brand-navy">{item.shortTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.hero.slice(0, 100)}…
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href="/what-we-do"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-navy"
            >
              <ChevronLeft className="size-4" />
              Back to What We Do
            </Link>
          </div>
        </section>

        <section className="border-t border-red-100 bg-white py-12">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 text-slate-700 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold text-brand-navy">
              Need help with {article.shortTitle.toLowerCase()}?
            </p>
            <div className="flex flex-wrap gap-5 text-sm font-bold">
              <a href={`tel:${ORCA_PHONE_TEL}`} className="text-brand-blue hover:text-brand-navy">
                Call {ORCA_PHONE_DISPLAY}
              </a>
              <a href={`mailto:${ORCA_EMAIL}`} className="text-brand-blue hover:text-brand-navy">
                Email {ORCA_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </article>
    </MarketingPageShell>
  );
}
