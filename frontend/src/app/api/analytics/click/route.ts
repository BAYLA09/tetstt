import { NextResponse, type NextRequest } from "next/server";
import { forwardClientIpHeaders, resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

export async function POST(req: NextRequest) {
  const backend = resolveOrderBackendBaseUrl();
  const body = await req.text();
  const headers = forwardClientIpHeaders(req);
  headers.set("Content-Type", "application/json");

  const res = await fetch(`${backend}/analytics/click`, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(30_000),
  });

  return new NextResponse(null, { status: res.status });
}
