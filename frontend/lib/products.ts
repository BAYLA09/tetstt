export type Product = {
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  price: number;
  badge?: string;
  heading: string;
  subheading: string;
  scarcity: string;
  image: string;
};

export const products: Product[] = [
  { sku: "LB-BUNDLE-299", slug: "luxury-bundle", name: "باقة ليالي بيوتي الفاخرة", shortName: "الباقة الفاخرة", price: 299, badge: "الأكثر طلباً", heading: "رائحة ناعمة، إحساس مرتب، وتفاصيل فاخرة تليق بك.", subheading: "اختيارك الكامل لروتين أنثوي راقٍ ورائحة تبقى في الذاكرة.", scarcity: "دفعة اليوم محدودة حسب توفر المخزون.", image: "/images/placeholders/bundle-1.webp" },
  { sku: "LB-SERUM-SET-99", slug: "serum-refill-set", name: "ثنائي السيروم الفاخر", shortName: "ثنائي السيروم", price: 99, heading: "مسك ناعم وعود راقٍ بسعر أوفر مع طلبك.", subheading: "اختيار عملي للروتين اليومي أو كإضافة تكمل الباقة.", scarcity: "العرض الحالي متاح لفترة محدودة.", image: "/images/placeholders/ritual-1.webp" },
  { sku: "LB-SERUM-MUSK-59", slug: "white-rain-musk-serum", name: "سيروم مسك المطر الأبيض", shortName: "مسك المطر الأبيض", price: 59, heading: "رائحة نظيفة وناعمة تناسب يومك من الصباح للمساء.", subheading: "لمسة مسك هادئة لمحبات النعومة والنظافة الراقية.", scarcity: "قد يتغير السعر بعد انتهاء العرض.", image: "/images/placeholders/musk-serum.webp" },
  { sku: "LB-SERUM-OUD-69", slug: "dubai-palace-oud-serum", name: "سيروم عود قصر دبي", shortName: "عود قصر دبي", price: 69, heading: "لمسة عود راقية لمحبات الحضور الفخم والذوق الخليجي.", subheading: "إحساس خليجي دافئ بدون مبالغة.", scarcity: "دفعة اليوم محدودة حسب توفر المخزون.", image: "/images/placeholders/oud-serum.webp" },
];

export const upsellProduct = { sku: "LB-UPSELL-MUSK-39", name: "سيروم مسك المطر الأبيض - عرض خاص", price: 39 };
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const getProductBySku = (sku: string) => products.find((product) => product.sku === sku);
