# Product and Offer Brief

## Brand and market

- Brand: Layali Beauty / ليالي بيوتي.
- Domain: `layalibeauty.shop`.
- API domain: `api.layalibeauty.shop`.
- Market: UAE women.
- Language: Arabic RTL with Gulf/KSA-friendly wording.
- Model: premium branded DTC store, COD only.

## ICP

UAE-based Arabic-speaking women, roughly 23-45, buying from TikTok, Snapchat, Instagram, boutiques, mall kiosks, Noon, and Amazon. They trust COD, clear UAE delivery, WhatsApp/contact support, reviews, premium packaging, ingredient/usage education, and visible brand authority. They want فخامة، نعومة، رائحة راقية، حضور مرتب، وثقة بدون ما يحسون أنهم اشتروا منتج عشوائي.

Core objections:

- `غالي`: justify with brand ritual, packaging, curation, proof, and COD safety.
- `هل يوصل؟`: repeat UAE delivery + confirmation before shipping.
- `هل المنتج موثوق؟`: show reviews, support, usage instructions, QC promise.
- `هل مناسب لي؟`: explain notes/ingredients carefully without medical claims.

## Products and prices

| SKU | Arabic name | Price | Role |
|---|---|---:|---|
| `LB-BUNDLE-299` | باقة ليالي بيوتي الفاخرة | AED 299 | Main premium offer |
| `LB-BUNDLE-249` | باقة ليالي بيوتي الفاخرة | AED 249 | Fallback test if price resistance is high |
| `LB-BUNDLE-349` | باقة ليالي بيوتي الفاخرة | AED 349 | Premium test if packaging/creative is strong |
| `LB-SERUM-MUSK-59` | سيروم مسك المطر الأبيض | AED 59 | Add-on/refill |
| `LB-SERUM-OUD-69` | سيروم عود قصر دبي | AED 69 | Higher perceived-value add-on |
| `LB-SERUM-SET-99` | ثنائي السيروم الفاخر | AED 99 | Cart cross-sell, compare at AED 128 |
| `LB-UPSELL-MUSK-39` | سيروم مسك المطر الأبيض - عرض خاص | AED 39 | Post-submit one-time upsell |
| `LB-UPSELL-OUD-39` | سيروم عود قصر دبي - عرض خاص | AED 39 | Post-submit one-time upsell |

## Offer rules

- Default hero offer: `LB-BUNDLE-299`.
- Product CTA: `أضيفي العرض للسلة`.
- Product CTA behavior: add selected offer to cart and immediately open cart drawer.
- Cart CTA: `إتمام الطلب`, opens checkout popup.
- Checkout fields: name and valid UAE mobile phone only.
- After valid checkout submit: save order first, then show one-time AED 39 upsell for 10-15 seconds.
- The AED 39 upsell is the only discounted product placement.
- Thank-you page confirms COD order and next steps.

## Cross-sell rules

- If cart has main bundle, show `LB-SERUM-SET-99`.
- If cart has musk only, show oud and refill set.
- If cart has oud only, show musk and refill set.
- If cart total is below AED 299, show main bundle upgrade.
- Cross-sell copy should explain the reason: `الأكثر إضافة مع الباقة`, `بدل AED 128، خذيهما بـ AED 99`.

## Claims policy

Use proof-backed, non-medical language:

- `مختارة بعناية لتناسب الذوق الخليجي.`
- `تجربة عناية فاخرة للاستخدام اليومي حسب الإرشادات.`
- `تغليف أنيق وتجربة طلب واضحة داخل الإمارات.`

Avoid unverified claims:

- `يعالج`, `يبيض`, `يزيل نهائياً`, `مضمون 100%`, `معتمد طبياً`, `خالي من الحساسية`, fake certification badges.
