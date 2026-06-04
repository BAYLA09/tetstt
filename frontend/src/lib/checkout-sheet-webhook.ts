import type { CartItem } from "./products";
import type { OrderResponse } from "./api";

/** JSON shape expected by the Google Apps Script / Sheets webhook. */
export type CheckoutSheetWebhookPayload = {
  date: string;
  orderid: string;
  country: string;
  name: string;
  phone: string;
  product: string;
  url: string;
  sku: string;
  quantity: number;
  totalprice: number;
  currency: string;
  status: string;
};

export function buildCheckoutSheetPayload(params: {
  order: OrderResponse;
  customerName: string;
  phone: string;
  items: CartItem[];
  pageUrl: string;
}): CheckoutSheetWebhookPayload {
  const { order, customerName, phone, items, pageUrl } = params;
  const quantity = items.reduce((sum, line) => sum + line.quantity, 0);
  return {
    date: new Date().toISOString(),
    orderid: order.order_id,
    country: "UAE",
    name: customerName,
    phone,
    product: items.map((i) => i.name).join("/"),
    url: pageUrl,
    sku: items.map((i) => i.sku).join("/"),
    quantity,
    totalprice: order.total,
    currency: order.currency,
    status: order.status,
  };
}

/**
 * Notifies Google Sheets after a successful checkout. Uses same-origin POST to
 * `/api/checkout-sheet`, which forwards with `fetch` + JSON to the script URL
 * (avoids browser CORS blocks on script.google.com).
 */
export function notifyCheckoutSheetWebhook(body: CheckoutSheetWebhookPayload): void {
  if (typeof window === "undefined") return;
  void fetch("/api/checkout-sheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {
    /* Non-blocking: order already persisted via POST /orders. */
  });
}
