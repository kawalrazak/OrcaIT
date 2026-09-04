"use client";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";
import {
  formatBookingDate,
  formatCurrency,
  formatShortDay,
  formatShortMonthDay,
  getAvailableServices,
  getBookingDates,
  getStaffForSlot,
  getTimeSlotsForDate,
  isMelbournePostcode,
  type BookableService,
  type BookingStaff,
} from "@/data/book-now";

type Step = "postcode" | "service" | "datetime" | "address" | "details" | "confirmed";

const stepMeta: Record<
  Exclude<Step, "confirmed">,
  { label: string; title: string; trust: string }
> = {
  postcode: {
    label: "Location",
    title: "Where do you need help?",
    trust: "We’ll check which services are available near you.",
  },
  service: {
    label: "Service",
    title: "What do you need help with?",
    trust: "Choose the option that best fits your issue — we’ll confirm the details with you.",
  },
  datetime: {
    label: "Schedule",
    title: "When suits you best?",
    trust: "Pick a time that works for you. Same-day options may be available.",
  },
  address: {
    label: "Address",
    title: "Where should we attend?",
    trust: "Only needed for on-site visits so our technician can find you easily.",
  },
  details: {
    label: "Details",
    title: "Almost done — your contact details",
    trust: "We’ll use these to confirm your booking and keep you updated.",
  },
};

type BookingState = {
  postcode: string;
  service: BookableService | null;
  date: Date | null;
  time: string;
  staff: BookingStaff | null;
  unit: string;
  address: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  helpNeeded: string;
  discountCode: string;
};

