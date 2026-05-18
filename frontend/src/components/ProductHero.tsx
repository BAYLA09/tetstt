"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, Droplets, Flame, ShieldCheck, ShoppingCart, Wind } from "lucide-react";
import {
  Product,
  ProductOfferTier,
  money,
  productSnapshotForOfferTier,
  resolveDefaultOfferTier,
} from "@/lib/products";
import { PRODUCT_OFFER_ANCHOR_ID } from "@/lib/product-experience";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent } from "@/lib/events";
import { ProductStickyNav } from "@/components/ProductStickyNav";

function HeroMarketingBridge({
  block,
}: {
  block: NonNullable<Product["heroMarketingBridge"]>;
}) {
  const icons = [Droplets, Flame, Wind, ShieldCheck];

  return (
    <div
      className="rounded-[2rem] border border-[var(--border-gold)] bg-white px-4 py-6 shadow-[0_14px_50px_rgba(42,27,18,0.08)] sm:px-6 sm:py-7 md:px-8 md:py-8"
      dir="rtl"
    >
      <h2 className="text-right text-2xl font-black leading-snug text-[var(--emerald-950)] sm:text-3xl sm:leading-tight">
        {block.headline}
      </h2>
      <p className="mt-3 text-right text-[0.95rem] font-semibold leading-7 text-[var(--muted)] sm:mt-4 sm:text-base sm:leading-8">
        {block.body}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 md:grid-cols-4 md:gap-4">
        {block.pills.map(([title, sub], i) => {
          const Icon = icons[i] ?? Droplets;
          return (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl border border-[var(--border-gold)]/80 bg-[var(--cream-50)] px-3 py-4 text-center"
            >
              <p className="text-lg font-black leading-tight text-[var(--emerald-950)] sm:text-xl">{title}</p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-[var(--muted)] sm:text-xs">{sub}</p>
              <span className="mt-3 grid size-9 place-items-center rounded-full bg-[var(--emerald-950)] text-[var(--gold-300)]">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroMedia({ product, contained }: { product: Product; contained?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImageSrc = Boolean(product.image?.trim());
  const showImage = hasImageSrc && !imageFailed;
  const showCaption = product.heroMediaShowCaption !== false;
  const denseHero = !showCaption;
  const denseContain = denseHero && product.heroMediaObjectFit === "contain";
  const emptyDenseHero = denseHero && !showImage;
  const serveHeroUnmodified = product.heroMediaUnmodified === true;
  const containPad =
    denseContain && serveHeroUnmodified ? "p-1 sm:p-2 md:p-3" : denseContain ? "p-3 sm:p-6 md:p-8" : "";

  const frameClass = showImage
    ? `product-illustration has-product-image grid rounded-[2.5rem] ${
        denseHero
          ? "min-h-[min(92dvh,720px)] p-0 sm:p-1 lg:min-h-[640px] lg:p-2"
          : "min-h-[380px] p-6 lg:min-h-[620px]"
      } ${showCaption ? "place-items-end" : "place-items-stretch"} ${contained ? "" : "lg:mx-0"}`
    : emptyDenseHero
      ? `relative grid place-items-center rounded-[2.5rem] border border-dashed border-[var(--border-gold)]/70 bg-[var(--cream-50)] min-h-[min(92dvh,720px)] p-8 sm:p-10 lg:min-h-[640px] ${contained ? "" : "lg:mx-0"}`
      : `product-illustration grid rounded-[2.5rem] ${
          denseHero
            ? "min-h-[min(92dvh,720px)] p-0 sm:p-1 lg:min-h-[640px] lg:p-2"
            : "min-h-[380px] p-6 lg:min-h-[620px]"
        } ${showCaption ? "place-items-end" : "place-items-stretch"} ${contained ? "" : "lg:mx-0"}`;

  return (
    <div className={frameClass}>
      {showImage && serveHeroUnmodified ? (
        // eslint-disable-next-line @next/next/no-img-element -- merchant hero must bypass next/image recompression
        <img
          src={product.image!}
          alt={product.name}
          className={`absolute inset-0 z-0 h-full w-full ${
            denseContain
              ? `object-contain object-center ${containPad}`
              : denseHero
                ? "object-cover object-center"
                : "object-contain"
          } ${showCaption ? "p-4 md:p-8" : denseHero && !denseContain ? "p-0" : !denseHero ? "p-2 md:p-4" : ""}`}
          decoding="async"
          fetchPriority="high"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      {showImage && !serveHeroUnmodified ? (
        <Image
          src={product.image!}
          alt={product.name}
          fill
          className={`z-0 ${
            denseContain
              ? `object-contain object-center ${containPad}`
              : denseHero
                ? "object-cover object-center"
                : "object-contain"
          } ${showCaption ? "p-4 md:p-8" : denseHero && !denseContain ? "p-0" : !denseHero ? "p-2 md:p-4" : ""}`}
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      {emptyDenseHero ? <span className="sr-only">صورة المنتج غير معروضة بعد</span> : null}
      {showCaption ? (
        <div className="copy-quote copy-quote--inverse relative z-10 max-w-sm p-5 text-white shadow-2xl">
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
      ) : null}
    </div>
  );
}

function InsightStrip({ product }: { product: Product }) {
  const strip = product.insightStrip;
  if (!strip) return null;

  const hasImage = Boolean(strip.imageSrc?.trim());

  return (
    <section className="border-y border-[var(--border-gold)] bg-[var(--cream-50)] px-4 py-10">
      <div className="container-grid">
        {hasImage ? (
          <div className="relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-[var(--emerald-950)] shadow-lg ring-1 ring-black/10">
            <div className="relative aspect-[16/10] w-full md:aspect-[2/1]">
              <Image
                src={strip.imageSrc}
                alt={strip.headline}
                fill
                className="object-contain p-2 md:p-4"
                sizes="(max-width: 768px) 100vw, 1180px"
                loading="lazy"
              />
            </div>
          </div>
        ) : null}
        {strip.statPercent ? (
          <div className={`text-center ${hasImage ? "mt-5" : ""}`} dir="rtl">
            <p
              className="bg-gradient-to-l from-[var(--emerald-900)] to-[var(--emerald-950)] bg-clip-text text-5xl font-black leading-none tracking-tight text-transparent tabular-nums md:text-6xl"
              aria-label={`نسبة مذكورة: ${strip.statPercent}`}
            >
              {strip.statPercent}
            </p>
          </div>
        ) : null}
        <div
          className={`copy-quote mx-auto max-w-3xl text-center ${hasImage || strip.statPercent ? "mt-8" : ""}`}
          dir="rtl"
        >
          <p className="text-xs font-black tracking-[0.28em] text-[var(--gold-500)]">ليالي بيوتي · لمحات</p>
          <p className="mt-4 text-2xl font-black leading-snug text-[var(--emerald-950)] md:text-3xl">{strip.headline}</p>
          <p className="mx-auto mt-3 max-w-3xl text-sm font-semibold leading-8 text-[var(--muted)]">{strip.subline}</p>
        </div>
      </div>
    </section>
  );
}

function StoryGallerySection({ product }: { product: Product }) {
  const images = product.storyGallery;
  if (!images?.length) return null;

  return (
    <section className="border-t border-[var(--border-gold)] bg-white px-4 py-14">
      <div className="container-grid">
        <div className="grid gap-4 md:grid-cols-3" dir="ltr">
          {images.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-[var(--cream-50)] shadow-md ring-1 ring-[rgba(201,150,69,0.06)] transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full bg-[var(--cream-100)]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            </figure>
          ))}
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
  const showCommerceIntro = product.commerceShowIntro !== false;

  if (!tiers?.length) {
    return (
      <div
        id={PRODUCT_OFFER_ANCHOR_ID}
        dir="rtl"
        className="relative z-10 scroll-mt-28 rounded-[2rem] border border-gold-400/25 bg-emerald-950/72 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:p-8"
      >
        {!showCommerceIntro ? <h1 className="sr-only">{product.name}</h1> : null}
        {showCommerceIntro ? (
          <>
            <div className="copy-quote copy-quote--inverse mt-1">
              <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">{product.badge}</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-xl font-semibold leading-9 text-cream-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                {product.headline}
              </p>
            </div>
            <div className="mt-5 grid gap-2 rounded-2xl border border-gold-400/25 bg-white/10 p-4 text-sm font-bold text-cream-50 md:grid-cols-3">
              {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز لهذا الأسبوع"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-300" />
                  {item}
                </span>
              ))}
            </div>
          </>
        ) : null}
        <div className={`${showCommerceIntro ? "mt-8" : "mt-0"} rounded-[2rem] border border-gold-400/40 bg-black/22 p-5 shadow-inner`}>
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
      id={PRODUCT_OFFER_ANCHOR_ID}
      dir="rtl"
      className="relative z-10 scroll-mt-28 rounded-[2rem] border border-gold-400/25 bg-emerald-950/72 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:p-8"
    >
      {!showCommerceIntro ? <h1 className="sr-only">{product.name}</h1> : null}
      {showCommerceIntro ? (
        <>
          <div className="copy-quote copy-quote--inverse mt-1">
            <p className="badge border-gold-400/40 bg-gold-400/10 text-gold-300">{product.badge}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-xl font-semibold leading-9 text-cream-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              {product.headline}
            </p>
          </div>

          <div className="mt-5 grid gap-2 rounded-2xl border border-gold-400/25 bg-white/10 p-4 text-sm font-bold text-cream-50 md:grid-cols-3">
            {["تأكيد قبل الشحن", "الدفع عند الاستلام", "عرض محجوز لهذا الأسبوع"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-300" />
                {item}
              </span>
            ))}
          </div>
        </>
      ) : null}

      <div className={`${showCommerceIntro ? "mt-8" : "mt-0"} rounded-[2rem] border border-gold-400/50 bg-[var(--cream-50)] p-5 text-[var(--emerald-950)] shadow-inner`}>
        {product.heroPromoLine && (
          <p className="flex items-center justify-center gap-2 text-center text-xs font-bold text-amber-700 md:text-sm">
            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
            {product.heroPromoLine}
          </p>
        )}
        <p className="mt-3 text-center text-lg font-black text-[var(--emerald-950)]">اختاري عرضج — هنا يبدأ الطلب</p>
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
  const [selectedTier, setSelectedTier] = useState<ProductOfferTier | null>(() =>
    resolveDefaultOfferTier(product),
  );

  function addOffer(line: Product) {
    const eventId = generateEventId("add_to_cart");
    addItem(line);
    trackEvent("AddToCart", { eventId, sku: line.sku, value: line.price });
  }

  const storyFirst = product.storyBeforeCommerce === true;

  if (storyFirst) {
    const bridge = product.heroMarketingBridge;

    return (
      <>
        <section className="hero-gradient relative overflow-hidden px-4 pb-28 pt-6 lg:pb-32 lg:pt-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
          <div className="container-grid relative z-10" dir="ltr">
            {bridge ? (
              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-x-10 lg:gap-y-8">
                <div className="min-h-0 lg:col-start-2 lg:row-start-1">
                  <HeroMedia product={product} contained />
                </div>
                <div className="lg:col-start-2 lg:row-start-2">
                  <HeroMarketingBridge block={bridge} />
                </div>
                <div className="flex min-h-0 flex-col lg:col-start-1 lg:row-span-2 lg:row-start-1">
                  <CommercePanel
                    product={product}
                    selectedTier={selectedTier}
                    onTierChange={setSelectedTier}
                    onAdd={addOffer}
                  />
                </div>
              </div>
            ) : (
              <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="order-2 lg:order-1">
                  <CommercePanel
                    product={product}
                    selectedTier={selectedTier}
                    onTierChange={setSelectedTier}
                    onAdd={addOffer}
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <HeroMedia product={product} contained />
                </div>
              </div>
            )}
          </div>
        </section>
        <InsightStrip product={product} />
        <StoryGallerySection product={product} />
        <ProductStickyNav slug={product.slug} />
      </>
    );
  }

  return (
    <section className="hero-gradient relative overflow-hidden px-4 py-12 pb-28 text-white lg:py-20 lg:pb-32">
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
      <ProductStickyNav slug={product.slug} />
    </section>
  );
}
