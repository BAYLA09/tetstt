/** DOM id for sticky CTA smooth-scroll target (offer chooser in ProductHero). */
export const PRODUCT_OFFER_ANCHOR_ID = "product-offer-anchor";

export type StickyCtaCopy = {
  /** One-line emotional hook above the button */
  supportingLine: string;
  buttonLabel: string;
};

export function getStickyCtaCopy(slug: string): StickyCtaCopy {
  if (slug === "aroma-flame-lamp") {
    return {
      supportingLine: "جو ناشف من المكيف؟ حوّلي غرفتك الليلة — ضباب بارد خفيف، ضوء هادئ، وعود يلفّ المكان.",
      buttonLabel: "اختاري عرض الليلة",
    };
  }
  if (slug === "dubai-palace-oud-serum") {
    return {
      supportingLine:
        "بشرة تشدّ والمكياج ما يثبت على وشج؟ رجّعي نعومة ولمعة من أول طبقات — روتين عود دبي الفاخر.",
      buttonLabel: "اختاري عرضج الآن",
    };
  }
  return {
    supportingLine: "اختاري العرض المناسب وثبّتي الطلب بدون دفع إلكتروني.",
    buttonLabel: "شوفي العرض واختاري",
  };
}
