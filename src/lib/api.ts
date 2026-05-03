import type { CartItem } from "./products";

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8000";
    }
  }

  return "https://api.layalibeauty.shop";
}

const API_BASE_URL = resolveApiBaseUrl();

export type OrderPayload = {
  customer_name: string;
  phone: string;
  items: CartItem[];
  currency: "AED";
  source_url: string;
  landing_page: string;
  event_ids: Record<string, string>;
  tracking: Record<string, string>;
  utm: Record<string, string>;
};

export type OrderResponse = {
  order_id: string;
  status: string;
  total: number;
  currency: "AED";
};

export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Order request failed");
  }

  return response.json();
}

export async function addUpsell(orderId: string, sku: string, eventId: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/upsell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sku, event_id: eventId, quantity: 1 }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Upsell request failed");
  }

  return response.json();
}
