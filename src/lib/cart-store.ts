"use client";

import { create } from "zustand";
import { CartItem, Product } from "./products";

type CheckoutState = "closed" | "checkout" | "upsell";

type CartStore = {
  items: CartItem[];
  isCartOpen: boolean;
  checkoutState: CheckoutState;
  lastOrderId?: string;
  lastTotal?: number;
  addItem: (product: Product | CartItem, quantity?: number) => void;
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
  closeCart: () => set({ isCartOpen: false, checkoutState: "closed" }),
  openCheckout: () => set({ checkoutState: "checkout", isCartOpen: true }),
  closeCheckout: () => set({ checkoutState: "closed" }),
  openUpsell: (orderId, total) =>
    set({ checkoutState: "upsell", lastOrderId: orderId, lastTotal: total }),
  clearCart: () => set({ items: [], isCartOpen: false, checkoutState: "closed" }),
  subtotal: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));

