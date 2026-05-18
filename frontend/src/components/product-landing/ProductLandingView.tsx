"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  BadgeCheck,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Package,
  Shield,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { businessConfig } from "@/config/business";
import type { LandingOffer, LandingProduct } from "@/config/landing-types";
import { getLandingProduct } from "@/config/products";
import { formatPrice } from "@/lib/format-price";
import { getProduct } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { generateEventId, trackEvent, trackAddToCart } from "@/lib/events";
import { PremiumImage, PremiumPlaceholder } from "./PremiumImage";

/** When all three URLs are set: stacked hero in order — before/after, lifestyle portrait, product bottle. */
function HeroTopMedia({ product }: { product: LandingProduct }) {
  const strip1 = product.images.heroBeforeAfter?.trim();
  const strip2 = product.images.lifestyleImage?.trim();
  const strip3 = product.images.heroProduct?.trim();
  if (strip1 && strip2 && strip3) {
    return (
      <div className="space-y-3 bg-[var(--lp-bg)] p-3">
        <PremiumImage
          src={strip1}
          alt={product.imageAlts.heroBeforeAfter}
          priority
          objectFit="contain"
          className="rounded-[1.25rem] border border-[var(--lp-border)]/70 shadow-sm"
        />
        <div className="relative mx-auto aspect-[4/5] w-full max-h-[min(72vh,560px)] max-w-md overflow-hidden rounded-[1.25rem] border border-[var(--lp-border)]/70 bg-[var(--lp-bg)] shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- same /public raster rule as PremiumImage */}
          <img
            src={strip2}
            alt={product.imageAlts.lifestyleImage}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex justify-center px-1 pb-1">
          <div className="w-full max-w-[min(100%,360px)]">
            <PremiumImage
              src={strip3}
              alt={product.imageAlts.heroProduct}
              objectFit="contain"
              className="rounded-[1.25rem] border border-[var(--lp-border)]/70 shadow-sm"
            />
          </div>
        </div>
      </div>
    );
  }
  if (strip1) {
    return (
      <PremiumImage
        src={strip1}
        alt={product.imageAlts.heroBeforeAfter}
        priority
        objectFit="contain"
      />
    );
  }
  return (
    <div className="grid gap-2 bg-[var(--lp-bg)] p-3 sm:grid-cols-2">
      <PremiumPlaceholder alt={product.imageAlts.heroBeforeAfter} caption="قبل — إحساس الجفاف مع المكيف" />
      <PremiumPlaceholder alt={product.imageAlts.heroBeforeAfter} caption="بعد — روتين أوضح مع الاستمرار" />
      <div className="relative z-[1] -mt-8 flex justify-center sm:col-span-2">
        <div className="w-[55%] max-w-[220px] rounded-2xl border-2 border-[var(--lp-accent)] bg-[var(--lp-card)] p-3 shadow-xl">
          {strip3 ? (
            <Image
              src={strip3}
              alt={product.imageAlts.heroProduct}
              width={400}
              height={520}
              className="h-auto w-full object-contain"
            />
          ) : (
            <PremiumPlaceholder alt={product.imageAlts.heroProduct} caption={product.shortName} className="aspect-square" />
          )}
        </div>
      </div>
    </div>
  );
}

function themeStyle() {
  const d = businessConfig.design;
  return {
    ["--lp-primary" as string]: d.primaryColor,
    ["--lp-primary-dark" as string]: d.primaryDarkColor,
    ["--lp-accent" as string]: d.accentColor,
    ["--lp-bg" as string]: d.backgroundColor,
    ["--lp-card" as string]: d.cardColor,
    ["--lp-text" as string]: d.textColor,
    ["--lp-muted" as string]: d.mutedTextColor,
    ["--lp-border" as string]: d.borderColor,
  } as React.CSSProperties;
}

function pickDefaultOffer(offers: LandingOffer[]): LandingOffer {
  const def = offers.find((o) => o.defaultSelected);
  if (def) return def;
  if (offers.length >= 2) return offers[1]!;
  return offers[0]!;
}

function normalizeIngredient(
  raw: string | { name: string; dosage?: string; benefit: string; proof: string },
): { name: string; dosage?: string; benefit: string; proof: string } {
  if (typeof raw === "string") {
    return { name: raw, benefit: "", proof: "" };
  }
  return raw;
}

