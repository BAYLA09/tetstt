import type { CartItem } from "./products";
import { getClientBuildInfoForLog } from "./build-info-debug";
import { checkoutVerboseLog } from "./order-debug";

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

type ParsedApiDetail = { message?: string; reason?: string; code?: string };

function parseFastApiDetail(raw: string): ParsedApiDetail {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return {};
  try {
    const j = JSON.parse(trimmed) as { detail?: unknown };
    const d = j.detail;
    if (typeof d === "string" && d) return { message: d };
    if (Array.isArray(d) && d.length > 0 && typeof d[0] === "object" && d[0] !== null) {
      const row = d[0] as Record<string, unknown>;
      const msg = row.msg ?? row.message;
      if (typeof msg === "string" && msg) return { message: msg };
    }
    if (d && typeof d === "object") {
      const o = d as Record<string, unknown>;
      const message = typeof o.message === "string" ? o.message : undefined;
      const reason = typeof o.reason === "string" ? o.reason : undefined;
      const code = typeof o.code === "string" ? o.code : undefined;
      return { message, reason, code };
    }
  } catch {
    /* ignore */
  }
  return {};
}

function extractDetailReason(raw: string): string | undefined {
  return parseFastApiDetail(raw).reason;
}

function logOrderSecurityReason(status: number, raw: string): void {
  if (typeof window === "undefined" || status !== 403) return;
  const { reason, code, message } = parseFastApiDetail(raw);
  if (reason || code || message) {
    console.warn("[checkout] order API security detail:", { reason: reason ?? null, code: code ?? null, message: message ?? null });
  }
}

function userMessageForSecurityReason(reason: string): string {
  if (reason.startsWith("country_not_allowed"))
    return "الطلب لم يُقبل لأن موقع الشبكة لا يطابق الإمارات. جرّبي من شبكة إماراتية أو عطّلي VPN.";
  if (reason.startsWith("blocked_trait:"))
    return "الطلب لم يُقبل بسبب نوع الاتصال (VPN/بروكسي). جرّبي بدون VPN أو تواصلي معنا.";
  if (reason.startsWith("ip_risk_too_high"))
    return "الطلب لم يُقبل لأن تقييم أمان عنوان الشبكة مرتفع. جرّبي من شبكة أخرى أو تواصلي معنا.";
  return "تعذر قبول الطلب لأسباب أمنية. جرّبي من شبكة أخرى أو تواصلي معنا.";
}

