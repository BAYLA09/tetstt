import type { CartItem } from "./products";

/** When false, the browser calls the FastAPI host directly (CORS must allow the storefront). */
const useSameOriginOrderProxy =
  process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY !== "false";

function orderApiUserMessage(status: number, raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const j = JSON.parse(trimmed) as { detail?: unknown };
      const d = j.detail;
      if (typeof d === "string" && d) return d;
      if (Array.isArray(d) && d.length > 0 && typeof d[0] === "object" && d[0] !== null && "msg" in d[0]) {
        return String((d[0] as { msg: unknown }).msg);
      }
      if (d && typeof d === "object" && "message" in d) {
        const m = (d as { message?: unknown }).message;
        if (typeof m === "string" && m) return m;
      }
    } catch {
      /* ignore */
    }
  }
  if (trimmed) return trimmed;
  if (status === 403) {
    return "تعذر قبول الطلب لأسباب أمنية. جرّبي من شبكة أخرى أو تواصلي معنا.";
  }
  return "تعذر إرسال الطلب الآن. تأكدي من الرقم وحاولي مرة أخرى.";
}

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

export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  const response = await fetch(orderRequestUrl("/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(orderApiUserMessage(response.status, message));
  }

  return response.json();
}

export async function addUpsell(orderId: string, sku: string, eventId: string) {
  const response = await fetch(orderRequestUrl(`/orders/${orderId}/upsell`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sku, event_id: eventId, quantity: 1 }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(orderApiUserMessage(response.status, message));
  }

  return response.json();
}
