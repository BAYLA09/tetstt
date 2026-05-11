import type { CartItem } from "./products";

/** When false, the browser calls the FastAPI host directly (CORS must allow the storefront). */
const useSameOriginOrderProxy =
  process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY !== "false";

function orderRequestUrl(path: "/orders" | `/orders/${string}/upsell`): string {
  if (!useSameOriginOrderProxy) {
    const base = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.layalibeauty.shop"
    ).replace(/\/$/, "");
    return `${base}${path}`;
  }
  return path === "/orders" ? "/api/orders" : `/api/orders/${path.slice("/orders/".length)}`;
}

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

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 12000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  let response: Response;
  try {
    response = await fetchWithTimeout(
      orderRequestUrl("/orders"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      12000
    );
  } catch (err: unknown) {
    // Network error or timeout — give a clear message
    const isTimeout =
      err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
    if (isTimeout) {
      throw new Error("timeout");
    }
    throw new Error("network");
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body?.detail?.message || body?.detail || body?.message || "";
    } catch {
      detail = await response.text().catch(() => "");
    }
    throw new Error(detail || `http_${response.status}`);
  }

  return response.json();
}

export async function addUpsell(orderId: string, sku: string, eventId: string) {
  const response = await fetchWithTimeout(
    orderRequestUrl(`/orders/${orderId}/upsell`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, event_id: eventId, quantity: 1 }),
    },
    8000
  );

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Upsell request failed");
  }

  return response.json();
}
