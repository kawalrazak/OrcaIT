"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  PhoneCall,
} from "lucide-react";
import { ORCA_PHONE_DISPLAY, ORCA_PHONE_TEL } from "@/data/contact";

type ContactMethod = "call" | "chat" | "callback";

const inputClassName =
  "w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

export function BookingForm() {
  const [method, setMethod] = useState<ContactMethod>("callback");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (method === "call") {
      window.location.href = `tel:${ORCA_PHONE_TEL}`;
      return;
    }

    if (method === "chat") {
      window.dispatchEvent(new CustomEvent("orca-open-chat"));
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const address = String(data.get("address") || "").trim();
    const issue = String(data.get("issue") || "").trim();

    if (!fullName || !phone || !issue) {
      setError("Please complete your name, phone number and issue details.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supportFor: "Booking form",
            existingCustomer: "Not specified",
            name: fullName,
            phone,
            email: "Not provided",
            suburb: address || "Not provided",
            issue,
            preferredContactTime: "Request a call back",
            website: "",
          }),
        });

        if (!response.ok) {
          const result = (await response.json()) as { error?: string };
          throw new Error(result.error || "Could not save booking.");
        }

        setSubmitted(true);
        form.reset();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : `Could not submit. Please call ${ORCA_PHONE_DISPLAY}.`,
        );
      }
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-mist text-brand-blue">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-brand-navy">
          Request received
        </h3>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
          Thanks — your details have been saved and our team will call you soon. Prefer to
          speak now? Call{" "}
          <a href={`tel:${ORCA_PHONE_TEL}`} className="font-bold text-brand-blue">
            {ORCA_PHONE_DISPLAY}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 inline-flex rounded-md bg-brand-blue px-8 py-3.5 text-base font-bold text-white transition hover:bg-brand-ink"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-blue">
        Trusted and Secure
      </p>

      <div className="mt-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <span className="grid size-8 place-items-center rounded-full bg-slate-800 text-sm font-black text-white">
            1
          </span>
          <h3 className="text-xl font-bold text-slate-800">Service Needed Via:</h3>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setMethod("call")}
            className={`flex h-full flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
              method === "call"
                ? "border-brand-blue bg-brand-mist"
                : "border-slate-200 hover:border-brand-blue/50"
            }`}
          >
            <span className="grid size-11 place-items-center rounded-lg bg-brand-navy text-white">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="font-extrabold text-brand-navy">Call — {ORCA_PHONE_DISPLAY}</p>
              <p className="mt-1 text-sm text-slate-500">Call – Available Now – Free</p>
              <p className="mt-1 text-sm text-slate-500">Wait Time – Less than 1 Minute</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod("chat")}
            className={`flex h-full flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
              method === "chat"
                ? "border-brand-blue bg-brand-mist"
                : "border-slate-200 hover:border-brand-blue/50"
            }`}
          >
            <span className="grid size-11 place-items-center rounded-lg bg-brand-blue text-white">
              <MessageCircle className="size-5" />
            </span>
            <div>
              <p className="font-extrabold text-brand-navy">Chat 24x7 – Available Now</p>
              <p className="mt-1 text-sm text-slate-500">Chat with us</p>
              <p className="mt-1 text-sm text-slate-500">Wait Time – Less than 1 Minute</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod("callback")}
            className={`flex h-full flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
              method === "callback"
                ? "border-brand-blue bg-brand-mist"
                : "border-slate-200 hover:border-brand-blue/50"
            }`}
          >
            <span className="grid size-11 place-items-center rounded-lg bg-brand-fun text-white">
              <PhoneCall className="size-5" />
            </span>
            <div>
              <p className="font-extrabold text-brand-navy">Request a Call Back</p>
              <p className="mt-1 text-sm text-slate-500">Get an expert to call you back</p>
            </div>
          </button>
        </div>
      </div>

      {method === "callback" ? (
        <>
          <div className="mt-9">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <span className="grid size-8 place-items-center rounded-full bg-slate-800 text-sm font-black text-white">
                2
              </span>
              <h3 className="text-xl font-bold text-slate-800">Your Address (Optional)</h3>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Enter Your Address:
              </span>
              <input
                name="address"
                type="text"
                placeholder="Enter Your Address"
                className={inputClassName}
              />
            </label>
          </div>

          <div className="mt-9">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <span className="grid size-8 place-items-center rounded-full bg-slate-800 text-sm font-black text-white">
                3
              </span>
              <h3 className="text-xl font-bold text-slate-800">Your Contact Details</h3>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name:
                </span>
                <input
                  name="fullName"
                  required
                  type="text"
                  placeholder="Full Name"
                  className={inputClassName}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number:
                </span>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className={inputClassName}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Tell us about the issue you are facing:
                </span>
                <textarea
                  name="issue"
                  required
                  rows={5}
                  placeholder="Tell us about the issue you are facing"
                  className={inputClassName}
                />
              </label>
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isPending}
              className="min-w-44 rounded-md bg-[#31c4e8] px-10 py-3.5 text-lg font-bold text-white transition hover:bg-[#1fb5db] disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="min-w-44 rounded-md bg-[#31c4e8] px-10 py-3.5 text-lg font-bold text-white transition hover:bg-[#1fb5db]"
          >
            {method === "call" ? `Call ${ORCA_PHONE_DISPLAY}` : "Open Chat"}
          </button>
        </div>
      )}
    </form>
  );
}
