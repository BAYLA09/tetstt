"use client";

import { create } from "zustand";
import { CartItem, Product, getProductBySku } from "./products";

type CheckoutState = "closed" | "checkout" | "upsell";

type CartStore = {
  items: CartItem[];
  isCartOpen: boolean;
  checkoutState: CheckoutState;
  lastOrderId?: string;
  lastTotal?: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openUpsell: (orderId: string, total: number) => void;
  clearCart: () => void;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  checkoutState: "closed",
  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((item) => item.sku === product.sku);
      if (existing) {
        return {
          isCartOpen: true,
          items: state.items.map((item) =>
            item.sku === product.sku
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        isCartOpen: true,
        items: [
          ...state.items,
          {
            sku: product.sku,
            name: product.name,
            price: product.price,
            quantity,
          },
        ],
      };
    }),
  removeItem: (sku) =>
    set((state) => ({
      items: state.items.filter((item) => item.sku !== sku),
    })),
  updateQuantity: (sku, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((item) => item.sku !== sku)
          : state.items.map((item) =>
              item.sku === sku ? { ...item, quantity } : item,
            ),
    })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openCheckout: () => set({ checkoutState: "checkout", isCartOpen: false }),
  closeCheckout: () => set({ checkoutState: "closed" }),
  openUpsell: (orderId, total) =>
    set({ checkoutState: "upsell", lastOrderId: orderId, lastTotal: total }),
  clearCart: () => set({ items: [], isCartOpen: false, checkoutState: "closed" }),
  subtotal: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));

export function getCrossSells(items: CartItem[]): Product[] {
  const skus = new Set(items.map((item) => item.sku));
  const suggestions: Product[] = [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (skus.has("LB-BUNDLE-299") && !skus.has("LB-SERUM-SET-99")) {
    suggestions.push(getProductBySku("LB-SERUM-SET-99")!);
  }

  if (skus.has("LB-SERUM-MUSK-59") && !skus.has("LB-SERUM-OUD-69")) {
    suggestions.push(getProductBySku("LB-SERUM-OUD-69")!);
  }

  if (skus.has("LB-SERUM-OUD-69") && !skus.has("LB-SERUM-MUSK-59")) {
    suggestions.push(getProductBySku("LB-SERUM-MUSK-59")!);
  }

  if (subtotal < 299 && !skus.has("LB-BUNDLE-299")) {
    suggestions.push(getProductBySku("LB-BUNDLE-299")!);
  }

  return suggestions.slice(0, 2);
}
