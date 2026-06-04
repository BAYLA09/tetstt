/**
 * Dubai Palace Oud serum — WebP via jsDelivr CDN (bypasses slow EasyPanel origin).
 * Images load from GitHub edge CDN even when layalibeauty.shop origin is ~20s.
 */
export const DUBAI_PALACE_OUD_SERUM_SLUG = "dubai-palace-oud-serum" as const;

export const DUBAI_PALACE_OUD_SERUM_IMAGE_VERSION = "merchant-stack-v8-cdn" as const;

const CDN_BASE = `https://cdn.jsdelivr.net/gh/BAYLA09/tetstt@main/frontend/public`;
const v = `?v=${DUBAI_PALACE_OUD_SERUM_IMAGE_VERSION}`;

/** 1 — top of page (hero). */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC =
  `${CDN_BASE}/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.webp${v}` as const;

/** 2 — after COD/trust icons, before insight block. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_2_SRC =
  `${CDN_BASE}/products/adskull-image-567929c2-6d4a-480a-b0ec-54eb2889257b.webp${v}` as const;

/** 3 — above mechanism block + home ProductCard. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_3_SRC =
  `${CDN_BASE}/products/dubai-palace-oud-serum.webp${v}` as const;

export const DUBAI_PALACE_OUD_SERUM_HOME_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_IMAGE_3_SRC;

export const DUBAI_PALACE_OUD_SERUM_PDP_IMAGE_SRCS = [
  DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC,
  DUBAI_PALACE_OUD_SERUM_IMAGE_2_SRC,
  DUBAI_PALACE_OUD_SERUM_IMAGE_3_SRC,
] as const;

export const DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC;
export const DUBAI_PALACE_OUD_SERUM_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC;
