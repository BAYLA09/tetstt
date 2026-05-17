import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build info",
  robots: { index: false, follow: false },
};

/** Proves which bundle EasyPanel served (NEXT_PUBLIC_* baked at `next build`). */
export default function BuildInfoPage() {
  const data = {
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
    commitSha: process.env.NEXT_PUBLIC_COMMIT_SHA ?? null,
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
    <main className="min-h-screen bg-[var(--cream-50)] px-6 py-10 font-mono text-[var(--foreground)]">
      <h1 className="mb-3 text-lg font-bold text-[var(--emerald-950)]">Storefront build info</h1>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
        Compare <code className="rounded bg-white px-1.5 py-0.5 text-xs text-[var(--emerald-950)] shadow-sm">commitSha</code> /{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs text-[var(--emerald-950)] shadow-sm">gitCommit</code> with Git and{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs text-[var(--emerald-950)] shadow-sm">GET https://api.layalibeauty.shop/version</code>.
      </p>
      <pre className="overflow-auto rounded-xl border border-[var(--border-gold)] bg-[var(--emerald-950)] p-4 text-[0.8rem] leading-relaxed text-[var(--cream-100)] shadow-lg ring-1 ring-black/10">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
