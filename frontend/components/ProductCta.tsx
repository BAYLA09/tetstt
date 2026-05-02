"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCta({ product, label = "أضيفي العرض للسلة", sticky = false }: { product: Product; label?: string; sticky?: boolean }) {
  const addProduct = useCart((state) => state.addProduct);
  return <button className={sticky ? "btn mobile-sticky" : "btn"} onClick={() => addProduct(product)}>{label}</button>;
}
