import { describe, expect, it } from "vitest";
import { cartTotal, crossSellCandidates } from "@/lib/cart";

describe("cart helpers", () => {
  it("calculates totals", () => expect(cartTotal([{ sku: "LB-BUNDLE-299", name: "x", price: 299, quantity: 1 }, { sku: "LB-SERUM-SET-99", name: "y", price: 99, quantity: 1 }])).toBe(398));
  it("shows refill set when bundle is in cart", () => expect(crossSellCandidates([{ sku: "LB-BUNDLE-299", name: "x", price: 299, quantity: 1 }]).map((item) => item.sku)).toContain("LB-SERUM-SET-99"));
  it("shows bundle upgrade when cart is under AED 299", () => expect(crossSellCandidates([{ sku: "LB-SERUM-MUSK-59", name: "x", price: 59, quantity: 1 }]).map((item) => item.sku)).toContain("LB-BUNDLE-299"));
});
