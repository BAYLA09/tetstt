/**
 * Server-only: used by App Route handlers under `app/api/orders/`.
 * Do not import from client components.
 */
export function resolveOrderBackendBaseUrl(): string {
  const raw =
    process.env.ORDER_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.layalibeauty.shop";
  return raw.replace(/\/$/, "");
}

export function forwardClientIpHeaders(req: Request): Headers {
  const out = new Headers();
  for (const name of ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"] as const) {
    const v = req.headers.get(name);
    if (v) out.set(name, v);
  }
  return out;
}
