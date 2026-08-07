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
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
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

  function goBack() {
    setError("");
    if (step === "service") setStep("postcode");
    else if (step === "datetime") setStep("service");
    else if (step === "address") setStep("datetime");
    else if (step === "details") setStep("address");
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
          unit: booking.unit,
          address: booking.address,
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

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-28px_rgba(6,69,143,0.45)]">
      {step !== "confirmed" ? (
        <div className="bg-gradient-to-r from-brand-blue to-brand-ink px-6 py-7 text-white sm:px-8">
          <Image
            src="/orca-logo.png?v=5"
            alt="ORCA IT"
            width={220}
            height={112}
            className="mb-4 h-10 w-auto object-contain sm:h-12"
            unoptimized
          />
          <h1 className="text-2xl font-black tracking-tight sm:text-[1.75rem]">
            Book Your Appointment
          </h1>
          <p className="mt-2 text-sm text-blue-100">
            Fast online booking — pick a service, date and technician
          </p>
        </div>
      ) : null}

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {step === "postcode" ? (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">Enter Your Postcode</h2>
            <p className="mt-2 text-slate-600">
              Enter your 4-digit postcode to check available services in your area
            </p>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-brand-navy">
                Postcode <span className="text-brand-fun">*</span>
              </span>
              <span className="relative block">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={booking.postcode}
                  onChange={(event) =>
                    update("postcode", event.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  inputMode="numeric"
                  placeholder="e.g., 4000"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </span>
            </label>
            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={continueFromPostcode}
              className="mt-6 w-full rounded-lg bg-[#7eb6f5] py-3.5 text-base font-bold text-white transition hover:bg-brand-blue"
            >
              Continue
            </button>
          </div>
        ) : null}

        {step === "service" ? (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">Select a Service</h2>
            <p className="mt-2 text-slate-600">Choose a service available in your area.</p>
            {!isMelbournePostcode(booking.postcode) ? (
              <p className="mt-3 rounded-lg bg-brand-mist px-4 py-3 text-sm text-brand-navy">
                On-site Home Support is only available for Melbourne postcodes. Remote and
                other services are still available for {booking.postcode}.
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
            <h2 className="text-2xl font-extrabold text-brand-navy">Choose Date &amp; Time</h2>
            <p className="mt-2 text-slate-600">Select a date and time for your appointment.</p>

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
              className="mt-6 w-full rounded-lg bg-[#7eb6f5] py-3.5 text-base font-bold text-white transition hover:bg-brand-blue"
            >
              Continue
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
            <h2 className="text-2xl font-extrabold text-brand-navy">Enter Your Address</h2>
            <p className="mt-2 text-slate-600">
              {booking.service?.id === "remote-45"
                ? "This is a remote support booking — we'll call you at the scheduled time. Please provide your billing address below."
                : "Please provide the address where our technician should attend."}
            </p>

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
              className="mt-6 w-full rounded-lg bg-[#7eb6f5] py-3.5 text-base font-bold text-white transition hover:bg-brand-blue"
            >
              Continue
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
            <h2 className="text-2xl font-extrabold text-brand-navy">Your Details</h2>
            <p className="mt-2 text-slate-600">
              Please provide your contact information to complete the booking.
            </p>

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
                placeholder="Please describe what you need help with..."
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
              {isSubmitting ? "Booking..." : "Book Now"}
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

        {step === "confirmed" ? (
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-9" />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-brand-navy">Booking Confirmed!</h2>
            <p className="mt-3 text-slate-600">
              Your appointment has been successfully booked.
              {emailSent
                ? ` A confirmation email has been sent to ${booking.email}.`
                : ` We'll also contact you on ${booking.email}.`}
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
                  <span className="font-bold text-brand-navy">Staff:</span>{" "}
                  {booking.staff?.name}
                </p>
              </div>
            </div>

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
