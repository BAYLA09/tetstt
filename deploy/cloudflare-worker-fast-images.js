/**
 * Layali Beauty — Cloudflare Worker v3 (safe passthrough)
 *
 * - PNG → WebP from GitHub
 * - Everything else passes to origin (home page at / works normally)
 */
const GITHUB_BRANCH = "cursor/site-restore-fix-22b5";
const GITHUB_REPO = "BAYLA09/tetstt";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/frontend/public`;

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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "GET") {
      const webpPath = PNG_TO_WEBP[path];
      if (webpPath) {
        const webp = await serveWebpFromGitHub(webpPath, ctx);
        if (webp.ok) return webp;
      }
    }

    return fetch(request);
  },
};
