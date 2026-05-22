/**
 * Dubai Palace Oud serum — static files under `public/products/` (swap on disk; keep paths stable).
 * - Primary: hero, cards, OG/Twitter, preload, /collections
 * - Editorial portrait: serum PDP only, directly under the COD/trust strip (not above it)
 */
export const DUBAI_PALACE_OUD_SERUM_SLUG = "dubai-palace-oud-serum" as const;

export const DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC =
  "/products/dubai-palace-oud-serum.png" as const;

/** Alias for cards, OG/Twitter, preload, and PDP hero. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC;

/** «قبل / المشكلة» — serum PDP only, below الدفع عند الاستلام / التوصيل / الضمان strip. */
export const DUBAI_PALACE_OUD_SERUM_POST_OFFERS_IMAGE_SRC =
  "/products/dubai-palace-oud-serum-hero.png" as const;
