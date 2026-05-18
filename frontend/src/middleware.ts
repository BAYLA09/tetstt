import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRODUCT_HOME = "/products/dubai-palace-oud-serum";
const ALLOWED_PRODUCT_SLUGS = new Set(["aroma-flame-lamp", "dubai-palace-oud-serum"]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Files in `public/products/` are served at `/products/...`. Do not treat them as PDP slugs
  // or image requests get redirected to HTML and cards show the illustration fallback.
  if (/^\/products\/[^/]+\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }

  const match = pathname.match(/^\/products\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();
  const slug = match[1];
  if (!ALLOWED_PRODUCT_SLUGS.has(slug)) {
    return NextResponse.redirect(new URL(PRODUCT_HOME, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:slug"],
};
