import { create } from "zustand";
import { Product, getProductBySku } from "@/lib/products";

export type CartItem = { sku: string; name: string; price: number; quantity: number };

type PendingOrder = { orderId: string; total: number } | null;

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  pendingOrder: PendingOrder;
  addProduct: (product: Product | CartItem) => void;
  setQuantity: (sku: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setPendingOrder: (order: PendingOrder) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  pendingOrder: null,
  addProduct: (product) => set((state) => {
    const item = state.items.find((candidate) => candidate.sku === product.sku);
    if (item) return { items: state.items.map((candidate) => candidate.sku === product.sku ? { ...candidate, quantity: candidate.quantity + 1 } : candidate), isCartOpen: true };
    return { items: [...state.items, { sku: product.sku, name: product.name, price: product.price, quantity: "quantity" in product ? product.quantity : 1 }], isCartOpen: true };
  }),
  setQuantity: (sku, quantity) => set((state) => ({ items: quantity <= 0 ? state.items.filter((item) => item.sku !== sku) : state.items.map((item) => item.sku === sku ? { ...item, quantity } : item) })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
  setPendingOrder: (order) => set({ pendingOrder: order, isCheckoutOpen: false }),
  clearCart: () => set({ items: [] }),
}));

export function cartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function crossSellCandidates(items: CartItem[]) {
  const skus = new Set(items.map((item) => item.sku));
  const total = cartTotal(items);
  const candidates: string[] = [];
  if (skus.has("LB-BUNDLE-299") && !skus.has("LB-SERUM-SET-99")) candidates.push("LB-SERUM-SET-99");
  if (skus.has("LB-SERUM-MUSK-59") && !skus.has("LB-SERUM-OUD-69")) candidates.push("LB-SERUM-OUD-69");
  if (skus.has("LB-SERUM-OUD-69") && !skus.has("LB-SERUM-MUSK-59")) candidates.push("LB-SERUM-MUSK-59");
  if ((skus.has("LB-SERUM-MUSK-59") || skus.has("LB-SERUM-OUD-69")) && !skus.has("LB-SERUM-SET-99")) candidates.push("LB-SERUM-SET-99");
  if (total > 0 && total < 299 && !skus.has("LB-BUNDLE-299")) candidates.push("LB-BUNDLE-299");
  return [...new Set(candidates)].map((sku) => getProductBySku(sku)).filter(Boolean) as Product[];
}
