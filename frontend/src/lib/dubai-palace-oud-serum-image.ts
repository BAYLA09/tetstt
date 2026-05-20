/**
 * Dubai Palace Oud serum — fixed two-file order (do not rename on disk).
 * [0] primary: hero, cards, SEO, preload
 * [1] secondary: gallery row below primary on serum PDP
 */
export const DUBAI_PALACE_OUD_SERUM_SLUG = "dubai-palace-oud-serum" as const;

export const DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC =
  "/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.png" as const;

export const DUBAI_PALACE_OUD_SERUM_SECONDARY_IMAGE_SRC =
  "/products/adskull-image-02003faa-dc16-4ce7-9f87-3e4bab8e98d1-5.png" as const;

/** Deterministic public URL order — primary first, secondary second. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_ORDER = [
  DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC,
  DUBAI_PALACE_OUD_SERUM_SECONDARY_IMAGE_SRC,
] as const;

/** Alias: primary only (hero, cards, default OG/Twitter main image). */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC;
