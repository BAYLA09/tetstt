import type { NextConfig } from "next";

const MAIN_PRODUCT = "/products/dubai-palace-oud-serum";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  /** Tree-shake icon imports: `import { X } from "lucide-react"` emits only used icons. */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  /** Works even if Edge middleware is disabled by the host; forces old bookmarks to the main offer page. */
  async redirects() {
    const legacyProductPaths = [
      "/products/luxury-bundle",
      "/products/white-rain-musk-serum",
      "/products/serum-refill-set",
    ];
    return [
      ...legacyProductPaths.map((source) => ({
        source,
        destination: MAIN_PRODUCT,
        permanent: false,
      })),
    ];
  },

  /**
   * Avoid a global `no-store` on `/:path*` — that disables CDN/browser caching for JS chunks
   * and images and makes repeat visits and scrolling feel sluggish.
   * Warm cache for large /public rasters (Next already sets long immutable cache on `/_next/static`).
   */
  async headers() {
    return [
      {
        source: "/products/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/merchant/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
