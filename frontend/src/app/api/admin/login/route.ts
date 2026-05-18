import { NextResponse, type NextRequest } from "next/server";
import { resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

export async function POST(req: NextRequest) {
  const backend = resolveOrderBackendBaseUrl();
  const body = await req.text();
  const res = await fetch(`${backend}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  const ct = res.headers.get("content-type") || "application/json";
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": ct } });
}
