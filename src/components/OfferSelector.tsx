"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { OfferTier, CartItem, money } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent } from "@/lib/events";

type OfferSelectorProps = {
  tiers: OfferTier[];
  productName: string;
};

export function OfferSelector({ tiers, productName }: OfferSelectorProps) {
  const [selected, setSelected] = useState<string>(
    tiers.find((t) => t.highlight)?.sku ?? tiers[0].sku
  );
  const addItem = useCartStore((state) => state.addItem);

  const selectedTier = tiers.find((t) => t.sku === selected)!;

  function handleAdd() {
    const eventId = generateEventId("add_to_cart");
    const cartItem: CartItem = {
      sku: selectedTier.sku,
      name: `${productName} — ${selectedTier.label}`,
      price: selectedTier.price,
      quantity: 1,
    };
    addItem(cartItem);
    trackEvent("AddToCart", {
      eventId,
      sku: selectedTier.sku,
      value: selectedTier.price,
    });
  }

  return (
    <div className="space-y-3">
      {/* Tier radio buttons */}
      {tiers.map((tier) => {
        const isSelected = selected === tier.sku;
        return (
          <button
            key={tier.sku}
            type="button"
            onClick={() => setSelected(tier.sku)}
            className={[
              "relative w-full rounded-[1.5rem] border-2 p-4 text-right transition-all duration-200",
              isSelected
                ? "border-[var(--gold-500)] bg-[rgba(201,150,69,0.06)] shadow-[0_4px_24px_rgba(201,150,69,0.18)]"
                : "border-[var(--border-gold)] bg-white hover:border-[var(--gold-400)]",
            ].join(" ")}
          >
            {/* Badges */}
            {tier.badge && (
              <span
                className={[
                  "absolute right-4 top-0 -translate-y-1/2 rounded-full px-3 py-0.5 text-xs font-bold",
                  tier.highlight
                    ? "bg-[var(--gold-500)] text-[var(--emerald-950)]"
                    : "border border-[var(--border-gold)] bg-white text-[var(--gold-500)]",
                ].join(" ")}
              >
                {tier.badge}
              </span>
            )}

            <div className="flex items-center justify-between gap-4">
              {/* Radio indicator */}
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-[var(--gold-500)] bg-[var(--gold-500)]"
                    : "border-[var(--border-gold)] bg-white",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </span>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className={["font-bold leading-snug", isSelected ? "text-[var(--emerald-950)]" : "text-[var(--emerald-950)]"].join(" ")}>
                  {tier.label}
                </p>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{tier.sublabel}</p>
                {tier.savings && (
                  <p className="mt-1 text-xs font-bold text-emerald-700">{tier.savings}</p>
                )}
              </div>

              {/* Price */}
              <div className="shrink-0 text-left">
                {tier.compareAt && (
                  <p className="text-xs text-[var(--muted)] line-through text-left">
                    {money(tier.compareAt)}
                  </p>
                )}
                <p className={["text-xl font-bold", isSelected ? "text-[var(--emerald-950)]" : "text-[var(--muted)]"].join(" ")}>
                  {money(tier.price)}
                </p>
              </div>
            </div>
          </button>
        );
      })}

      {/* CTA Button */}
      <button
        onClick={handleAdd}
        className="mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--emerald-950)] px-8 py-5 text-lg font-bold text-[var(--gold-300)] shadow-2xl transition hover:-translate-y-0.5 hover:bg-[var(--emerald-800)]"
      >
        <ShoppingBag size={20} />
        أضيفي للسلة — {money(selectedTier.price)}
      </button>

      {/* Trust line */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[var(--gold-500)]" /> الدفع عند الاستلام</span>
        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[var(--gold-500)]" /> تأكيد قبل الشحن</span>
        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[var(--gold-500)]" /> توصيل 1-3 أيام</span>
      </div>
    </div>
  );
}
