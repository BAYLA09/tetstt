"use client";

import { PRODUCT_OFFER_ANCHOR_ID, getStickyCtaCopy } from "@/lib/product-experience";

export function ProductStickyNav({ slug }: { slug: string }) {
  const { supportingLine, buttonLabel } = getStickyCtaCopy(slug);

  function scrollToOffer() {
    const el = document.getElementById(PRODUCT_OFFER_ANCHOR_ID);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-gold)] bg-[var(--emerald-950)] px-3 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.22)]"
      role="region"
      aria-label="تثبيت الطلب"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 sm:px-2">
        <p className="flex-1 text-center text-xs font-bold leading-relaxed text-[var(--cream-100)] sm:text-right sm:text-sm">
          {supportingLine}
        </p>
        <button
          type="button"
          onClick={scrollToOffer}
          className="shrink-0 rounded-full bg-[var(--gold-500)] px-5 py-3.5 text-sm font-black text-[var(--emerald-950)] shadow-lg transition hover:bg-[var(--gold-400)] active:scale-[0.99]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
