"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import {
  Product,
  ProductOfferTier,
  money,
  productSnapshotForOfferTier,
  resolveDefaultOfferTier,
} from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent } from "@/lib/events";

function HeroMedia({ product, contained }: { product: Product; contained?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(product.image) && !imageFailed;

  return (
    <div
      className={`product-illustration ${showImage ? "has-product-image" : ""} grid min-h-[360px] place-items-end rounded-[2.5rem] p-6 lg:min-h-[520px] ${
        contained ? "" : "lg:mx-0"
      }`}
    >
      {showImage && (
        <Image
          src={product.image!}
          alt={product.name}
          fill
          className="z-0 object-contain p-4 md:p-8"
          priority
          sizes="(max-width: 1024px) 100vw, 48vw"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="relative z-10 max-w-sm rounded-[1.7rem] border border-white/10 bg-black/20 p-5 text-white shadow-2xl backdrop-blur">
        <p className="text-sm font-black text-[var(--gold-300)]">ليالي بيوتي</p>
        <h2 className="mt-2 text-3xl font-black">{product.shortName}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--cream-100)]">{product.headline}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-[var(--gold-300)]">
          {product.notes.slice(0, 4).map((note) => (
            <span key={note} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-center">
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeAfterSection({ product }: { product: Product }) {
  const block = product.beforeAfterStory;
  if (!block) return null;

  const warmLeft = block.layout === "warm-left";
  const columns = warmLeft
    ? [
        { src: block.afterSrc, label: block.afterLabel },
        { src: block.beforeSrc, label: block.beforeLabel },
      ]
    : [
        { src: block.beforeSrc, label: block.beforeLabel },
        { src: block.afterSrc, label: block.afterLabel },
      ];

  return (
    <section className="bg-[var(--cream-50)] px-4 py-14">
      <div className="container-grid">
        <p className="badge">{block.kicker}</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-[var(--emerald-950)] md:text-4xl">
          {block.title}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-9 text-[var(--muted)]">{block.body}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2" dir="ltr">
          {columns.map((col) => (
            <figure
              key={`${col.src}-${col.label}`}
              className="overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-white shadow-sm"
            >
              <div className="product-illustration grid aspect-[4/3] w-full place-items-center p-6">
                <div className="relative z-10 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-center text-sm font-black text-white backdrop-blur">
                  {col.label}
                </div>
              </div>
              <figcaption className="px-3 py-2 text-center text-sm font-bold text-[var(--emerald-950)]">
                {col.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightStrip({ product }: { product: Product }) {
  const strip = product.insightStrip;
  if (!strip) return null;

  return (
    <section className="border-y border-[var(--border-gold)] bg-white px-4 py-12">
      <div className="relative mx-[calc(50%-50vw)] w-screen max-w-none px-0 lg:mx-auto lg:w-full lg:max-w-[1180px]">
        <div className="product-illustration grid min-h-[280px] place-items-center px-5 py-12 lg:rounded-2xl">
          <div className="relative z-10 max-w-3xl rounded-[2rem] border border-white/10 bg-black/20 p-6 text-center text-white backdrop-blur">
            <p className="text-sm font-black text-[var(--gold-300)]">رؤية ليالي</p>
            <p className="mt-3 text-2xl font-black leading-snug">{strip.headline}</p>
          </div>
        </div>
        <div className="container-grid pt-6">
          <p className="text-xl font-black leading-snug text-[var(--emerald-950)] md:text-2xl">{strip.headline}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{strip.subline}</p>
        </div>
      </div>
    </section>
  );
}

function CommercePanel({
  product,
  selectedTier,
  onTierChange,
  onAdd,
}: {
  product: Product;
  selectedTier: ProductOfferTier | null;
  onTierChange: (tier: ProductOfferTier) => void;
  onAdd: (line: Product) => void;
}) {
  const tiers = product.offerTiers;

  if (!tiers?.length) {
    return (
      <div
        dir="rtl"
        className="relative z-10 rounded-[2rem] border border-gold-400/25 bg-emerald-950/72 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:p-8"
      >
        <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">{product.badge}</p>
        <h1 className="mt-5 text-4xl font-black leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-5 text-xl font-semibold leading-9 text-cream-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          {product.headline}
        </p>
        <div className="mt-5 grid gap-2 rounded-2xl border border-gold-400/25 bg-white/10 p-4 text-sm font-bold text-cream-50 md:grid-cols-3">
          {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز لهذا الأسبوع"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-300" />
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-gold-400/40 bg-black/22 p-5 shadow-inner">
          <p className="text-sm text-gold-300">العرض الحالي</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <p className="text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              {money(product.price)}
            </p>
            {product.compareAt && (
              <p className="text-lg text-cream-100/60 line-through">{money(product.compareAt)}</p>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold leading-7 text-cream-100">
            ما فيه دفع إلكتروني مسبق. بنأكد طلبج بالاتصال قبل ما نجهز الشحن، عشان توصلج التجربة مثل ما اخترتيها على
            الموقع.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="mt-6 w-full rounded-full bg-gold-500 px-8 py-5 text-lg font-black text-emerald-950 shadow-2xl transition hover:-translate-y-0.5 hover:bg-gold-400 md:w-auto"
        >
          أضيفي العرض للسلة
        </button>
      </div>
    );
  }

  if (!selectedTier) {
    return null;
  }

  const line = productSnapshotForOfferTier(product, selectedTier);

  return (
    <div
      dir="rtl"
      className="relative z-10 rounded-[2rem] border border-gold-400/25 bg-emerald-950/72 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:p-8"
    >
      <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">{product.badge}</p>
      <h1 className="mt-5 text-4xl font-black leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-5 text-xl font-semibold leading-9 text-cream-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
        {product.headline}
      </p>

      <div className="mt-5 grid gap-2 rounded-2xl border border-gold-400/25 bg-white/10 p-4 text-sm font-bold text-cream-50 md:grid-cols-3">
        {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز لهذا الأسبوع"].map((item) => (
          <span key={item} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-300" />
            {item}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-gold-400/50 bg-[var(--cream-50)] p-5 text-[var(--emerald-950)] shadow-inner">
        {product.heroPromoLine && (
          <p className="flex items-center justify-center gap-2 text-center text-xs font-bold text-amber-700 md:text-sm">
            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
            {product.heroPromoLine}
          </p>
        )}
        <p className="mt-3 text-center text-lg font-black text-[var(--emerald-950)]">اختاري العرض:</p>
        <div className="mt-4 space-y-3" role="radiogroup" aria-label="اختيار العرض">
          {tiers.map((tier) => {
            const isOn = selectedTier.sku === tier.sku;
            const choiceBadge = tier.badge?.includes("اختيار");
            return (
              <div key={tier.sku}>
                {tier.eyebrow && (
                  <p className="mb-1 text-right text-xs font-bold text-amber-700">{tier.eyebrow}</p>
                )}
                <label
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
                    isOn
                      ? "border-amber-500 bg-white shadow-md ring-1 ring-amber-400/40"
                      : "border-transparent bg-white/80 hover:border-amber-200/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="offer-tier"
                    className="mt-1.5 h-4 w-4 shrink-0 accent-amber-600"
                    checked={isOn}
                    onChange={() => onTierChange(tier)}
                  />
                  <span className="min-w-0 flex-1 text-right">
                    {tier.badge && (
                      <span
                        className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          choiceBadge
                            ? "bg-amber-500 text-white"
                            : "bg-[var(--emerald-950)] text-[var(--gold-300)]"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    )}
                    <span className="block font-black text-[var(--emerald-950)]">{tier.title}</span>
                    <span className="mt-1 block text-sm leading-7 text-[var(--muted)]">{tier.description}</span>
                    {tier.saveLabel && (
                      <span className="mt-2 inline-block text-sm font-bold text-emerald-700">{tier.saveLabel}</span>
                    )}
                    <span className="mt-2 flex flex-wrap items-baseline justify-end gap-2">
                      {tier.compareAt != null && (
                        <span className="text-sm text-[var(--muted)] line-through">{money(tier.compareAt)}</span>
                      )}
                      <span className="text-2xl font-black text-[var(--emerald-950)]">{money(tier.price)}</span>
                    </span>
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAdd(line)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gold-400/60 bg-[var(--emerald-950)] px-6 py-5 text-lg font-black text-[var(--gold-300)] shadow-2xl transition hover:-translate-y-0.5 hover:bg-[var(--emerald-900)] md:w-auto md:min-w-[280px]"
      >
        <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
        أضيفي للسلة – {money(selectedTier.price)}
      </button>

      <div className="mt-5 grid gap-2 text-center text-xs font-bold text-cream-100/90 md:grid-cols-3 md:text-sm">
        {[
          ["الدفع عند الاستلام", "بدون دفع إلكتروني مسبق"],
          ["تأكيد قبل الشحن", "نتصل قبل ما نرسل الشحنة"],
          ["التوصيل خلال 1–3 أيام", "حسب المنطقة داخل الإمارات"],
        ].map(([t, s]) => (
          <div key={t} className="rounded-xl border border-white/10 bg-white/5 px-2 py-2">
            <p>{t}</p>
            <p className="mt-0.5 font-normal text-cream-100/70">{s}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold leading-7 text-cream-100">
        ما فيه دفع إلكتروني مسبق. بنأكد طلبج بالاتصال قبل ما نجهز الشحن، عشان توصلج التجربة مثل ما اخترتيها بهالصفحة.
      </p>
    </div>
  );
}

export function ProductHero({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const tiers = product.offerTiers;
  const [selectedTier, setSelectedTier] = useState<ProductOfferTier | null>(() =>
    resolveDefaultOfferTier(product),
  );

  function addOffer(line: Product) {
    const eventId = generateEventId("add_to_cart");
    addItem(line);
    trackEvent("AddToCart", { eventId, sku: line.sku, value: line.price });
  }

  const storyFirst = product.storyBeforeCommerce === true;
  const stickyLine =
    tiers?.length && selectedTier ? productSnapshotForOfferTier(product, selectedTier) : product;

  if (storyFirst) {
    return (
      <>
        <section className="hero-gradient relative overflow-hidden px-4 pb-10 pt-6 lg:pb-16 lg:pt-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
          <div className="container-grid relative z-10" dir="ltr">
            <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <HeroMedia product={product} contained />
              <CommercePanel
                product={product}
                selectedTier={selectedTier}
                onTierChange={setSelectedTier}
                onAdd={addOffer}
              />
            </div>
          </div>
        </section>
        <BeforeAfterSection product={product} />
        <InsightStrip product={product} />
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/30 bg-emerald-950/95 p-3 backdrop-blur lg:hidden">
          {tiers?.length && selectedTier ? (
            <div className="space-y-2">
              <select
                className="w-full rounded-xl border border-gold-500/40 bg-white/10 px-3 py-2 text-sm font-bold text-white"
                value={selectedTier.sku}
                onChange={(e) => {
                  const t = tiers.find((x) => x.sku === e.target.value);
                  if (t) setSelectedTier(t);
                }}
                aria-label="اختيار العرض"
              >
                {tiers.map((t) => (
                  <option key={t.sku} value={t.sku} className="text-emerald-950">
                    {t.title} — {money(t.price)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addOffer(productSnapshotForOfferTier(product, selectedTier))}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-4 font-black text-emerald-950"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden />
                أضيفي للسلة – {money(selectedTier.price)}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addOffer(product)}
              className="w-full rounded-full bg-gold-500 px-5 py-4 font-black text-emerald-950"
            >
              أضيفي العرض للسلة - {money(product.price)}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <section className="hero-gradient relative overflow-hidden px-4 py-12 pb-28 text-white lg:py-20 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
      <div className="container-grid grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]" dir="ltr">
        <div className="order-1 lg:order-1">
          <HeroMedia product={product} />
        </div>
        <div className="order-2 lg:order-2">
          <CommercePanel
            product={product}
            selectedTier={selectedTier}
            onTierChange={setSelectedTier}
            onAdd={addOffer}
          />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/30 bg-emerald-950/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => addOffer(stickyLine)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-4 font-black text-emerald-950"
        >
          {tiers?.length ? (
            <>
              <ShoppingCart className="h-5 w-5" aria-hidden />
              أضيفي للسلة – {money(stickyLine.price)}
            </>
          ) : (
            <>أضيفي العرض للسلة - {money(product.price)}</>
          )}
        </button>
      </div>
    </section>
  );
}
