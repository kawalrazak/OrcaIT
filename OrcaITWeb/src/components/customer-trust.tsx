"use client";

import { useEffect, useId, useState } from "react";
import { Star, X } from "lucide-react";
import { allReviews, reviewStats, type CustomerReview } from "@/data/reviews";

function Stars({ className = "size-4" }: { className?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-400" aria-hidden>
      {[0, 1, 2, 3, 4].map((star) => (
        <Star key={star} className={`${className} fill-current`} />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Stars className="size-3.5" />
      <p className="mt-3 text-sm leading-6 text-slate-700">&ldquo;{review.quote}&rdquo;</p>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="font-extrabold text-brand-navy">{review.name}</p>
        <p className="text-xs text-slate-500">
          {review.place} · {review.service}
        </p>
      </div>
    </article>
  );
}

type ReviewsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ReviewsModal({ open, onClose }: ReviewsModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close reviews"
        className="absolute inset-0 bg-brand-ink/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[81] flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#f4f7fb] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">
              Customer reviews
            </p>
            <h2 id={titleId} className="mt-1 text-2xl font-extrabold text-brand-navy">
              {reviewStats.averageRating} / 5 from {reviewStats.totalReviews}+ reviews
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Stars />
              <span className="text-sm text-slate-500">{reviewStats.summary}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          {allReviews.map((review) => (
            <ReviewCard key={`${review.name}-${review.service}`} review={review} />
          ))}
          <p className="pb-2 text-center text-xs text-slate-500">
            Showing recent feedback from bookings, follow-ups and Google reviews.
          </p>
        </div>
      </div>
    </div>
  );
}

type ReviewRatingTriggerProps = {
  className?: string;
  labelClassName?: string;
  children?: React.ReactNode;
};

/** Clickable rating control that opens the reviews modal */
export function ReviewRatingTrigger({
  className = "",
  labelClassName = "",
  children,
}: ReviewRatingTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 text-left transition hover:opacity-90 ${className}`}
        aria-haspopup="dialog"
      >
        {children ?? (
          <>
            <Stars className="size-4 text-yellow-300" />
            <span className={labelClassName}>
              {reviewStats.averageRating}★ · View {reviewStats.totalReviews}+ reviews
            </span>
          </>
        )}
      </button>
      <ReviewsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

type CustomerTrustProps = {
  compact?: boolean;
};

export function CustomerTrust({ compact = false }: CustomerTrustProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="customer-reviews"
      className={
        compact
          ? "rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8"
          : "bg-[#eef4fb] px-5 py-14 lg:px-8 lg:py-20"
      }
      aria-labelledby="customer-trust-heading"
    >
      <div className={compact ? "" : "mx-auto max-w-6xl"}>
        <div
          className={`flex flex-col gap-6 ${
            compact ? "" : "lg:flex-row lg:items-end lg:justify-between"
          }`}
        >
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">
              What customers say
            </p>
            <h2
              id="customer-trust-heading"
              className={`mt-2 font-extrabold tracking-tight text-brand-navy ${
                compact ? "text-2xl" : "text-3xl sm:text-4xl"
              }`}
            >
              Real feedback from real people
            </h2>
            <p className="mt-3 text-slate-600">{reviewStats.summary}</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex flex-col rounded-2xl border border-blue-100 bg-brand-navy px-5 py-4 text-left text-white transition hover:bg-brand-ink sm:min-w-[220px]"
            aria-haspopup="dialog"
          >
            <div className="flex items-center gap-1 text-yellow-300">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-3xl font-black tracking-tight">
              {reviewStats.averageRating}
              <span className="text-lg font-bold text-white/70"> / 5</span>
            </p>
            <p className="mt-1 text-sm text-white/80">
              Based on {reviewStats.totalReviews}+ {reviewStats.label}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-brand-sky">
              Click to view reviews →
            </p>
          </button>
        </div>

        {!compact ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {allReviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex rounded-full bg-brand-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-ink"
              >
                View all {reviewStats.totalReviews}+ reviews
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 w-full rounded-xl border border-dashed border-brand-blue/40 bg-brand-mist/50 px-4 py-4 text-sm font-bold text-brand-navy transition hover:bg-brand-mist"
          >
            Click here to read customer reviews
          </button>
        )}
      </div>

      <ReviewsModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
