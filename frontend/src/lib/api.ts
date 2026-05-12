import type { CartItem } from "./products";

const DEFAULT_ORDER_API_BASE = "https://api.layalibeauty.shop";

/**
 * When true, browser posts to same-origin `/api/orders` (Next BFF). Requires that route deployed.
 * Default false → browser posts directly to `NEXT_PUBLIC_API_BASE_URL` (production API).
 */
const useSameOriginOrderProxy = process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY === "true";

export function resolveOrderApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_ORDER_API_BASE).replace(/\/$/, "");
}

function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length <= 4) return "***";
  return `***${d.slice(-4)}`;
}

function maskName(name: string): string {
  const t = name.trim();
  if (!t) return "***";
  return `${t[0]}***`;
}

function sanitizePayloadForLog(payload: OrderPayload): Record<string, unknown> {
  return {
    customer_name: maskName(payload.customer_name),
    phone: maskPhone(payload.phone),
    items: payload.items.map((i) => ({ sku: i.sku, name: i.name, price: i.price, quantity: i.quantity })),
    currency: payload.currency,
    source_url: payload.source_url,
    landing_page: payload.landing_page,
    event_ids: Object.keys(payload.event_ids || {}).length ? "(keys only) " + Object.keys(payload.event_ids).join(",") : {},
    tracking: Object.keys(payload.tracking || {}).length ? "(keys only) " + Object.keys(payload.tracking).join(",") : {},
    utm: payload.utm,
  };
}

function extractDetailReason(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return undefined;
  try {
    const j = JSON.parse(trimmed) as { detail?: unknown };
    const d = j.detail;
    if (d && typeof d === "object" && "reason" in d) {
      const r = (d as { reason?: unknown }).reason;
      if (typeof r === "string" && r) return r;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function logOrderSecurityReason(status: number, raw: string): void {
  if (typeof window === "undefined" || status !== 403) return;
  const reason = extractDetailReason(raw);
  if (reason) console.warn("[checkout] order API detail.reason (debug):", reason);
}

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
    const base = resolveOrderApiBaseUrl();
    return `${base}${path}`;
  }
  return path === "/orders" ? "/api/orders" : `/api/orders/${path.slice("/orders/".length)}`;
}

/** Absolute URL for logs (relative paths resolved against storefront origin in browser). */
function absoluteUrlForLog(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  return url;
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
  const path = "/orders" as const;
  const url = orderRequestUrl(path);
  const apiBaseUrl = resolveOrderApiBaseUrl();
  const fullOrdersUrl = absoluteUrlForLog(url);

  console.info("[checkout] POST /orders — about to fetch", {
    apiBaseUrl,
    fullOrdersUrl,
    useSameOriginOrderProxy,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "(unset, using default)",
    NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY: process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? "(unset → direct API)",
    payload: sanitizePayloadForLog(payload),
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const rawBody = await response.text();
  const detailReason = extractDetailReason(rawBody);

  console.info("[checkout] POST /orders — response", {
    responseStatus: response.status,
    responseBody: rawBody.slice(0, 4000),
    detailReason: detailReason ?? null,
  });

  if (!response.ok) {
    logOrderSecurityReason(response.status, rawBody);
    throw new Error(orderApiUserMessage(response.status, rawBody));
  }

  return JSON.parse(rawBody) as OrderResponse;
}

export async function addUpsell(orderId: string, sku: string, eventId: string) {
  const path = `/orders/${orderId}/upsell` as const;
  const url = orderRequestUrl(path);
  const apiBaseUrl = resolveOrderApiBaseUrl();
  const fullUrl = absoluteUrlForLog(url);
  const body = { sku, event_id: eventId, quantity: 1 };

  console.info("[checkout] POST upsell — about to fetch", {
    apiBaseUrl,
    fullUpsellUrl: fullUrl,
    useSameOriginOrderProxy,
    body,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const rawBody = await response.text();
  const detailReason = extractDetailReason(rawBody);

  console.info("[checkout] POST upsell — response", {
    responseStatus: response.status,
    responseBody: rawBody.slice(0, 4000),
    detailReason: detailReason ?? null,
  });

  if (!response.ok) {
    logOrderSecurityReason(response.status, rawBody);
    throw new Error(orderApiUserMessage(response.status, rawBody));
  }

  return JSON.parse(rawBody) as OrderResponse;
}
