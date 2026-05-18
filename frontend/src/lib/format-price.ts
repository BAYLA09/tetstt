import type { BusinessConfig } from "@/config/business";

export function formatPrice(value: number, business: BusinessConfig) {
  return `${value} ${business.market.currencySymbol}`;
}
