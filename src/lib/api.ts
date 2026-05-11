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

function formatOrderApiError(status: number, body: unknown, rawText: string): string {
  const trimmedRaw = rawText.replace(/^\s+|\s+$/g, "").slice(0, 280);

  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const d = o.detail;
    if (typeof d === "string" && d.trim()) return d.trim();
    if (d && typeof d === "object" && !Array.isArray(d)) {
      const m = (d as Record<string, unknown>).message;
      if (typeof m === "string" && m.trim()) return m.trim();
    }
    if (Array.isArray(d) && d.length) {
      const parts = d.map((e) => {
        if (e && typeof e === "object" && "msg" in e) return String((e as { msg: unknown }).msg);
        return "";
      }).filter(Boolean);
      if (parts.length) return parts.join("؛ ");
    }
    const top = o.message;
    if (typeof top === "string" && top.trim()) return top.trim();
  }

  if (trimmedRaw && !trimmedRaw.startsWith("<") && trimmedRaw.length < 400) {
    return trimmedRaw;
  }

  if (status === 502 || status === 503 || status === 504) {
    return "خادم الطلبات مشغول أو غير متصل مؤقتاً. جرّبي بعد قليل.";
  }
  if (status === 403) {
    return "تعذر قبول الطلب لأسباب أمنية. جرّبي من شبكة أخرى أو تواصلي معنا.";
  }
  if (status === 400) {
    return "بيانات الطلب غير مقبولة. راجعي السلة والرقم وحاولي مجدداً.";
  }
  if (status >= 500) {
    return "خطأ داخلي في خادم الطلبات. أعدي المحاولة بعد دقائق أو تواصلي مع الدعم.";
  }
  return `تعذر تثبيت الطلب (رمز ${status}). جرّبي لاحقاً أو تواصلي مع الدعم.`;
}

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
    const status = response.status;
    const raw = await response.text().catch(() => "");
    let body: unknown;
    try {
      body = raw ? (JSON.parse(raw) as unknown) : undefined;
    } catch {
      body = undefined;
    }
    throw new Error(formatOrderApiError(status, body, raw));
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
    const status = response.status;
    const raw = await response.text().catch(() => "");
    let body: unknown;
    try {
      body = raw ? (JSON.parse(raw) as unknown) : undefined;
    } catch {
      body = undefined;
    }
    throw new Error(formatOrderApiError(status, body, raw));
  }

  return response.json();
}
