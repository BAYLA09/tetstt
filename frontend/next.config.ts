import type { NextConfig } from "next";

const LAMP_PRODUCT = "/products/aroma-flame-lamp";

const nextConfig: NextConfig = {
  /** Works even if Edge middleware is disabled by the host; forces old bookmarks to the lamp page. */
  async redirects() {
    const legacyProductPaths = [
      "/products/luxury-bundle",
      "/products/white-rain-musk-serum",
      "/products/dubai-palace-oud-serum",
      "/products/serum-refill-set",
    ];
    return [
      ...legacyProductPaths.map((source) => ({
        source,
        destination: LAMP_PRODUCT,
        permanent: false,
      })),
      { source: "/collections", destination: LAMP_PRODUCT, permanent: false },
      { source: "/collections/:path*", destination: LAMP_PRODUCT, permanent: false },
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