const initialState: BookingState = {
  postcode: "",
  service: null,
  date: null,
  time: "",
  staff: null,
  unit: "",
  address: "",
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  helpNeeded: "",
  discountCode: "",
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function BookNowWizard() {
  const [step, setStep] = useState<Step>("postcode");
  const [weekStart, setWeekStart] = useState(0);
  const [booking, setBooking] = useState<BookingState>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailNote, setEmailNote] = useState<string | null>(null);

  const allDates = useMemo(() => getBookingDates(21), []);
  const visibleDates = allDates.slice(weekStart, weekStart + 7);

  function update<K extends keyof BookingState>(key: K, value: BookingState[K]) {
    setBooking((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function isRemoteService(service: BookableService | null) {
    return service?.id === "remote-45";
  }

  function goBack() {
    setError("");
    if (step === "service") setStep("postcode");
    else if (step === "datetime") setStep("service");
    else if (step === "address") setStep("datetime");
    else if (step === "details") setStep(isRemoteService(booking.service) ? "datetime" : "address");
  }

  function continueFromPostcode() {
    if (!/^\d{4}$/.test(booking.postcode.trim())) {
      setError("Please enter a valid 4-digit Australian postcode.");
      return;
    }
    update("service", null);
    setStep("service");
  }

  function continueFromService(service: BookableService) {
    if (service.melbourneOnly && !isMelbournePostcode(booking.postcode)) {
      setError(
        "On-site Home Support is only available in Melbourne. Please choose another service or enter a Melbourne postcode.",
      );
      return;
    }
    update("service", service);
    setStep("datetime");
  }

  function continueFromDateTime() {
    if (!booking.date || !booking.time || !booking.staff) {
      setError("Please select a date, time and technician.");
      return;
    }
    // Remote/online support does not need a physical address.
    if (isRemoteService(booking.service)) {
      update("unit", "");
      update("address", "");
      setStep("details");
      return;
    }
    setStep("address");
  }

  function continueFromAddress() {
    if (!booking.address.trim()) {
      setError("Please enter your street address, suburb and postcode.");
      return;
    }
    setStep("details");
  }

  async function submitBooking() {
    if (
      !booking.service ||
      !booking.date ||
      !booking.time ||
      !booking.staff ||
      !booking.firstName.trim() ||
      !booking.lastName.trim() ||
      !booking.email.trim() ||
      !booking.phone.trim() ||
      !booking.helpNeeded.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode: booking.postcode,
          serviceTitle: booking.service.title,
          servicePrice: booking.service.price,
          dateLabel: formatBookingDate(booking.date),
          time: booking.time,
          staffName: booking.staff.name,
          unit: isRemoteService(booking.service) ? "" : booking.unit,
          address: isRemoteService(booking.service)
            ? `Remote support — postcode ${booking.postcode}`
            : booking.address,
          firstName: booking.firstName,
          lastName: booking.lastName,
          company: booking.company,
          email: booking.email,
          phone: booking.phone,
          helpNeeded: booking.helpNeeded,
          discountCode: booking.discountCode,
          website: "",
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        emailSent?: boolean;
        emailNote?: string | null;
      };

      if (!response.ok) throw new Error(result.error || "Booking failed.");

      setEmailSent(Boolean(result.emailSent));
      setEmailNote(result.emailNote || null);
      setStep("confirmed");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not complete your booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetBooking() {
    setBooking(initialState);
    setWeekStart(0);
    setEmailSent(false);
    setEmailNote(null);
    setError("");
    setStep("postcode");
  }

  const selectedSlots =
    booking.date === null ? [] : getTimeSlotsForDate(booking.date);
  const availableServices = getAvailableServices(booking.postcode);

  const progressSteps = useMemo(() => {
    const steps: Exclude<Step, "confirmed">[] = [
      "postcode",
      "service",
      "datetime",
      ...(isRemoteService(booking.service) ? [] : (["address"] as const)),
      "details",
    ];
    return steps;
  }, [booking.service]);

  const activeStepIndex =
    step === "confirmed" ? progressSteps.length : progressSteps.indexOf(step as Exclude<Step, "confirmed">);
  const currentMeta = step !== "confirmed" ? stepMeta[step] : null;

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_24px_70px_-32px_rgba(6,69,143,0.5)]">
      {step !== "confirmed" ? (
        <div className="bg-gradient-to-br from-brand-navy via-brand-blue to-brand-ink px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <Image
              src="/orca-logo.png?v=5"
              alt="ORCA IT"
              width={220}
              height={112}
              className="h-10 w-auto object-contain sm:h-11"
              unoptimized
            />
            <a
              href={`tel:${ORCA_PHONE_TEL}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25"
            >
              <Phone className="size-3.5" />
              {ORCA_PHONE_DISPLAY}
            </a>
          </div>
          <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-[1.75rem]">
            Book online in minutes
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-blue-100">
            Trusted local IT support — clear pricing, friendly technicians, and{" "}
            <span className="font-semibold text-white">no solution, no fee</span>.
          </p>

          <ol className="mt-6 flex items-center gap-1.5" aria-label="Booking progress">
            {progressSteps.map((key, index) => {
              const done = index < activeStepIndex;
              const active = index === activeStepIndex;
              return (
                <li key={key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                  <span
                    className={`h-1.5 w-full rounded-full transition ${
                      done || active ? "bg-brand-sky" : "bg-white/25"
                    }`}
                  />
                  <span
                    className={`hidden text-[10px] font-bold uppercase tracking-wide sm:block ${
                      active ? "text-white" : "text-white/55"
                    }`}
                  >
                    {stepMeta[key].label}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs font-semibold text-brand-sky sm:hidden">
            Step {activeStepIndex + 1} of {progressSteps.length}: {currentMeta?.label}
          </p>
        </div>
      ) : null}

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {step === "postcode" ? (
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <ShieldCheck className="size-3.5" />
              Secure &amp; obligation-free
            </div>
            <h2 className="text-2xl font-extrabold text-brand-navy">{stepMeta.postcode.title}</h2>
            <p className="mt-2 text-slate-600">{stepMeta.postcode.trust}</p>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Your postcode <span className="text-brand-fun">*</span>
              </span>
              <span className="relative block">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={booking.postcode}
                  onChange={(event) =>
                    update("postcode", event.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  inputMode="numeric"
                  placeholder="e.g. 3000"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>
            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={continueFromPostcode}
              className="mt-6 w-full rounded-lg bg-brand-blue py-3.5 text-base font-bold text-white transition hover:bg-brand-navy"
            >
              Check availability
            </button>
            <p className="mt-4 text-center text-xs text-slate-500">
              Prefer to speak with someone?{" "}
              <a href={`tel:${ORCA_PHONE_TEL}`} className="font-bold text-brand-blue">
                Call {ORCA_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        ) : null}

        {step === "service" ? (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">{stepMeta.service.title}</h2>
            <p className="mt-2 text-slate-600">{stepMeta.service.trust}</p>
            {!isMelbournePostcode(booking.postcode) ? (
              <p className="mt-3 rounded-lg bg-brand-mist px-4 py-3 text-sm text-brand-navy">
                On-site Home Support is available in Melbourne. Remote support and other options
                are still available for {booking.postcode}.
              </p>
            ) : null}
            <div className="mt-6 space-y-3">
              {availableServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => continueFromService(service)}
                  className={`w-full rounded-xl border p-4 text-left transition hover:border-brand-blue hover:bg-brand-mist ${
                    booking.service?.id === service.id
                      ? "border-brand-blue bg-brand-mist"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-brand-navy">{service.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock3 className="size-4" />
                        {service.durationMinutes} min
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-brand-blue">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={goBack}
              className="mt-6 w-full rounded-lg bg-slate-100 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Back
            </button>
          </div>
        ) : null}

        {step === "datetime" ? (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">{stepMeta.datetime.title}</h2>
            <p className="mt-2 text-slate-600">{stepMeta.datetime.trust}</p>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous week"
                disabled={weekStart === 0}
                onClick={() => setWeekStart((value) => Math.max(0, value - 7))}
                className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="text-sm font-semibold text-slate-700">
                {formatShortMonthDay(visibleDates[0])} -{" "}
                {formatShortMonthDay(visibleDates[visibleDates.length - 1])},{" "}
                {visibleDates[0].getFullYear()}
              </p>
              <button
                type="button"
                aria-label="Next week"
                disabled={weekStart + 7 >= allDates.length}
                onClick={() =>
                  setWeekStart((value) => Math.min(allDates.length - 7, value + 7))
                }
                className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {visibleDates.map((date) => {
                const selected = booking.date ? sameDay(booking.date, date) : false;
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => {
                      update("date", date);
                      update("time", "");
                      update("staff", null);
                    }}
                    className={`min-w-[4.5rem] rounded-xl border px-3 py-3 text-center transition ${
                      selected
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-blue"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{formatShortDay(date)}</span>
                    <span className="mt-1 block text-sm font-bold">
                      {formatShortMonthDay(date)}
                    </span>
                  </button>
                );
              })}
            </div>

            {booking.date ? (
              <div className="mt-6">
                <h3 className="font-bold text-brand-navy">
                  Available Times for {formatBookingDate(booking.date)}
                </h3>

                {selectedSlots.length === 0 ? (
                  <div className="mt-8 flex flex-col items-center py-8 text-center">
                    <CalendarDays className="size-14 text-slate-300" />
                    <p className="mt-4 max-w-xs text-sm text-slate-500">
                      No available time slots for this date. Please select another day.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                    {selectedSlots.map((time) => {
                      const staffOptions = getStaffForSlot(booking.date!, time);
                      return (
                        <div
                          key={time}
                          className="rounded-xl border border-slate-200 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="inline-flex items-center gap-2 font-bold text-brand-navy">
                              <Clock3 className="size-4 text-brand-blue" />
                              {time}
                            </p>
                            <p className="text-sm text-slate-500">
                              {staffOptions.length} available
                            </p>
                          </div>
                          <div className="mt-3 space-y-2">
                            {staffOptions.map((person) => {
                              const selected =
                                booking.time === time && booking.staff?.id === person.id;
                              return (
                                <button
                                  key={`${time}-${person.id}`}
                                  type="button"
                                  onClick={() => {
                                    update("time", time);
                                    update("staff", person);
                                  }}
                                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition ${
                                    selected
                                      ? "border-brand-blue bg-brand-mist"
                                      : "border-slate-200 hover:border-brand-blue"
                                  }`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="grid size-9 place-items-center rounded-full bg-brand-navy text-xs font-bold text-white">
                                      {person.name.slice(0, 1)}
                                    </span>
                                    <span>
                                      <span className="block font-bold text-brand-navy">
                                        {person.name}
                                      </span>
                                      <span className="block text-xs text-slate-500">
                                        {person.role}
                                        {person.phone ? ` · ${person.phone}` : ""}
                                      </span>
                                    </span>
                                  </span>
                                  <span className="text-xs font-bold text-brand-blue">
                                    Click Here to Book
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

            <button
              type="button"
              onClick={continueFromDateTime}
              className="mt-6 w-full rounded-lg bg-brand-blue py-3.5 text-base font-bold text-white transition hover:bg-brand-navy"
            >
              Continue to next step
            </button>
            <button
              type="button"
              onClick={goBack}
              className="mt-3 w-full rounded-lg bg-slate-100 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Back
            </button>
          </div>
        ) : null}

        {step === "address" ? (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">{stepMeta.address.title}</h2>
            <p className="mt-2 text-slate-600">{stepMeta.address.trust}</p>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Unit / Apartment Number (Optional)
              </span>
              <input
                value={booking.unit}
                onChange={(event) => update("unit", event.target.value)}
                placeholder="e.g. 5, Unit 5, Apt 5"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Street Address, Suburb, Postcode <span className="text-brand-fun">*</span>
              </span>
              <span className="relative block">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={booking.address}
                  onChange={(event) => update("address", event.target.value)}
                  placeholder="e.g. 123 Smith Street, Brisbane, 4000"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>

            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

            <button
              type="button"
              onClick={continueFromAddress}
              className="mt-6 w-full rounded-lg bg-brand-blue py-3.5 text-base font-bold text-white transition hover:bg-brand-navy"
            >
              Continue to your details
            </button>
            <button
              type="button"
              onClick={goBack}
              className="mt-3 w-full rounded-lg bg-slate-100 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Back
            </button>
          </div>
        ) : null}

        {step === "details" ? (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">{stepMeta.details.title}</h2>
            <p className="mt-2 text-slate-600">{stepMeta.details.trust}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-brand-navy">
                  First Name <span className="text-brand-fun">*</span>
                </span>
                <span className="relative block">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={booking.firstName}
                    onChange={(event) => update("firstName", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-brand-navy">
                  Last Name <span className="text-brand-fun">*</span>
                </span>
                <span className="relative block">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={booking.lastName}
                    onChange={(event) => update("lastName", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </span>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Company Name (Optional)
              </span>
              <span className="relative block">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={booking.company}
                  onChange={(event) => update("company", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Email Address <span className="text-brand-fun">*</span>
              </span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={booking.email}
                  onChange={(event) => update("email", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Phone Number <span className="text-brand-fun">*</span>
              </span>
              <span className="relative block">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={booking.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                What do you need help with? <span className="text-brand-fun">*</span>
              </span>
              <textarea
                rows={4}
                value={booking.helpNeeded}
                onChange={(event) => update("helpNeeded", event.target.value)}
                placeholder="Tell us what's going wrong — the more detail, the faster we can help..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Discount Code (Optional)
              </span>
              <span className="relative block">
                <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={booking.discountCode}
                  onChange={(event) => update("discountCode", event.target.value)}
                  placeholder="Enter discount code..."
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Service Price</span>
                <span>{formatCurrency(booking.service?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-brand-navy">
                <span>Total (Inc. GST)</span>
                <span>{formatCurrency(booking.service?.price || 0)}</span>
              </div>
            </div>

            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void submitBooking()}
              className="mt-6 w-full rounded-lg bg-emerald-500 py-3.5 text-base font-bold text-white transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {isSubmitting ? "Confirming your booking..." : "Confirm booking"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              By booking, you agree we may contact you about this appointment.{" "}
              <span className="font-semibold text-brand-navy">No solution, no fee.</span>
            </p>
            <button
              type="button"
              onClick={goBack}
              className="mt-3 w-full rounded-lg bg-slate-100 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Back
            </button>
          </div>
        ) : null}

        {step === "confirmed" ? (
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-9" />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-brand-navy">You&apos;re booked in</h2>
            <p className="mt-3 text-slate-600">
              Thanks for choosing Orca IT. Your appointment is confirmed
              {emailSent
                ? ` and a confirmation email is on its way to ${booking.email}.`
                : ` — we&apos;ll also be in touch on ${booking.email}.`}
            </p>
            {!emailSent && emailNote ? (
              <p className="mt-2 text-xs text-slate-500">{emailNote}</p>
            ) : null}

            <div className="mt-6 rounded-xl bg-slate-50 p-5 text-left text-sm">
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-brand-navy">Service:</span>{" "}
                  {booking.service?.title}
                </p>
                <p>
                  <span className="font-bold text-brand-navy">Date:</span>{" "}
                  {booking.date ? formatBookingDate(booking.date) : ""}
                </p>
                <p>
                  <span className="font-bold text-brand-navy">Time:</span> {booking.time}
                </p>
                <p>
                  <span className="font-bold text-brand-navy">Technician:</span>{" "}
                  {booking.staff?.name}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-600">
              Questions before your visit? Call{" "}
              <a href={`tel:${ORCA_PHONE_TEL}`} className="font-bold text-brand-blue">
                {ORCA_PHONE_DISPLAY}
              </a>
            </p>

            <button
              type="button"
              onClick={resetBooking}
              className="mt-6 w-full rounded-lg bg-brand-blue py-3.5 text-base font-bold text-white transition hover:bg-brand-ink"
            >
              Book Another Appointment
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
