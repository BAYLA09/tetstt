/**
 * Dubai Palace Oud serum — merchant PNGs under `public/products/` (exact filenames, no edits in code).
 */
export const DUBAI_PALACE_OUD_SERUM_SLUG = "dubai-palace-oud-serum" as const;

export const DUBAI_PALACE_OUD_SERUM_IMAGE_VERSION = "merchant-stack-v2" as const;

const v = `?v=${DUBAI_PALACE_OUD_SERUM_IMAGE_VERSION}`;

/** Serum PDP stack top → bottom (user order). */
export const DUBAI_PALACE_OUD_SERUM_PDP_IMAGE_SRCS = [
  `/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.png${v}`,
  `/products/adskull-image-567929c2-6d4a-480a-b0ec-54eb2889257b.png${v}`,
  `/products/dubai-palace-oud-serum.png${v}`,
] as const;

/** Cards, OG/Twitter, preload — first PDP image. */
export const DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PDP_IMAGE_SRCS[0];

export const DUBAI_PALACE_OUD_SERUM_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC;
