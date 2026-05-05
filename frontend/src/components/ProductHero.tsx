"use client";

import Image from "next/image";
import { CheckCircle2, ShoppingBag } from "lucide-react";
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

        {/* Product image */}
        <div className="order-2 lg:order-1">
          <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-[rgba(201,150,69,0.3)] shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Subtle gradient overlay at bottom for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(1,30,20,0.6)] to-transparent" />
          </div>
        </div>

        {/* Product details card */}
        <div className="relative z-10 order-1 rounded-[2rem] border border-[rgba(201,150,69,0.25)] bg-[rgba(1,63,42,0.72)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:order-2 lg:p-8">
          <span className="badge border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
            {product.badge}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--cream-100)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {product.headline}
          </p>

          {/* Trust chips */}
          <div className="mt-5 grid gap-2 rounded-2xl border border-[rgba(201,150,69,0.25)] bg-white/8 p-4 text-sm font-semibold text-[var(--cream-50)] md:grid-cols-3">
            {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز اليوم"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--gold-300)]" />
                {item}
              </span>
            ))}
          </div>

          {/* Price block */}
          <div className="mt-6 rounded-[2rem] border border-[rgba(201,150,69,0.4)] bg-black/22 p-5 shadow-inner">
            <p className="text-xs font-bold tracking-widest text-[var(--gold-300)] uppercase">العرض الحالي</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <p className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                {money(product.price)}
              </p>
              {product.compareAt && (
                <p className="text-lg text-[var(--cream-100)]/60 line-through">
                  {money(product.compareAt)}
                </p>
              )}
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--cream-100)]">
              لا تدفعين الآن. نثبت طلبك ونتواصل معك للتأكيد قبل الشحن.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={addOffer}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--gold-500)] px-8 py-5 text-lg font-bold text-[var(--emerald-950)] shadow-2xl transition hover:-translate-y-0.5 hover:bg-[var(--gold-400)] md:w-auto"
          >
            <ShoppingBag size={20} />
            أضيفي العرض للسلة
          </button>

          <p className="mt-3 text-center text-xs text-[var(--cream-100)]/50 md:text-right">
            يتم التأكيد عبر الهاتف قبل الشحن
          </p>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(201,150,69,0.3)] bg-[rgba(1,63,42,0.95)] p-3 backdrop-blur lg:hidden">
        <button
          onClick={addOffer}
          className="w-full rounded-full bg-[var(--gold-500)] px-5 py-4 font-bold text-[var(--emerald-950)]"
        >
          أضيفي العرض للسلة — {money(product.price)}
        </button>
      </div>
    </section>
  );
}
