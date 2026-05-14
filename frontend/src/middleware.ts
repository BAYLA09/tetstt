import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRODUCT_HOME = "/products/aroma-flame-lamp";
const ALLOWED_PRODUCT_SLUGS = new Set(["aroma-flame-lamp", "dubai-palace-oud-serum"]);

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/products\/([^/]+)\/?$/);
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
