/** Single source for market, COD, and visual tokens — edit here only for brand-wide values. */
export const businessConfig = {
  /** Canonical site origin for metadata (`metadataBase`, Open Graph absolute URLs). */
  site: {
    origin: "https://layalibeauty.shop",
  },
  brand: {
    nameLocal: "ليالي بيوتي",
    nameEnglish: "Layali Beauty",
    tagline: "عناية فاخرة بالدفع عند الاستلام داخل الإمارات",
    description:
      "تجربة تسوق عربية للعناية بالبشرة والجو المنزلي في الإمارات، مع تأكيد الطلب قبل الشحن وتوصيل واضح.",
    logoUrl: "",
    iconUrl: "",
  },
  market: {
    countryName: "الإمارات العربية المتحدة",
    countryCode: "AE",
    language: "ar",
    direction: "rtl" as const,
    currency: "AED",
    currencySymbol: "درهم",
    phoneCountryCode: "+971",
    phoneExample: "05 123 4567",
  },
  cod: {
    enabled: true,
    paymentLabel: "الدفع عند الاستلام — بدون دفع إلكتروني مسبق",
    deliveryPromise: "توصيل داخل الإمارات خلال تقريباً 1 إلى 3 أيام عمل (حسب المنطقة).",
    confirmationPromise: "نتواصل معاج لتأكيد الطلب والعنوان قبل ما نجهز الشحنة.",
    returnGuarantee:
      "إذا واجهتي مشكلة تواصلي معنا بعد التسليم؛ نراجع الحالة حسب سياسة الاستبدال/الاسترجاع المعروضة وقت الطلب.",
  },
  design: {
    primaryColor: "#013f2a",
    primaryDarkColor: "#001b12",
    accentColor: "#d9ad63",
    backgroundColor: "#fff8ec",
    cardColor: "#ffffff",
    textColor: "#18130d",
    mutedTextColor: "#7b705f",
    borderColor: "rgba(201, 150, 69, 0.35)",
  },
} as const;

export type BusinessConfig = typeof businessConfig;
