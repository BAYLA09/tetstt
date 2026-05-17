"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { type Product } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="rounded-[2rem] border border-[var(--border-gold)] bg-white p-4 shadow-[0_18px_56px_rgba(1,38,25,0.08)] ring-1 ring-[rgba(201,150,69,0.06)] transition-shadow duration-300 ease-out hover:shadow-[0_24px_72px_rgba(1,38,25,0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        {product.cardImage ? (
          <div className="relative h-64 overflow-hidden rounded-[1.5rem] border border-[var(--border-gold)] bg-[var(--cream-50)]">
            <Image
              src={product.cardImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="placeholder-art h-64 rounded-[1.5rem]">
            <span>{product.shortName}</span>
          </div>
        )}
      </Link>
      <div className="mt-5 space-y-3">
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
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-2xl font-bold text-[var(--emerald-950)]">
            {product.name}
          </h3>
        </Link>
        <p className="min-h-12 text-sm leading-7 text-[var(--muted)]">
          {product.subheading}
        </p>
        <div className="flex items-end justify-between">
          <div>
            {product.compareAt && (
              <p className="text-sm text-[var(--muted)] line-through">
                {product.compareAt} درهم
              </p>
            )}
            <p className="text-2xl font-black text-[var(--emerald-950)]">
              {product.price} درهم
            </p>
          </div>
          <button
            onClick={() => addItem(product)}
            className="rounded-full bg-[var(--gold-500)] px-5 py-3 text-sm font-black text-[var(--emerald-950)] shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--gold-400)] hover:shadow-lg active:translate-y-0"
          >
            أضيفي العرض
          </button>
        </div>
      </div>
    </article>
  );
}
