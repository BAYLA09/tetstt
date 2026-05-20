/**
 * Dubai Palace Oud serum — one static file for hero, cards, OG/Twitter, and preload.
 * The bytes on disk must be the merchant’s original export (no re-encoding in app code).
 * Chat uploads cannot be written into git from the agent: save your file as the filename
 * below under `frontend/public/products/` and commit.
 */
export const DUBAI_PALACE_OUD_SERUM_SLUG = "dubai-palace-oud-serum" as const;

export const DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC =
  "/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.png" as const;

/** Alias for cards, OG/Twitter, preload, and PDP hero. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC;
