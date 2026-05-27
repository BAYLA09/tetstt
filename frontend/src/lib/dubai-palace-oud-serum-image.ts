/**
 * Dubai Palace Oud serum — three merchant PNGs at separate scroll positions on the PDP.
 */
export const DUBAI_PALACE_OUD_SERUM_SLUG = "dubai-palace-oud-serum" as const;

export const DUBAI_PALACE_OUD_SERUM_IMAGE_VERSION = "merchant-stack-v6" as const;

const v = `?v=${DUBAI_PALACE_OUD_SERUM_IMAGE_VERSION}`;

/** 1 — top of page (hero). */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC =
  `/products/adskull-image-3b76093b-906d-4b09-aacb-43ddddbf92e1.png${v}` as const;

/** 2 — after COD/trust icons, before 78% insight block. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_2_SRC =
  `/products/adskull-image-567929c2-6d4a-480a-b0ec-54eb2889257b.png${v}` as const;

/** 3 — above «ليش الروتين يشتغل معج بطريقة مختلفة؟» (before MechanismBlock) + home ProductCard. */
export const DUBAI_PALACE_OUD_SERUM_IMAGE_3_SRC = `/products/dubai-palace-oud-serum.png${v}` as const;

export const DUBAI_PALACE_OUD_SERUM_HOME_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_IMAGE_3_SRC;

export const DUBAI_PALACE_OUD_SERUM_PDP_IMAGE_SRCS = [
  DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC,
  DUBAI_PALACE_OUD_SERUM_IMAGE_2_SRC,
  DUBAI_PALACE_OUD_SERUM_IMAGE_3_SRC,
] as const;

export const DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC;
export const DUBAI_PALACE_OUD_SERUM_IMAGE_SRC = DUBAI_PALACE_OUD_SERUM_PRIMARY_IMAGE_SRC;
