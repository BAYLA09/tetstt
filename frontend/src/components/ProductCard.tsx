"use client";

import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { type Product, money } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent } from "@/lib/events";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAdd() {
    const eventId = generateEventId("add_to_cart");
    addItem(product);
    trackEvent("AddToCart", { eventId, sku: product.sku, value: product.price });
  }

  return (
    <article className="group flex flex-col rounded-[2rem] border border-[var(--border-gold)] bg-white shadow-[0_18px_60px_rgba(1,63,42,0.1)] transition hover:shadow-[0_28px_80px_rgba(1,63,42,0.18)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="placeholder-art h-64 rounded-t-[2rem] rounded-b-none transition group-hover:opacity-90">
          <span>{product.shortName}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--emerald-950)] px-3 py-1 text-xs font-bold text-[var(--gold-300)]">
            {product.badge}
          </span>
          <div className="flex text-[var(--gold-500)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xl font-bold text-[var(--emerald-950)] leading-snug hover:text-[var(--emerald-800)] transition">
            {product.name}
          </h3>
        </Link>

        <p className="flex-1 text-sm leading-7 text-[var(--muted)]">
          {product.subheading}
        </p>

        <div className="flex items-end justify-between pt-2 border-t border-[var(--border-gold)]">
          <div>
            {product.compareAt && (
              <p className="text-xs text-[var(--muted)] line-through">
                {money(product.compareAt)}
              </p>
            )}
            <p className="text-2xl font-bold text-[var(--emerald-950)]">
              {money(product.price)}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-full bg-[var(--gold-500)] px-4 py-2.5 text-sm font-bold text-[var(--emerald-950)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--gold-400)]"
          >
            <ShoppingBag size={14} />
            أضيفي
          </button>
        </div>
      </div>
    </article>
  );
}
