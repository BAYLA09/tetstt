import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build info",
  robots: { index: false, follow: false },
};

/** Proves which bundle EasyPanel served (NEXT_PUBLIC_* baked at `next build`). */
export default function BuildInfoPage() {
  const data = {
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
    gitCommit: process.env.NEXT_PUBLIC_GIT_COMMIT ?? null,
    cacheBust: process.env.NEXT_PUBLIC_DOCKER_CACHE_BUST ?? null,
    appBuildMarker: process.env.NEXT_PUBLIC_APP_BUILD_MARKER ?? null,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? null,
    NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY: process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? null,
    NODE_ENV: process.env.NODE_ENV,
    note:
      "If this page is missing fields, the image was not rebuilt with Dockerfile build-args / .env.production build time.",
  };

  return (
    <main style={{ padding: "1.5rem", fontFamily: "ui-monospace, monospace", maxWidth: "56rem" }}>
      <h1 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Storefront build info</h1>
      <p style={{ marginBottom: "1rem", opacity: 0.85 }}>
        Open after every deploy. Compare <code>NEXT_PUBLIC_GIT_COMMIT</code> / <code>buildTime</code> with Git.
      </p>
      <pre
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: "8px",
          overflow: "auto",
          fontSize: "0.85rem",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
