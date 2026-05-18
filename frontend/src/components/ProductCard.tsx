"use client";

import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { money, type Product } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({
  product,
  showAddButton = true,
}: {
  product: Product;
  showAddButton?: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const cardSrc = product.cardImage?.trim();
  const showPhoto = Boolean(cardSrc);
  /** Fills the fixed aspect slot so every card photo uses the same frame size on the grid. */
  const cardImgClass =
    "absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border-gold)] bg-white p-3 shadow-[0_18px_60px_rgba(42,27,18,0.10)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(42,27,18,0.14)]">
      <Link href={`/products/${product.slug}`} className="block">
        {showPhoto ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-[var(--border-gold)] bg-[var(--cream-50)] sm:aspect-[3/2]">
            {/* eslint-disable-next-line @next/next/no-img-element -- static /public assets; next/image was tripping onError and showing the illustration fallback */}
            <img
              src={cardSrc}
              alt={product.name}
              className={cardImgClass}
              loading={showAddButton ? "lazy" : "eager"}
              decoding="async"
              fetchPriority={showAddButton ? "auto" : "high"}
            />
          </div>
        ) : (
          <div className="product-illustration grid aspect-[4/3] w-full place-items-end rounded-[1.5rem] p-6 sm:aspect-[3/2]">
            <div className="relative z-10 w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-xs font-black text-[var(--gold-300)]">{product.badge}</p>
              <p className="mt-1 text-2xl font-black text-white">{product.shortName}</p>
            </div>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-2 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--emerald-950)] px-3 py-1 text-xs font-bold text-[var(--gold-300)]">
            {product.badge}
          </span>
          <div className="flex text-[var(--gold-500)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
        <div className="copy-quote copy-quote--compact mt-4" dir="rtl">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-2xl font-black leading-snug text-[var(--emerald-950)] transition group-hover:text-[var(--gold-500)]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-3 min-h-16 text-sm leading-7 text-[var(--muted)]">{product.subheading}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {product.compareAt && (
              <p className="text-sm font-bold text-[var(--muted)] line-through">
                {money(product.compareAt)}
              </p>
            )}
            <div className="price-lockup">
              <span>يبدأ من</span>
              <strong>{product.price}</strong>
              <span>درهم</span>
            </div>
          </div>
          {showAddButton ? (
            <button
              onClick={() => addItem(product)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold-500)] px-5 py-3 text-sm font-black text-[var(--emerald-950)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--gold-400)]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              أضيفي العرض
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-gold)] px-5 py-3 text-sm font-black text-[var(--emerald-950)] transition hover:-translate-y-0.5 hover:bg-[var(--cream-50)]"
            >
              اكتشفي التفاصيل
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
