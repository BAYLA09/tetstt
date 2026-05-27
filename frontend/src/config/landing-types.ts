import type { businessConfig } from "./business";

export type BusinessConfig = typeof businessConfig;

export type LandingOffer = {
  id: string;
  sku: string;
  quantity: number;
  label: string;
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  defaultSelected?: boolean;
};

export type LandingUpsell = {
  enabled: boolean;
  sku: string;
  name: string;
  price: number;
  label: string;
  subtitle: string;
};

export type LandingImages = {
  heroBeforeAfter: string;
  heroProduct: string;
  problemImage: string;
  ingredientImage: string;
  authorityImage: string;
  lifestyleImage: string;
  testimonialImage: string;
  comparisonImage: string;
};

export type LandingImageAlts = Record<keyof LandingImages, string>;

export type AuthorityConfig = {
  certifications: string[];
  expertTitle: string;
  expertQuote: string;
  stats: { value: string; label: string }[];
};

export type TimelineEntry = { label: string; text: string };

export type TestimonialEntry = {
  quote: string;
  name: string;
  meta: string;
  avatarLetter: string;
};

export type FailureAlternative = {
  title: string;
  priceHint: string;
  points: string[];
};

export type ProblemAgitationCard = {
  pain: string;
  solution: string;
};

export type IngredientCard = {
  name: string;
  dosage?: string;
  benefit: string;
  proof: string;
};

export type FaqCategory = {
  category: string;
  items: { q: string; a: string }[];
};

export type ComparisonRow = {
  label: string;
  self: string;
  other: string;
};

export type UsageConfig = {
  headline: string;
  steps: string[];
};

export type DeliveryConfig = {
  cities: string[];
  carriers: string[];
};

/** All marketing strings live in config — components only render props. */
export type LandingProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  routineNameLocal: string;
  routineNameEnglish: string;
  category: string;
  format: string;
  targetCustomer: string;
  problem: string;
  emotionalPain: string;
  desiredOutcome: string;
  mainIngredient: string;
  ingredientStack: (string | IngredientCard)[];
  mechanism: string;
  cardHeadline: string;
  cardSubheadline: string;
  heroHeadline: string;
  heroSubheadline: string;
  rating: string;
  reviewsCount: string;
  badges: [string, string, string, string];
  offers: LandingOffer[];
  upsell: LandingUpsell;
  images: LandingImages;
  imageAlts: LandingImageAlts;
  exclusions: string[];
  authority: AuthorityConfig;
  timeline: TimelineEntry[];
  testimonials: TestimonialEntry[];
  failureAlternatives: FailureAlternative[];
  problemAgitation: ProblemAgitationCard[];
  mechanismCards: { title: string; body: string }[];
  scarcityLine: string;
  proofInsight?: { value: string; label: string; source?: string };
  comparisonIntro: { kicker: string; headline: string; sub: string };
  comparisonRows: ComparisonRow[];
  offerRecapBullets: string[];
  usage?: UsageConfig;
  faq: FaqCategory[];
  delivery: DeliveryConfig;
  relatedSlugs: string[];
  /** Main pain section headline + sub (UAE Arabic, editable). */
  painSection: { headline: string; subheadline: string };
  whyDifferentHeadline: string;
  whyDifferentSub: string;
  notInsideIntro: string;
  guaranteeSteps: [string, string, string];
  /**
   * Ordered PDP hero photos: first entry is the main image; the rest render below in the same order.
   * When set, this takes precedence over the empty `images.heroBeforeAfter` placeholder layout.
   */
  heroGallery?: readonly string[];
  /** Parallel alt text for each `heroGallery` URL (missing entries fall back to `imageAlts.heroProduct`). */
  heroGalleryAlts?: readonly string[];
};
