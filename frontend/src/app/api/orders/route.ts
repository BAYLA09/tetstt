import { NextResponse, type NextRequest } from "next/server";
import { forwardClientIpHeaders, resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

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
  const ct = res.headers.get("content-type") || "application/json";
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": ct } });
}
