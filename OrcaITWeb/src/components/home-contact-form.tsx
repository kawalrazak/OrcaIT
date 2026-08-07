"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function HomeContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/chat-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supportFor: "Home or Business",
          existingCustomer: "Not sure",
          name: String(data.get("name") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          email: String(data.get("email") || "").trim(),
          suburb: String(data.get("suburb") || "").trim(),
          issue: String(data.get("issue") || "").trim(),
          preferredContactTime: "ASAP",
          website: String(data.get("website") || ""),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 grid max-w-3xl gap-4 text-left">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="grid gap-2 text-sm font-bold text-brand-navy">
        Name*
        <input
          required
          name="name"
          className="rounded-xl border border-red-100 bg-white px-4 py-3 font-normal text-slate-800 outline-none ring-brand-fun focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-brand-navy">
        Email*
        <input
          required
          type="email"
          name="email"
          className="rounded-xl border border-red-100 bg-white px-4 py-3 font-normal text-slate-800 outline-none ring-brand-fun focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-brand-navy">
        Phone*
        <input
          required
          name="phone"
          className="rounded-xl border border-red-100 bg-white px-4 py-3 font-normal text-slate-800 outline-none ring-brand-fun focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-brand-navy">
        Suburb*
        <input
          required
          name="suburb"
          className="rounded-xl border border-red-100 bg-white px-4 py-3 font-normal text-slate-800 outline-none ring-brand-fun focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-brand-navy">
        How can we help?*
        <textarea
          required
          name="issue"
          rows={4}
          className="rounded-xl border border-red-100 bg-white px-4 py-3 font-normal text-slate-800 outline-none ring-brand-fun focus:ring-2"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-fun px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-red-600 disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Submit"}
      </button>

      {status === "sent" ? (
        <p className="text-sm font-semibold text-brand-navy">
          Thanks — our team will be in touch shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-semibold text-brand-fun">{error}</p>
      ) : null}
    </form>
  );
}