export function ProductLandingView({ product }: { product: LandingProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const setPendingUpsellOffer = useCartStore((s) => s.setPendingUpsellOffer);
  const [selectedId, setSelectedId] = useState(() => pickDefaultOffer(product.offers).id);
  const selected = useMemo(
    () => product.offers.find((o) => o.id === selectedId) ?? pickDefaultOffer(product.offers),
    [product.offers, selectedId],
  );
  const minPrice = useMemo(() => Math.min(...product.offers.map((o) => o.price)), [product.offers]);
  const b = businessConfig;

  useEffect(() => {
    trackEvent("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      value: minPrice,
      currency: b.market.currency,
    });
  }, [product.id, product.name, minPrice, b.market.currency]);

  const addOfferToCart = useCallback(() => {
    const lineName = `${product.name} — ${selected.label}`;
    addItem({ sku: selected.sku, name: lineName, price: selected.price }, selected.quantity);
    if (product.upsell.enabled) {
      setPendingUpsellOffer({
        enabled: true,
        sku: product.upsell.sku,
        name: product.upsell.name,
        price: product.upsell.price,
        label: product.upsell.label,
        subtitle: product.upsell.subtitle,
      });
    } else {
      setPendingUpsellOffer(null);
    }
    const eventId = generateEventId("add_to_cart");
    trackAddToCart({ sku: selected.sku, name: lineName, price: selected.price, quantity: selected.quantity }, eventId, b.market.currency);
    openCart();
  }, [addItem, openCart, product, selected, setPendingUpsellOffer, b.market.currency]);

  const ctaLabel = `ابدئي ${product.shortName} الحين · ${formatPrice(selected.price, b)}`;

  const related = product.relatedSlugs
    .map((slug) => getLandingProduct(slug))
    .filter((p): p is LandingProduct => Boolean(p))
    .slice(0, 4);

  const ingredients = product.ingredientStack.map(normalizeIngredient);

  return (
    <div className="product-landing-root pb-28" style={themeStyle()}>
      <div className="border-b bg-[var(--lp-primary)] px-4 py-2 text-center text-xs font-bold text-white sm:text-sm">
        <span className="inline-flex items-center justify-center gap-2">
          <Truck className="size-4 shrink-0 text-[var(--lp-accent)]" aria-hidden />
          {b.cod.paymentLabel} · {b.cod.deliveryPromise}
        </span>
      </div>

      <section className="bg-[var(--lp-bg)] px-4 pb-6 pt-4">
        <div className="mx-auto max-w-lg">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-[0_24px_80px_rgba(0,0,0,0.12)] ring-1 ring-[var(--lp-accent)]/25">
            <HeroTopMedia product={product} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {product.badges.map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-2 py-3 text-center text-[11px] font-black leading-tight text-[var(--lp-primary)] shadow-sm sm:text-xs"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--lp-bg)] px-4 py-6" dir="rtl">
        <div className="mx-auto max-w-lg text-right">
          <h1 className="text-2xl font-black leading-snug text-[var(--lp-primary)] sm:text-3xl">{product.painSection.headline}</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-[var(--lp-muted)] sm:text-base">{product.painSection.subheadline}</p>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-sm">
            <span className="inline-flex items-center gap-1 font-black text-[var(--lp-accent)]">
              <Star className="size-4 fill-current" aria-hidden />
              {product.rating}
            </span>
            <span className="text-[var(--lp-muted)]">({product.reviewsCount} تقييم تجريبي)</span>
            <span className="font-black text-[var(--lp-text)]">يبدأ من {formatPrice(minPrice, b)}</span>
          </div>
          <p className="mt-2 text-xs font-bold text-amber-800">{product.scarcityLine}</p>
        </div>
      </section>

      <section id="offers" className="scroll-mt-24 bg-[var(--lp-bg)] px-4 pb-4" dir="rtl">
        <div className="mx-auto max-w-lg space-y-3">
          <p className="text-center text-sm font-black text-[var(--lp-primary)]">اختاري العرض</p>
          {product.offers.map((offer) => {
            const on = offer.id === selected.id;
            return (
              <button
                type="button"
                key={offer.id}
                onClick={() => setSelectedId(offer.id)}
                className={`w-full rounded-2xl border-2 p-4 text-right transition ${
                  on ? "border-[var(--lp-primary)] bg-white shadow-md ring-1 ring-[var(--lp-primary)]" : "border-transparent bg-[var(--lp-card)] hover:border-[var(--lp-border)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full border-2 ${on ? "border-[var(--lp-primary)] bg-[var(--lp-primary)]" : "border-[var(--lp-muted)]"}`}>
                    {on ? <Check className="size-3 text-white" /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    {offer.badge ? (
                      <span className="mb-1 inline-block rounded-full bg-[var(--lp-accent)] px-2 py-0.5 text-[10px] font-black text-[var(--lp-primary-dark)]">{offer.badge}</span>
                    ) : null}
                    <p className="font-black text-[var(--lp-text)]">{offer.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-6 text-[var(--lp-muted)]">{offer.subtitle}</p>
                    <div className="mt-2 flex flex-wrap items-baseline justify-end gap-2">
                      {offer.compareAtPrice != null ? (
                        <span className="text-sm text-[var(--lp-muted)] line-through">{formatPrice(offer.compareAtPrice, b)}</span>
                      ) : null}
                      <span className="text-xl font-black text-[var(--lp-primary)]">{formatPrice(offer.price, b)}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            onClick={addOfferToCart}
            className="mt-2 w-full rounded-2xl bg-[var(--lp-primary)] py-4 text-lg font-black text-white shadow-xl transition hover:opacity-95"
          >
            {ctaLabel}
          </button>
          <p className="text-center text-xs font-semibold text-[var(--lp-muted)]">{b.cod.paymentLabel}</p>
        </div>
      </section>

      <section className="bg-[var(--lp-primary)] px-4 py-6 text-white" dir="rtl">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: BadgeCheck, t: b.cod.paymentLabel },
            { icon: Truck, t: b.cod.deliveryPromise },
            { icon: Shield, t: product.authority.certifications[0] ?? "ثقة ووضوح" },
            { icon: Heart, t: b.cod.returnGuarantee },
          ].map(({ icon: Icon, t }) => (
            <div key={t} className="flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 text-center">
              <Icon className="size-6 text-[var(--lp-accent)]" aria-hidden />
              <p className="text-[11px] font-bold leading-5">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <ProblemBlock product={product} />
      <MechanismBlock product={product} ingredients={ingredients} />
      <AuthorityBlock product={product} />
      <TimelineBlock product={product} />
      <TestimonialsBlock product={product} />
      <ComparisonBlock product={product} />
      <OfferRecapBlock product={product} selected={selected} b={b} onAdd={addOfferToCart} />
      <GuaranteeBlock b={b} steps={product.guaranteeSteps} />
      <HowToBlock product={product} />
      <CodBlock b={b} />
      <CitiesBlock product={product} b={b} />
      <FaqBlock product={product} />
      <RelatedBlock related={related} b={b} />

      <footer className="border-t border-[var(--lp-border)] bg-[var(--lp-card)] px-4 py-10 text-center text-sm text-[var(--lp-muted)]" dir="rtl">
        <p className="font-black text-[var(--lp-primary)]">{b.brand.nameLocal}</p>
        <p className="mt-1">{b.brand.tagline}</p>
        <p className="mt-3 text-xs">{b.brand.description}</p>
        <Link href="/" className="mt-4 inline-block font-bold text-[var(--lp-primary)] underline">
          العودة للرئيسية
        </Link>
      </footer>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] flex justify-center p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={addOfferToCart}
          className="pointer-events-auto flex w-full max-w-lg items-center justify-center gap-2 rounded-2xl bg-[var(--lp-primary)] px-4 py-4 text-base font-black text-white shadow-2xl"
        >
          <ArrowUp className="size-5 shrink-0" aria-hidden />
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

function ProblemBlock({ product }: { product: LandingProduct }) {
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        {product.images.problemImage?.trim() ? (
          <PremiumImage src={product.images.problemImage} alt={product.imageAlts.problemImage} className="shadow-md" />
        ) : (
          <PremiumPlaceholder alt={product.imageAlts.problemImage} caption={product.problem} />
        )}
        {product.proofInsight ? (
          <div className="mt-4 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-primary)] p-4 text-white shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-black text-[var(--lp-accent)]">{product.proofInsight.value}</p>
                <p className="mt-1 text-sm font-semibold leading-6">{product.proofInsight.label}</p>
                {product.proofInsight.source ? <p className="mt-2 text-xs text-white/70">{product.proofInsight.source}</p> : null}
              </div>
              <Sparkles className="size-8 shrink-0 text-[var(--lp-accent)]" aria-hidden />
            </div>
          </div>
        ) : null}
        <h2 className="mt-8 text-xl font-black text-[var(--lp-primary)]">هل تعانين من هالنقاط؟</h2>
        <div className="mt-4 space-y-3">
          {product.problemAgitation.map((row) => (
            <div key={row.pain} className="overflow-hidden rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-sm">
              <div className="flex gap-3 border-b border-red-100 bg-white p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                  <X className="size-4" aria-hidden />
                </span>
                <p className="text-sm font-bold leading-7 text-[var(--lp-text)]">{row.pain}</p>
              </div>
              <div className="flex gap-3 bg-[var(--lp-bg)] p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-800">
                  <Check className="size-4" aria-hidden />
                </span>
                <p className="text-sm font-semibold leading-7 text-[var(--lp-muted)]">{row.solution}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="mt-10 text-xl font-black text-[var(--lp-primary)]">{product.whyDifferentHeadline}</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--lp-muted)]">{product.whyDifferentSub}</p>
        <div className="mt-4 space-y-4">
          {product.failureAlternatives.map((alt) => (
            <div key={alt.title} className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg text-red-600">▲</span>
                <div>
                  <p className="font-black text-[var(--lp-text)]">{alt.title}</p>
                  <p className="mt-1 text-xs font-bold text-red-700">{alt.priceHint}</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--lp-muted)]">
                    {alt.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <X className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MechanismBlock({
  product,
  ingredients,
}: {
  product: LandingProduct;
  ingredients: { name: string; dosage?: string; benefit: string; proof: string }[];
}) {
  return (
    <section className="bg-white px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <h2 className="text-xl font-black text-[var(--lp-primary)]">ليش الروتين يشتغل معج بطريقة مختلفة؟</h2>
        <p className="mt-3 text-sm font-semibold leading-7 text-[var(--lp-muted)]">{product.mechanism}</p>
        <div className="mt-6 space-y-3">
          {product.mechanismCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg)] p-4">
              <p className="font-black text-[var(--lp-text)]">{c.title}</p>
              <p className="mt-2 text-sm text-[var(--lp-muted)]">{c.body}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-8 text-lg font-black text-[var(--lp-primary)]">{product.notInsideIntro}</h3>
        <ul className="mt-3 grid gap-2">
          {product.exclusions.map((ex) => (
            <li key={ex} className="rounded-xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-3 py-2 text-sm font-semibold text-[var(--lp-text)]">
              {ex}
            </li>
          ))}
        </ul>
        <h3 className="mt-8 text-lg font-black text-[var(--lp-primary)]">مكوّنات وملاحظات</h3>
        <div className="mt-4 space-y-3">
          {ingredients.map((ing) => (
            <div key={ing.name} className="rounded-2xl border border-[var(--lp-border)] p-4">
              <p className="font-black text-[var(--lp-text)]">
                {ing.name}
                {ing.dosage ? <span className="mr-2 text-xs font-bold text-[var(--lp-muted)]">({ing.dosage})</span> : null}
              </p>
              {ing.benefit ? <p className="mt-2 text-sm text-[var(--lp-muted)]">{ing.benefit}</p> : null}
              {ing.proof ? <p className="mt-1 text-xs font-semibold text-[var(--lp-primary)]">{ing.proof}</p> : null}
            </div>
          ))}
        </div>
        {product.images.ingredientImage?.trim() ? (
          <div className="mt-6">
            <PremiumImage src={product.images.ingredientImage} alt={product.imageAlts.ingredientImage} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function AuthorityBlock({ product }: { product: LandingProduct }) {
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {product.authority.certifications.map((c) => (
            <div key={c} className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-3 text-center text-xs font-black text-[var(--lp-primary)]">
              {c}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[2rem] border border-[var(--lp-border)] bg-[var(--lp-primary)] p-6 text-center text-white shadow-xl">
          <Shield className="mx-auto mb-3 size-10 text-[var(--lp-accent)]" aria-hidden />
          <p className="text-xs font-bold text-[var(--lp-accent)]">{product.authority.expertTitle}</p>
          <p className="mt-3 text-lg font-black leading-8">«{product.authority.expertQuote}»</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {product.authority.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-4 text-center">
              <p className="text-2xl font-black text-[var(--lp-primary)]">{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--lp-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineBlock({ product }: { product: LandingProduct }) {
  return (
    <section className="bg-white px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-xs font-black tracking-[0.2em] text-[var(--lp-primary)]">النتيجة قد تختلف — هذي توقعات عامة</p>
        <h2 className="mt-3 text-center text-2xl font-black text-[var(--lp-primary)]">وش ممكن تحسين مع الاستمرار؟</h2>
        <div className="mt-6 space-y-4">
          {product.timeline.map((t, i) => (
            <div key={t.label} className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg)] p-5 text-center shadow-sm">
              <div className="mx-auto grid size-12 place-items-center rounded-full border-2 border-[var(--lp-accent)] bg-[var(--lp-primary)] text-lg font-black text-[var(--lp-accent)]">
                {i + 1}
              </div>
              <p className="mt-3 font-black text-[var(--lp-text)]">{t.label}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--lp-muted)]">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsBlock({ product }: { product: LandingProduct }) {
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-xl font-black text-[var(--lp-primary)]">تجارب توضيحية — مو شهادات طبية</h2>
        <div className="mt-6 space-y-4">
          {product.testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex text-[var(--lp-accent)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800">مثال تجربة</span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-7 text-[var(--lp-text)]">«{t.quote}»</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-10 place-items-center rounded-full bg-[var(--lp-primary)] text-sm font-black text-white">{t.avatarLetter}</span>
                  <div>
                    <p className="font-black text-[var(--lp-text)]">{t.name}</p>
                    <p className="text-xs text-[var(--lp-muted)]">{t.meta}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonBlock({ product }: { product: LandingProduct }) {
  return (
    <section className="bg-white px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <p className="text-xs font-black text-[var(--lp-primary)]">{product.comparisonIntro.kicker}</p>
        <h2 className="mt-2 text-2xl font-black text-[var(--lp-primary)]">{product.comparisonIntro.headline}</h2>
        <p className="mt-2 text-sm text-[var(--lp-muted)]">{product.comparisonIntro.sub}</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--lp-border)]">
          {product.comparisonRows.map((row) => (
            <div key={row.label} className="grid border-b border-[var(--lp-border)] last:border-b-0 sm:grid-cols-3">
              <div className="bg-[var(--lp-primary)] p-3 text-xs font-black text-white sm:col-span-1">{row.label}</div>
              <div className="bg-[var(--lp-bg)] p-3 text-sm font-semibold text-[var(--lp-text)]">{row.self}</div>
              <div className="bg-white p-3 text-sm text-[var(--lp-muted)]">{row.other}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferRecapBlock({
  product,
  selected,
  b,
  onAdd,
}: {
  product: LandingProduct;
  selected: LandingOffer;
  b: typeof businessConfig;
  onAdd: () => void;
}) {
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-[var(--lp-border)] bg-[var(--lp-primary)] p-6 text-white shadow-xl">
        <h2 className="text-xl font-black">تلخيص العرض</h2>
        <p className="mt-2 text-sm text-white/80">{product.name}</p>
        <p className="mt-4 text-3xl font-black text-[var(--lp-accent)]">{formatPrice(selected.price, b)}</p>
        <p className="mt-1 text-sm font-bold">{selected.label}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {product.offerRecapBullets.map((x) => (
            <li key={x} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--lp-accent)]" aria-hidden />
              {x}
            </li>
          ))}
        </ul>
        <button type="button" onClick={onAdd} className="mt-6 w-full rounded-2xl bg-[var(--lp-accent)] py-4 text-lg font-black text-[var(--lp-primary-dark)]">
          {`ابدئي ${product.shortName} · ${formatPrice(selected.price, b)}`}
        </button>
      </div>
    </section>
  );
}

function GuaranteeBlock({ b, steps }: { b: typeof businessConfig; steps: [string, string, string] }) {
  return (
    <section className="bg-white px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg)] p-6">
        <h2 className="text-xl font-black text-[var(--lp-primary)]">راحة بالك مع الطلب</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--lp-muted)]">{b.cod.returnGuarantee}</p>
        <ol className="mt-4 list-decimal space-y-2 pr-5 text-sm font-semibold text-[var(--lp-text)]">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function HowToBlock({ product }: { product: LandingProduct }) {
  const usage = product.usage ?? {
    headline: `طريقة استعمال مناسبة لـ ${product.format}`,
    steps: ["اقرئي التعليمات على العبوة.", "ابدئي بكمية صغيرة وتدرجي.", "توقفي عند أي تهيج واضح واستشيري مختص."],
  };
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <h2 className="text-xl font-black text-[var(--lp-primary)]">{usage.headline}</h2>
        <div className="mt-4 space-y-3">
          {usage.steps.map((s, i) => (
            <div key={s} className="flex gap-3 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--lp-primary)] text-sm font-black text-[var(--lp-accent)]">{i + 1}</span>
              <p className="text-sm font-semibold leading-7 text-[var(--lp-text)]">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodBlock({ b }: { b: typeof businessConfig }) {
  return (
    <section className="bg-white px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-black text-[var(--lp-primary)]">التوصيل والدفع</p>
        <h2 className="mt-2 text-2xl font-black text-[var(--lp-primary)]">كيف يوصلج طلبج؟</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--lp-muted)]">
          تختارين العرض، تثبتين الاسم ورقم الإمارات، ويتم التأكيد قبل الشحن. {b.cod.confirmationPromise}
        </p>
        <div className="mt-6 space-y-3 text-right">
          {[
            ["١", "اطلبي الآن", "بدون دفع إلكتروني مسبق — اختيار العرض من الصفحة."],
            ["٢", "نتواصل للتأكيد", b.cod.confirmationPromise],
            ["٣", "توصيل ودفع عند الباب", b.cod.deliveryPromise],
          ].map(([num, title, body]) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg)] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[var(--lp-accent)] bg-[var(--lp-primary)] text-sm font-black text-[var(--lp-accent)]">{num}</span>
              <div>
                <p className="font-black text-[var(--lp-text)]">{title}</p>
                <p className="mt-1 text-sm text-[var(--lp-muted)]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CitiesBlock({ product, b }: { product: LandingProduct; b: typeof businessConfig }) {
  const cities = product.delivery.cities.length ? product.delivery.cities : [`كل مناطق ${b.market.countryName}`];
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-5">
        <div className="flex items-center gap-2 font-black text-[var(--lp-primary)]">
          <MapPin className="size-5 text-[var(--lp-accent)]" aria-hidden />
          مناطق التوصيل (مثال)
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {cities.map((city) => (
            <span key={city} className="inline-flex items-center gap-1 rounded-full border border-[var(--lp-border)] bg-white px-3 py-1 text-xs font-bold text-[var(--lp-text)]">
              <Check className="size-3 text-emerald-700" aria-hidden />
              {city}
            </span>
          ))}
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--lp-muted)]">
          <Package className="size-4" aria-hidden />
          {product.delivery.carriers.join(" · ")}
        </p>
      </div>
    </section>
  );
}

function FaqBlock({ product }: { product: LandingProduct }) {
  return (
    <section className="bg-white px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-2xl font-black text-[var(--lp-primary)]">قبل ما تطلبين — أسئلة سريعة</h2>
        <div className="mt-6 space-y-6">
          {product.faq.map((cat) => (
            <div key={cat.category}>
              <p className="text-xs font-black text-[var(--lp-accent)]">{cat.category}</p>
              <div className="mt-3 space-y-2">
                {cat.items.map((item) => (
                  <details key={item.q} className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg)] p-4">
                    <summary className="cursor-pointer list-none font-black text-[var(--lp-text)] [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-2">
                        {item.q}
                        <ChevronDown className="size-5 shrink-0 text-[var(--lp-muted)]" aria-hidden />
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-[var(--lp-muted)]">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedBlock({ related, b }: { related: LandingProduct[]; b: typeof businessConfig }) {
  if (!related.length) return null;
  return (
    <section className="bg-[var(--lp-bg)] px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-lg">
        <h2 className="text-xl font-black text-[var(--lp-primary)]">منتجات تكمّل طلبج</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((p) => {
            const cardSrc = getProduct(p.slug)?.cardImage?.trim();
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-4 shadow-sm transition hover:shadow-md"
              >
                {cardSrc ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg)] sm:aspect-[3/2]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- same /public card art as home ProductCard */}
                    <img
                      src={cardSrc}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <PremiumPlaceholder alt={p.name} caption={p.cardHeadline} className="aspect-[4/3] sm:aspect-[3/2]" />
                )}
                <p className="mt-3 font-black text-[var(--lp-text)]">{p.name}</p>
                <p className="mt-1 text-sm text-[var(--lp-muted)]">{p.cardSubheadline}</p>
                <p className="mt-2 text-sm font-black text-[var(--lp-primary)]">
                  يبدأ من {formatPrice(Math.min(...p.offers.map((o) => o.price)), b)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
