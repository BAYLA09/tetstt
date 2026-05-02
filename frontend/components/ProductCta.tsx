"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCta({ product, label = "أضيفي العرض للسلة", sticky = false }: { product: Product; label?: string; sticky?: boolean }) {
  const addProduct = useCart((state) => state.addProduct);
  const overlayOpen = useCart((state) => state.isCartOpen || state.isCheckoutOpen || Boolean(state.pendingOrder));
  if (sticky && overlayOpen) return null;
  return <button className={sticky ? "btn mobile-sticky" : "btn"} data-sku={product.sku} onClick={() => addProduct(product)}>{label}</button>;
}
