import { NextResponse, type NextRequest } from "next/server";
import { forwardClientIpHeaders, resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

export async function GET(req: NextRequest) {
  const backend = resolveOrderBackendBaseUrl();
  const headers = forwardClientIpHeaders(req);
  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  const res = await fetch(`${backend}/admin/economics`, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
