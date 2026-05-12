import { NextResponse, type NextRequest } from "next/server";
import { forwardClientIpHeaders, resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

function forwardResponseMetaHeaders(upstream: Response): Headers {
  const headers = new Headers();
  const ct = upstream.headers.get("content-type") || "application/json";
  headers.set("Content-Type", ct);
  for (const name of ["x-request-id", "x-order-security-reason", "x-order-security-code"] as const) {
    const v = upstream.headers.get(name);
    if (v) headers.set(name, v);
  }
  return headers;
}

export async function POST(req: NextRequest) {
  const backend = resolveOrderBackendBaseUrl();
  const body = await req.text();
  const headers = forwardClientIpHeaders(req);
  headers.set("Content-Type", "application/json");

  const res = await fetch(`${backend}/orders`, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(120_000),
  });

  const text = await res.text();
  const outHeaders = forwardResponseMetaHeaders(res);
  return new NextResponse(text, { status: res.status, headers: outHeaders });
}
