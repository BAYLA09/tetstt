"use client";

import Image from "next/image";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Product, OfferTier, money } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent } from "@/lib/events";
import { OfferSelector } from "./OfferSelector";

type ProductHeroProps = {
  product: Product;
  tiers?: OfferTier[];
  /** `commerceOnly` = buy card only (story media rendered above on the page). */
  variant?: "default" | "commerceOnly";
};

function HeroImageBlock({ product }: { product: Product }) {
  const panorama = product.heroPanorama === true;

  const frameClass = panorama
    ? "relative w-screen max-w-none shrink-0 bg-[rgba(0,20,14,0.35)] mx-[calc(50%-50vw)] min-h-[280px] lg:mx-0 lg:w-full lg:rounded-[2.5rem] lg:bg-transparent"
    : "relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-[rgba(201,150,69,0.3)] shadow-[0_40px_100px_rgba(0,0,0,0.45)]";

  return (
    <div className={frameClass}>
      {panorama ? (
        <Image
          src={product.image}
          alt={product.name}
          width={1536}
          height={1024}
          className="h-auto w-full object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      )}
      {!panorama && (
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(1,30,20,0.6)] to-transparent" />
      )}
    </div>
  );
}

export function ProductHero({ product, tiers, variant = "default" }: ProductHeroProps) {
  const addItem = useCartStore((state) => state.addItem);

  function addOffer() {
    const eventId = generateEventId("add_to_cart");
    addItem(product);
    trackEvent("AddToCart", { eventId, sku: product.sku, value: product.price });
  }

  const commerceCard = (
    <div className="relative z-10 rounded-[2rem] border border-[rgba(201,150,69,0.25)] bg-[rgba(1,63,42,0.72)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:p-8">
      <span className="badge border-[rgba(201,150,69,0.4)] bg-[rgba(201,150,69,0.1)] text-[var(--gold-300)]">
        {product.badge}
      </span>

      <h1 className="mt-5 text-4xl font-bold leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-5xl">
        {product.name}
      </h1>

      <p className="mt-4 text-lg leading-8 text-[var(--cream-100)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        {product.headline}
      </p>

      {tiers && tiers.length > 0 ? (
        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-[var(--border-gold)] bg-[var(--cream-50)] px-3 py-1.5 text-xs font-bold text-[var(--gold-500)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--gold-500)]" />
            آخر 48 ساعة على عرض الشحن المجاني هذا الأسبوع
          </div>
          <p className="mb-3 text-sm font-bold text-[var(--emerald-950)]">اختاري العرض:</p>
          <OfferSelector tiers={tiers} productName={product.name} />
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-2 rounded-2xl border border-[rgba(201,150,69,0.25)] bg-white/8 p-4 text-sm font-semibold text-[var(--cream-50)] md:grid-cols-3">
            {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز اليوم"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--gold-300)]" />
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-[2rem] border border-[rgba(201,150,69,0.4)] bg-black/22 p-5 shadow-inner">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold-300)]">العرض الحالي</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <p className="text-4xl font-bold text-white">{money(product.price)}</p>
              {product.compareAt && (
                <p className="text-lg text-[var(--cream-100)]/60 line-through">{money(product.compareAt)}</p>
              )}
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--cream-100)]">
              لا تدفعين الآن. نثبت طلبك ونتواصل معك للتأكيد قبل الشحن.
            </p>
          </div>
          <button
            type="button"
            onClick={addOffer}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--gold-500)] px-8 py-5 text-lg font-bold text-[var(--emerald-950)] shadow-2xl transition hover:-translate-y-0.5 hover:bg-[var(--gold-400)] md:w-auto"
          >
            <ShoppingBag size={20} />
            أضيفي العرض للسلة
          </button>
        </>
      )}
    </div>
  );

  if (variant === "commerceOnly") {
    return (
      <section className="hero-gradient relative overflow-hidden px-4 pb-28 pt-8 text-white lg:pb-16 lg:pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
        <div className="container-grid relative z-10 max-w-2xl">{commerceCard}</div>
      </section>
    );
  }

  return (
    <section className="hero-gradient relative overflow-hidden px-4 py-12 pb-28 text-white lg:py-20 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
      <div className="container-grid grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div className="order-1 lg:order-1">
          <HeroImageBlock product={product} />
        </div>
        <div className="order-2 lg:order-2">{commerceCard}</div>
      </div>

      {!tiers && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(201,150,69,0.3)] bg-[rgba(1,63,42,0.95)] p-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={addOffer}
            className="w-full rounded-full bg-[var(--gold-500)] px-5 py-4 font-bold text-[var(--emerald-950)]"
          >
            أضيفي العرض للسلة — {money(product.price)}
          </button>
        </div>
      )}
    </section>
  );
}
