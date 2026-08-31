import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { slugifyTitle } from "@/components/marketing-page-shell";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import { servicePageLinks } from "@/data/service-pages";
import { serviceCategories } from "@/data/site-content";

const homeSupport = serviceCategories.find((category) => category.id === "home-it-support");

const homeSupportLinks = [
  { title: "Home IT Support", href: "/what-we-do" },
  ...(homeSupport?.services.map((service) => ({
    title: service.title,
    href: `/what-we-do#${slugifyTitle(service.title)}`,
  })) ?? []),
];

type SiteHeaderProps = {
  showActions?: boolean;
};

export function SiteHeader({ showActions = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-red-100/90 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" className="inline-flex items-center" aria-label="Orca IT home">
          <Image
            src="/orca-logo.png?v=5"
            alt="ORCA IT"
            width={440}
            height={223}
            className="h-20 w-auto object-contain sm:h-24"
            priority
            unoptimized
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-brand-navy/80 md:flex">
          <div className="group relative">
            <Link href="/what-we-do" className="flex items-center gap-1.5 hover:text-brand-fun">
              What We Do
              <ChevronDown className="size-4 transition group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 mt-4 max-h-[calc(100vh-9rem)] w-72 overflow-y-auto bg-brand-blue text-left opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
              {homeSupportLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block border-b border-white/40 px-4 py-3.5 font-bold hover:bg-brand-ink hover:text-yellow-300 ${
                    item.title === "Home IT Support" ? "text-yellow-300" : "text-white"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <Link href="/business-it" className="flex items-center gap-1.5 hover:text-brand-fun">
              Business IT
              <ChevronDown className="size-4 transition group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 mt-4 w-72 bg-brand-blue text-left opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
              <Link
                href="/business-it"
                className="block border-b border-white/40 px-4 py-3.5 font-bold text-yellow-300 hover:bg-brand-ink"
              >
                All Business IT
              </Link>
              {servicePageLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-b border-white/40 px-4 py-3.5 font-bold text-white hover:bg-brand-ink hover:text-yellow-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <Link className="hover:text-brand-fun" href="/why-orca-it">
            Why Orca IT
          </Link>
          <Link className="hover:text-brand-fun" href="/about">
            About
          </Link>
        </nav>
        {showActions ? (
          <div className="hidden items-center gap-4 md:flex">
            <a
              href={`tel:${ORCA_PHONE_TEL}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy transition hover:text-brand-fun"
            >
              <Phone className="size-4 text-brand-fun" />
              {ORCA_PHONE_DISPLAY}
            </a>
            <a
              href="/book"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-fun px-5 py-2.5 text-sm font-black text-white transition hover:bg-red-600"
            >
              Book Online
            </a>
          </div>
        ) : null}
        <details className="group relative md:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-red-200 text-brand-navy">
            <Menu className="size-5" />
          </summary>
          <nav className="absolute right-0 mt-3 flex max-h-[75vh] w-72 flex-col gap-1 overflow-y-auto rounded-2xl bg-white p-3 text-sm font-semibold text-brand-navy shadow-2xl">
            <Link className="rounded-lg px-3 py-2 hover:bg-brand-mist" href="/what-we-do">
              What We Do
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-brand-mist" href="/business-it">
              Business IT
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-brand-mist" href="/why-orca-it">
              Why Orca IT
            </Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-brand-mist" href="/about">
              About
            </Link>
            <p className="mt-2 border-t border-blue-100 px-3 pb-1 pt-4 text-xs font-black uppercase tracking-wider text-brand-fun">
              Home support
            </p>
            {homeSupportLinks.slice(1).map((item) => (
              <Link
                key={item.title}
                className="rounded-lg px-3 py-2 hover:bg-brand-mist"
                href={item.href}
              >
                {item.title}
              </Link>
            ))}
            <p className="mt-2 border-t border-blue-100 px-3 pb-1 pt-4 text-xs font-black uppercase tracking-wider text-brand-fun">
              Business IT
            </p>
            {servicePageLinks.map((item) => (
              <Link key={item.href} className="rounded-lg px-3 py-2 hover:bg-brand-mist" href={item.href}>
                {item.title}
              </Link>
            ))}
            {showActions ? (
              <>
                <a className="rounded-lg px-3 py-2 hover:bg-brand-mist" href={`tel:${ORCA_PHONE_TEL}`}>
                  Call {ORCA_PHONE_DISPLAY}
                </a>
                <a
                  className="rounded-lg px-3 py-2 hover:bg-brand-mist"
                  href="/book"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Online
                </a>
              </>
            ) : null}
          </nav>
        </details>
      </div>
    </header>
  );
}
