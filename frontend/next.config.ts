import type { NextConfig } from "next";

const MAIN_PRODUCT = "/products/dubai-palace-oud-serum";

const nextConfig: NextConfig = {
  /** Tree-shake icon packs at build time for smaller client bundles. */
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
      { source: "/collections", destination: MAIN_PRODUCT, permanent: false },
      { source: "/collections/:path*", destination: MAIN_PRODUCT, permanent: false },
    ];
  },
};

export default nextConfig;
