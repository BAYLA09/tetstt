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
      { source: "/collections", destination: MAIN_PRODUCT, permanent: false },
      { source: "/collections/:path*", destination: MAIN_PRODUCT, permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
