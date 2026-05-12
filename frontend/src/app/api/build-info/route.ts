import { NextResponse } from "next/server";

/** Same payload as `/build-info` but JSON for scripts and curl. */
export function GET() {
  const body = {
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
    gitCommit: process.env.NEXT_PUBLIC_GIT_COMMIT ?? null,
    cacheBust: process.env.NEXT_PUBLIC_DOCKER_CACHE_BUST ?? null,
    appBuildMarker: process.env.NEXT_PUBLIC_APP_BUILD_MARKER ?? null,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? null,
    NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY: process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? null,
    NODE_ENV: process.env.NODE_ENV,
  };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
