import type { NextConfig } from "next";

const MAIN_PRODUCT = "/products/dubai-palace-oud-serum";

const nextConfig: NextConfig = {
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
   * Avoid a global `no-store` on every path: it disables CDN and browser caching for
   * HTML and `/_next/static` assets, which makes repeat visits feel slow and heavy.
   * Keep no-store only for API and admin surfaces that must stay private.
   */
  async headers() {
    const noStore = "private, no-store, no-cache, must-revalidate, proxy-revalidate" as const;
    return [
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: noStore }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: noStore }] },
    ];
  },
};

export default nextConfig;