function orderApiUserMessage(status: number, raw: string): string {
  const parsed = parseFastApiDetail(raw);
  checkoutVerboseLog("parseFastApiDetail", { status, ...parsed, rawHead: raw.slice(0, 800) });

  if (parsed.message) return parsed.message;

  const trimmed = raw.trim();
  if (trimmed && !trimmed.startsWith("{")) return trimmed.slice(0, 600);

  if (status === 403) {
    if (parsed.reason) return userMessageForSecurityReason(parsed.reason);
    return "تعذر قبول الطلب لأسباب أمنية. جرّبي من شبكة أخرى أو تواصلي معنا.";
  }
  if (status === 429) {
    return "طلبات كثيرة من نفس الجهاز. انتظري قليلاً ثم أعيدي المحاولة.";
  }
  if (status >= 500) {
    return "تعذّر إكمال الطلب من الخادم الآن. أعيدي المحاولة بعد قليل أو تواصلي معنا.";
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

/** Slow mobile + cold API + server hooks; browser default has no clear limit. */
const ORDER_FETCH_TIMEOUT_MS = 75_000;

function createTimeoutSignal(ms: number): AbortSignal {
  const AT = AbortSignal as typeof AbortSignal & { timeout?: (n: number) => AbortSignal };
  if (typeof AT.timeout === "function") return AT.timeout(ms);
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

function isLikelyTransientFetchFailure(err: unknown): boolean {
  if (isAbortError(err)) return true;
  if (err instanceof TypeError) return true;
  return false;
}

function wrapOrderFetchFailure(err: unknown): Error {
  if (isAbortError(err)) return new Error("انتهت مهلة الاتصال. جرّبي مرة أخرى.");
  if (err instanceof TypeError) return new Error("تعذّر الاتصال بالخادم. تأكّدي من الشبكة أو جرّبي مرة ثانية.");
  if (err instanceof Error) return err;
  return new Error("تعذر إرسال الطلب الآن. تأكدي من الرقم وحاولي مرة أخرى.");
}

function buildOrderFetchCandidates(path: "/orders" | `/orders/${string}/upsell`): string[] {
  const primary = orderRequestUrl(path);
  const out: string[] = [primary];
  if (!useSameOriginOrderProxy && typeof window !== "undefined" && primary.startsWith("http")) {
    out.push(path === "/orders" ? "/api/orders" : `/api/orders/${path.slice("/orders/".length)}`);
  }
  return out;
}

async function fetchOrderPost(url: string, jsonBody: string): Promise<{ response: Response; rawBody: string }> {
  const signal = createTimeoutSignal(ORDER_FETCH_TIMEOUT_MS);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody,
    signal,
  });
  const rawBody = await response.text();
  return { response, rawBody };
}

async function postOrderWithOptionalSameOriginFallback(
  path: "/orders" | `/orders/${string}/upsell`,
  jsonBody: string,
  logLabel: "POST /orders" | "POST upsell",
): Promise<{ response: Response; rawBody: string; usedUrl: string }> {
  const candidates = buildOrderFetchCandidates(path);
  console.info(`[checkout] ${logLabel} — candidate URLs`, {
    candidates: candidates.map(absoluteUrlForLog),
    timeoutMs: ORDER_FETCH_TIMEOUT_MS,
  });

  let lastErr: unknown;
  for (let i = 0; i < candidates.length; i++) {
    const url = candidates[i]!;
    try {
      const { response, rawBody } = await fetchOrderPost(url, jsonBody);
      if (i > 0) {
        console.info(`[checkout] ${logLabel} — succeeded via same-origin fallback`, {
          usedUrl: absoluteUrlForLog(url),
        });
      }
      return { response, rawBody, usedUrl: url };
    } catch (err) {
      lastErr = err;
      const canRetry = i < candidates.length - 1 && isLikelyTransientFetchFailure(err);
      if (canRetry) {
        console.warn(`[checkout] ${logLabel} — transient failure, retrying same-origin`, {
          failedUrl: absoluteUrlForLog(url),
          err,
        });
        continue;
      }
      throw wrapOrderFetchFailure(err);
    }
  }
  throw wrapOrderFetchFailure(lastErr);
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

const PENDING_ORDER_LS_KEY = "layali_pending_order_v1";

function stashPendingOrderSnapshot(payload: OrderPayload, meta: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (meta.status === 403 || meta.status === 400) return;
  try {
    localStorage.setItem(
      PENDING_ORDER_LS_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        ...meta,
        payload: sanitizePayloadForLog(payload),
      }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearPendingOrderSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_ORDER_LS_KEY);
  } catch {
    /* ignore */
  }
}

export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  const path = "/orders" as const;
  const url = orderRequestUrl(path);
  const apiBaseUrl = resolveOrderApiBaseUrl();
  const fullOrdersUrl = absoluteUrlForLog(url);

  console.info("[checkout] POST /orders — about to fetch", {
    buildInfo: getClientBuildInfoForLog(),
    window_location_href: typeof window !== "undefined" ? window.location.href : "(ssr)",
    apiBaseUrl,
    fullOrdersUrl,
    useSameOriginOrderProxy,
    "raw NEXT_PUBLIC_API_BASE_URL": process.env.NEXT_PUBLIC_API_BASE_URL ?? "(unset at build → code default)",
    "raw NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY":
      process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? "(unset → direct API)",
    payload: sanitizePayloadForLog(payload),
  });

  checkoutVerboseLog("POST /orders request", {
    fullOrdersUrl,
    sanitizedPayload: sanitizePayloadForLog(payload),
  });

  const jsonBody = JSON.stringify(payload);
  let response: Response;
  let rawBody: string;
  let usedUrl: string;
  try {
    const bundle = await postOrderWithOptionalSameOriginFallback(path, jsonBody, "POST /orders");
    response = bundle.response;
    rawBody = bundle.rawBody;
    usedUrl = bundle.usedUrl;
  } catch (e: unknown) {
    if (e instanceof TypeError || (e instanceof DOMException && e.name === "AbortError")) {
      stashPendingOrderSnapshot(payload, { transientNetwork: true });
    }
    throw e;
  }
  const detailReason = extractDetailReason(rawBody);

  console.info("[checkout] POST /orders — response", {
    requestUrlUsed: absoluteUrlForLog(usedUrl),
    responseStatus: response.status,
    responseBody: rawBody.slice(0, 4000),
    detailReason: detailReason ?? null,
  });

  if (!response.ok) {
    if (response.status >= 500) {
      stashPendingOrderSnapshot(payload, {
        status: response.status,
        reason: extractDetailReason(rawBody) ?? null,
      });
    }
    logOrderSecurityReason(response.status, rawBody);
    throw new Error(orderApiUserMessage(response.status, rawBody));
  }

  clearPendingOrderSnapshot();
  return JSON.parse(rawBody) as OrderResponse;
}

export async function addUpsell(orderId: string, sku: string, eventId: string) {
  const path = `/orders/${orderId}/upsell` as const;
  const url = orderRequestUrl(path);
  const apiBaseUrl = resolveOrderApiBaseUrl();
  const fullUrl = absoluteUrlForLog(url);
  const body = { sku, event_id: eventId, quantity: 1 };

  console.info("[checkout] POST upsell — about to fetch", {
    buildInfo: getClientBuildInfoForLog(),
    window_location_href: typeof window !== "undefined" ? window.location.href : "(ssr)",
    apiBaseUrl,
    fullUpsellUrl: fullUrl,
    useSameOriginOrderProxy,
    "raw NEXT_PUBLIC_API_BASE_URL": process.env.NEXT_PUBLIC_API_BASE_URL ?? "(unset at build → code default)",
    "raw NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY":
      process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? "(unset → direct API)",
    body,
  });

  const jsonBody = JSON.stringify(body);
  const { response, rawBody, usedUrl } = await postOrderWithOptionalSameOriginFallback(path, jsonBody, "POST upsell");
  const detailReason = extractDetailReason(rawBody);

  console.info("[checkout] POST upsell — response", {
    requestUrlUsed: absoluteUrlForLog(usedUrl),
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
