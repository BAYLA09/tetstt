import { NextResponse, type NextRequest } from "next/server";
import { resolveOrderBackendBaseUrl } from "@/lib/order-proxy-server";

type Params = { params: Promise<{ publicOrderId: string }> };

export async function GET(req: NextRequest, ctx: Params) {
  const { publicOrderId } = await ctx.params;
  const backend = resolveOrderBackendBaseUrl();
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const encoded = encodeURIComponent(publicOrderId);
  const res = await fetch(`${backend}/admin/orders/${encoded}`, {
    headers: { Authorization: auth },
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  const ct = res.headers.get("content-type") || "application/json";
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": ct } });
}
