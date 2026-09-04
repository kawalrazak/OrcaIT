"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Home,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import {
  getQuoteServicesByIds,
  quoteServices,
  type QuoteServiceMode,
} from "@/data/booking-quote";

type Step = "visit" | "services" | "details" | "done";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15";

export function BookingForm() {
  const [step, setStep] = useState<Step>("visit");
  const [visitMode, setVisitMode] = useState<QuoteServiceMode | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");
  const [offers, setOffers] = useState<"no" | "yes">("no");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const needsOnsite = visitMode === "onsite";
  const selectedServices = getQuoteServicesByIds(selectedIds);

  const filteredServices = useMemo(() => {
    if (!visitMode) return [];
    const query = search.trim().toLowerCase();
    return quoteServices.filter((service) => {
      if (service.mode !== visitMode) return false;
      if (!query) return true;
      return (
        service.label.toLowerCase().includes(query) ||
        (service.hint?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [search, visitMode]);

  function chooseVisitMode(mode: QuoteServiceMode) {
    setError("");
    setVisitMode(mode);
    setSelectedIds([]);
    setSearch("");
    setAddress("");
    setStep("services");
  }

  function toggleService(id: string) {
    setError("");
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function goToDetails() {
    if (!visitMode) {
      setError("Please choose Remote or On-site support first.");
      setStep("visit");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Please select at least one service to continue.");
      return;
    }
    setError("");
    setStep("details");
  }

  function submitDetails() {
    setError("");

    if (!visitMode) {
      setError("Please choose Remote or On-site support first.");
      setStep("visit");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setError("Please complete your name, email and phone number.");
      return;
    }

    if (needsOnsite && !address.trim()) {
      setError("Please enter your address for an on-site visit.");
      return;
    }

    const serviceLabels = selectedServices.map((service) => service.label).join(", ");
    const visitType = needsOnsite ? "On-site visit" : "Remote support";

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supportFor: `Booking quote — ${visitType}`,
            existingCustomer: "Not specified",
            name: `${firstName.trim()} ${lastName.trim()}`,
            phone: phone.trim(),
            email: email.trim(),
            suburb: needsOnsite
              ? address.trim()
              : "Remote support — no site visit required",
            issue: [
              `Visit type: ${visitType}`,
              `Services: ${serviceLabels}`,
              businessName.trim() ? `Business: ${businessName.trim()}` : null,
              notes.trim() ? `Notes: ${notes.trim()}` : null,
              `Special offers: ${offers === "yes" ? "Yes" : "No"}`,
            ]
              .filter(Boolean)
              .join("\n"),
            preferredContactTime: "Request a quote / call back",
            website: "",
          }),
        });

        if (!response.ok) {
          const result = (await response.json()) as { error?: string };
          throw new Error(result.error || "Could not submit booking.");
        }

        setStep("done");
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : `Could not submit. Please call ${ORCA_PHONE_DISPLAY}.`,
        );
      }
    });
  }

  function resetForm() {
    setStep("visit");
    setVisitMode(null);
    setSearch("");
    setSelectedIds([]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setBusinessName("");
    setNotes("");
    setOffers("no");
    setError("");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(12,88,172,0.45)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src="/orca-logo.png?v=5"
            alt="Orca IT"
            width={160}
            height={64}
            className="h-10 w-auto object-contain"
            unoptimized
          />
          <div className="inline-flex max-w-xl items-center gap-3 rounded-full bg-[#e8f2fc] px-4 py-2 text-sm text-brand-navy">
            <ShieldCheck className="size-5 shrink-0 text-brand-blue" />
            <span className="font-semibold leading-snug">
              Every job is backed by our{" "}
              <span className="font-extrabold">No solution, no fee</span> promise
            </span>
            <Link
              href="/why-orca-it"
              className="hidden shrink-0 rounded-full bg-brand-navy px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-ink sm:inline-flex"
            >
              Learn more
            </Link>
          </div>
        </div>
        <a
          href={`tel:${ORCA_PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-slate-100 px-4 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-slate-200 sm:self-auto"
        >
          <Phone className="size-4" />
          {ORCA_PHONE_DISPLAY}
        </a>
      </div>

      <div className="bg-brand-navy px-5 py-3.5 text-center text-sm font-semibold leading-6 text-white sm:px-7 sm:text-left">
        Request a quote today — friendly local technicians, clear pricing, and trusted support
        for homes and businesses.{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-brand-sky">
          Terms apply
        </Link>
        .
      </div>

      {step === "done" ? (
        <div className="px-5 py-14 text-center sm:px-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-9" />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy">
            Quote request received
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-600">
            Thanks {firstName.trim() || "there"} — we&apos;ve got your details and will be in
            touch shortly. Prefer to speak now? Call{" "}
            <a href={`tel:${ORCA_PHONE_TEL}`} className="font-bold text-brand-blue">
              {ORCA_PHONE_DISPLAY}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-8 inline-flex rounded-full bg-brand-navy px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-ink"
          >
            Submit another request
          </button>
        </div>
      ) : null}

      {step === "visit" ? (
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            How can we help?
          </h2>
          <p className="mt-2 text-slate-600">
            Choose remote or on-site support first — each path has its own form.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseVisitMode("remote")}
              className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <Laptop className="size-6" />
              </span>
              <span className="mt-4 block text-xl font-extrabold text-brand-navy">
                Remote only
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                We help online or by phone. No address needed — your internet must be active.
              </span>
            </button>

            <button
              type="button"
              onClick={() => chooseVisitMode("onsite")}
              className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-brand-blue hover:bg-brand-mist/60"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-sky-100 text-sky-800">
                <Home className="size-6" />
              </span>
              <span className="mt-4 block text-xl font-extrabold text-brand-navy">
                On-site visit
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                A technician comes to you. We&apos;ll ask for your address on the next steps.
              </span>
            </button>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === "services" ? (
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-blue">
                {visitMode === "remote" ? "Remote booking" : "On-site booking"}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
                Select services
              </h2>
              <p className="mt-2 text-slate-600">
                {visitMode === "remote"
                  ? "Showing remote services only — no site visit and no address later."
                  : "Showing on-site services only — we’ll ask for your address next."}
              </p>
            </div>
            {selectedIds.length > 0 ? (
              <p className="text-sm font-bold text-brand-navy">
                {selectedIds.length} selected
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseVisitMode("remote")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                visitMode === "remote"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Remote only
            </button>
            <button
              type="button"
              onClick={() => chooseVisitMode("onsite")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                visitMode === "onsite"
                  ? "bg-brand-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              On-site only
            </button>
          </div>

          <label className="relative mt-5 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a service"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15"
            />
          </label>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {filteredServices.map((service) => {
              const selected = selectedIds.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition ${
                    selected
                      ? "border-brand-navy bg-brand-mist shadow-sm"
                      : "border-slate-200 bg-white hover:border-brand-blue/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border ${
                      selected
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-brand-navy">{service.label}</span>
                    {service.hint ? (
                      <span className="mt-1 block text-xs font-semibold text-slate-500">
                        {service.hint}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredServices.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-500">
              No services match your search. Try another keyword.
            </p>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("visit");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={goToDetails}
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-ink"
            >
              Next
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      {step === "details" ? (
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-blue">
            {needsOnsite ? "On-site form" : "Remote form"}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Your details
          </h2>
          <p className="mt-2 text-slate-600">
            {needsOnsite
              ? "On-site booking — please include your address so our technician can attend."
              : "Remote booking — no site visit needed. We’ll contact you online or by phone."}
          </p>

          <div className="mt-6">
            <p className="text-sm font-bold text-brand-navy">Selected services</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedServices.map((service) => (
                <span
                  key={service.id}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700"
                >
                  <Check className="size-3.5 text-brand-navy" strokeWidth={3} />
                  {service.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="relative block">
              <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name (required)"
                className={fieldClass}
                autoComplete="given-name"
              />
            </label>
            <label className="relative block">
              <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name (required)"
                className={fieldClass}
                autoComplete="family-name"
              />
            </label>
            <label className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address (required)"
                className={fieldClass}
                autoComplete="email"
              />
            </label>
            <label className="relative block">
              <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number (required)"
                className={fieldClass}
                autoComplete="tel"
              />
            </label>

            {needsOnsite ? (
              <label className="relative block sm:col-span-2">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Address (required for on-site visits)"
                  className={fieldClass}
                  autoComplete="street-address"
                />
              </label>
            ) : (
              <div className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                Remote support selected — no address needed. Please keep your internet
                connection active for the session.
              </div>
            )}

            <label className="relative block sm:col-span-2">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Business name (optional)"
                className={fieldClass}
                autoComplete="organization"
              />
            </label>

            <label className="block sm:col-span-2">
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Tell us a little more about the work (optional)"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15"
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">
              Would you like tips and special offers from Orca IT? Unsubscribe anytime.
            </p>
            <div className="mt-3 flex gap-3">
              {(
                [
                  { id: "no", label: "No" },
                  { id: "yes", label: "Yes" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setOffers(option.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    offers === option.id
                      ? "border-brand-navy bg-brand-mist text-brand-navy"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`grid size-4 place-items-center rounded-full border ${
                      offers === option.id
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {offers === option.id ? <Check className="size-2.5" strokeWidth={3} /> : null}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("services");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={submitDetails}
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-ink disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit"}
              <Check className="size-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
