"use client";

import { CheckCircle2 } from "lucide-react";
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
    <section className="hero-gradient relative overflow-hidden px-4 py-12 text-white lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
      <div className="container-grid grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div className="order-2 lg:order-1">
          <div className="placeholder-art min-h-[420px] rounded-[2.5rem]">
            <span>{product.shortName}</span>
          </div>
        </div>
        <div className="relative z-10 order-1 rounded-[2rem] border border-gold-400/25 bg-emerald-950/72 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:order-2 lg:p-8">
          <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">
            {product.badge}
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 text-xl font-semibold leading-9 text-cream-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {product.headline}
          </p>
          <div className="mt-5 grid gap-2 rounded-2xl border border-gold-400/25 bg-white/8 p-4 text-sm font-bold text-cream-50 md:grid-cols-3">
            {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز اليوم"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold-300" />
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-[2rem] border border-gold-400/40 bg-black/22 p-5 shadow-inner">
            <p className="text-sm text-gold-300">العرض الحالي</p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
            <p className="text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">{money(product.price)}</p>
              {product.compareAt && (
                <p className="text-lg text-cream-100/60 line-through">
                  {money(product.compareAt)}
                </p>
              )}
            </div>
            <p className="mt-3 text-sm font-semibold leading-7 text-cream-100">
              لا تدفعين الآن. نثبت طلبك ونتواصل معك للتأكيد قبل الشحن، باش توصلك التجربة كما شفتيها.
            </p>
          </div>
          <button onClick={addOffer} className="mt-6 w-full rounded-full bg-gold-500 px-8 py-5 text-lg font-black text-emerald-950 shadow-2xl transition hover:-translate-y-0.5 hover:bg-gold-400 md:w-auto">
            أضيفي العرض للسلة
          </button>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/30 bg-emerald-950/95 p-3 backdrop-blur lg:hidden">
        <button onClick={addOffer} className="w-full rounded-full bg-gold-500 px-5 py-4 font-black text-emerald-950">
          أضيفي العرض للسلة - 199 SAR
        </button>
      </div>
    </section>
  );
}
