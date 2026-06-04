/**
 * Layali Beauty — Cloudflare Worker (NO EasyPanel rebuild required)
 *
 * Paste in Cloudflare Dashboard → Workers → Create → HTTP handler
 * Route: layalibeauty.shop/products/*  AND  layalibeauty.shop/img-diffuser-card*
 *
 * Fixes: 1MB+ PNGs served from slow origin → 67KB WebP from GitHub (cached at edge).
 * Update GITHUB_BRANCH if you rename the deploy branch.
 */
const GITHUB_BRANCH = "main";
const GITHUB_REPO = "BAYLA09/tetstt";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/frontend/public`;

/** Live PDP PNG paths → WebP path under frontend/public in GitHub */
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

function pathnameWithoutQuery(url) {
  const path = url.pathname;
  const q = path.indexOf("?");
  return q === -1 ? path : path.slice(0, q);
}

async function serveWebpFromGitHub(webpPath, ctx) {
  const upstream = `${GITHUB_RAW}${webpPath}`;
  const cache = caches.default;
  const cacheKey = new Request(upstream, { method: "GET" });
  let response = await cache.match(cacheKey);
  if (response) return response;

  response = await fetch(upstream, {
    cf: { cacheTtl: 604800, cacheEverything: true },
  });
  if (!response.ok) return response;

  response = new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Layali-Image-Source": "github-webp",
    },
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = pathnameWithoutQuery(url);

    const webpPath = PNG_TO_WEBP[path];
    if (webpPath && request.method === "GET") {
      const webp = await serveWebpFromGitHub(webpPath, ctx);
      if (webp.ok) return webp;
    }

    // Fallback: proxy to origin but cache static product images at edge
    if (path.startsWith("/products/") && request.method === "GET") {
      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) return cached;

      const origin = await fetch(request, { cf: { cacheTtl: 86400 } });
      if (origin.ok) {
        const toCache = new Response(origin.body, {
          status: origin.status,
          headers: {
            ...Object.fromEntries(origin.headers),
            "Cache-Control": "public, max-age=86400",
          },
        });
        ctx.waitUntil(cache.put(request, toCache.clone()));
        return toCache;
      }
      return origin;
    }

    return fetch(request);
  },
};
