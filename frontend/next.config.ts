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
      { source: "/", destination: MAIN_PRODUCT, permanent: false },
      ...legacyProductPaths.map((source) => ({
        source,
        destination: MAIN_PRODUCT,
        permanent: false,
      })),
    ];
  },

  /**
   * Avoid a global `no-store` on `/:path*` — that disables CDN/browser caching for JS chunks
   * and static assets and makes repeat visits feel sluggish.
   * Keep no-store only for API/admin surfaces that must stay private.
   */
  async headers() {
    const noStore = "private, no-store, no-cache, must-revalidate, proxy-revalidate" as const;
    const staticAssetCache = "public, max-age=604800, stale-while-revalidate=86400" as const;
    return [
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: noStore }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: noStore }] },
      { source: "/products/:path*", headers: [{ key: "Cache-Control", value: staticAssetCache }] },
      { source: "/merchant/:path*", headers: [{ key: "Cache-Control", value: staticAssetCache }] },
      { source: "/img-diffuser-card.webp", headers: [{ key: "Cache-Control", value: staticAssetCache }] },
    ];
  },
};

export default nextConfig;
