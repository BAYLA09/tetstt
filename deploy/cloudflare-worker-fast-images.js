/**
 * Layali Beauty — Cloudflare Worker v2 (NO EasyPanel rebuild)
 *
 * Fixes slow ad-link landings:
 * 1. HTML PDP cached at edge (fbclid/utm stripped from cache key)
 * 2. PNG → WebP from GitHub (~67 KB, not 1 MB)
 * 3. / → /products/dubai-palace-oud-serum redirect at edge
 *
 * Cloudflare Dashboard → Workers → paste → Deploy
 * Route (ONE route covers all):  layalibeauty.shop/*
 *
 * Optional cron: Triggers → Cron → every 5 minutes (see scheduled() below)
 */
const GITHUB_BRANCH = "main";
const GITHUB_REPO = "BAYLA09/tetstt";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/frontend/public`;

const MAIN_PDP = "/products/dubai-palace-oud-serum";

const AD_QUERY_KEYS = [
  "fbclid",
  "ttclid",
  "ScCid",
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

/** Live PNG paths (query ?v= ignored) → WebP in GitHub */
const PNG_TO_WEBP = {
  "/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.png":
    "/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.webp",
  "/products/adskull-image-567929c2-6d4a-480a-b0ec-54eb2889257b.png":
    "/products/adskull-image-567929c2-6d4a-480a-b0ec-54eb2889257b.webp",
  "/products/dubai-palace-oud-serum.png": "/products/dubai-palace-oud-serum.webp",
  "/products/adskull-image-02003faa-dc16-4ce7-9f87-3e4bab8e98d1-5.png":
    "/products/adskull-image-02003faa-dc16-4ce7-9f87-3e4bab8e98d1-5.webp",
  "/img-diffuser-card.png": "/img-diffuser-card.webp",
};

const HTML_CACHE_PATHS = new Set([
  "/",
  MAIN_PDP,
  "/products/aroma-flame-lamp",
  "/collections",
]);

const ORIGIN_TIMEOUT_MS = 8000;

function stripAdParams(url) {
  const u = new URL(url);
  for (const key of AD_QUERY_KEYS) u.searchParams.delete(key);
  return u;
}

function htmlCacheKey(request) {
  const u = stripAdParams(request.url);
  u.hash = "";
  return new Request(u.toString(), { method: "GET" });
}

async function serveWebpFromGitHub(webpPath, ctx) {
  const upstream = `${GITHUB_RAW}${webpPath}`;
  const cache = caches.default;
  const cacheKey = new Request(upstream, { method: "GET" });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const fetched = await fetch(upstream, {
    cf: { cacheTtl: 604800, cacheEverything: true },
  });
  if (!fetched.ok) return fetched;

  const response = new Response(fetched.body, {
    status: fetched.status,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Layali-Image-Source": "github-webp",
    },
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

async function fetchOrigin(request, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function cacheHtmlResponse(request, ctx) {
  const cache = caches.default;
  const key = htmlCacheKey(request);
  const hit = await cache.match(key);
  if (hit) {
    const h = new Headers(hit.headers);
    h.set("X-Layali-Cache", "HIT");
    return new Response(hit.body, { status: hit.status, headers: h });
  }

  let origin;
  try {
    origin = await fetchOrigin(request, ORIGIN_TIMEOUT_MS);
  } catch {
    if (hit) return hit;
    return new Response("Origin timeout — retry in a moment", { status: 504 });
  }

  if (!origin.ok) return origin;

  const body = await origin.arrayBuffer();
  const toStore = new Response(body, {
    status: origin.status,
    headers: {
      "Content-Type": origin.headers.get("Content-Type") || "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=120, stale-while-revalidate=86400",
      "X-Layali-Cache": "MISS",
    },
  });
  ctx.waitUntil(cache.put(key, toStore.clone()));
  return toStore;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "GET" && path === "/") {
      const dest = new URL(MAIN_PDP, url.origin);
      dest.search = url.search;
      return Response.redirect(stripAdParams(dest).toString(), 302);
    }

    if (request.method === "GET") {
      const webpPath = PNG_TO_WEBP[path];
      if (webpPath) {
        const webp = await serveWebpFromGitHub(webpPath, ctx);
        if (webp.ok) return webp;
      }
    }

    if (request.method === "GET" && path.startsWith("/_next/static/")) {
      const cache = caches.default;
      const hit = await cache.match(request);
      if (hit) return hit;
      const origin = await fetchOrigin(request, ORIGIN_TIMEOUT_MS);
      if (origin.ok) {
        const cached = new Response(origin.body, {
          status: origin.status,
          headers: {
            ...Object.fromEntries(origin.headers),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
        ctx.waitUntil(cache.put(request, cached.clone()));
        return cached;
      }
      return origin;
    }

    if (request.method === "GET" && HTML_CACHE_PATHS.has(path)) {
      return cacheHtmlResponse(request, ctx);
    }

    if (request.method === "GET" && path.startsWith("/products/") && !path.match(/\.[a-z0-9]+$/i)) {
      return cacheHtmlResponse(request, ctx);
    }

    return fetch(request);
  },

  /** Cron: warm PDP cache. Enable in Workers → Triggers → every 5 minutes */
  async scheduled(event, env, ctx) {
    const base = "https://layalibeauty.shop";
    ctx.waitUntil(
      Promise.all([
        fetch(`${base}${MAIN_PDP}`),
        fetch(`${base}/products/aroma-flame-lamp`),
      ]),
    );
  },
};
