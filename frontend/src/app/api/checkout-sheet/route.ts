import { NextResponse } from "next/server";

const UPSTREAM = process.env.CHECKOUT_SHEET_WEBHOOK_URL?.trim();

export async function POST(req: Request) {
  if (!UPSTREAM) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ ok: false, error: "expected_object" }, { status: 400 });
  }

  try {
    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raw),
      signal: AbortSignal.timeout(15_000),
    });
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, upstreamStatus: res.status, upstream: text.slice(0, 500) },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream_failed" }, { status: 502 });
  }
}
