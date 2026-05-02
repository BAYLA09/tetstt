"use client";

import { Star } from "lucide-react";
import { Product, money } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent } from "@/lib/events";

export function ProductHero({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  function addOffer() {
    const eventId = generateEventId("add_to_cart");
    addItem(product);
    trackEvent("AddToCart", { eventId, sku: product.sku, value: product.price });
  }

  return (
    <section className="hero-gradient px-4 py-12 text-white lg:py-20">
      <div className="container-grid grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div className="order-2 lg:order-1">
          <div className="placeholder-art min-h-[420px] rounded-[2.5rem]">
            <span>{product.shortName}</span>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">
            {product.badge}
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 text-xl leading-9 text-cream-100/90">
            {product.headline}
          </p>
          <div className="mt-5 flex items-center gap-2 text-gold-300">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" />
            ))}
            <span className="text-sm text-cream-100">الأكثر اختياراً هذا الأسبوع</span>
          </div>
          <div className="mt-8 rounded-[2rem] border border-gold-400/30 bg-white/10 p-5">
            <p className="text-sm text-gold-300">العرض الحالي</p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <p className="text-4xl font-black">{money(product.price)}</p>
              {product.compareAt && (
                <p className="text-lg text-cream-100/60 line-through">
                  {money(product.compareAt)}
                </p>
              )}
            </div>
            <p className="mt-3 text-sm text-cream-100/75">
              الدفع عند الاستلام داخل الإمارات، وتأكيد قبل الشحن.
            </p>
          </div>
          <button onClick={addOffer} className="mt-6 w-full rounded-full bg-gold-500 px-8 py-5 text-lg font-black text-emerald-950 shadow-2xl transition hover:-translate-y-0.5 hover:bg-gold-400 md:w-auto">
            أضيفي العرض للسلة
          </button>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/30 bg-emerald-950/95 p-3 backdrop-blur lg:hidden">
        <button onClick={addOffer} className="w-full rounded-full bg-gold-500 px-5 py-4 font-black text-emerald-950">
          أضيفي العرض للسلة - {money(product.price)}
        </button>
      </div>
    </section>
  );
}
