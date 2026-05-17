import { NextResponse, type NextRequest } from "next/server";
import { resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

export async function GET(req: NextRequest) {
  const backend = resolveOrderBackendBaseUrl();
  const url = new URL(req.url);
  const target = `${backend}/admin/metrics${url.search}`;
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const res = await fetch(target, {
    headers: { Authorization: auth },
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  const ct = res.headers.get("content-type") || "application/json";
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": ct } });
}
