# Frontend Spec

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS.
- shadcn/ui or Radix primitives for dialogs/drawers.
- Zustand for cart state.
- React Hook Form + Zod for checkout validation.
- Framer Motion only for drawer/modal polish.

## Core rules

- Arabic RTL first.
- Mobile first; TikTok/Snapchat traffic will be mostly mobile.
- Use the uploaded Layali Beauty logo as the visual source of truth: deep emerald green background, warm metallic gold accents, and luxury night/moon cues.
- COD only.
- Product CTA adds selected offer to cart and opens cart drawer.
- Cart CTA opens checkout popup.
- Checkout has only name and phone.
- After valid submit, show one-time AED 39 upsell for 10-15 seconds, then thank-you.

## Pages

### Home `/`

Sections:

1. Announcement bar: `الدفع عند الاستلام داخل الإمارات | عروض محدودة اليوم`.
2. Header: logo, menu, cart, WhatsApp/contact, with emerald background and gold details.
3. Hero: text right and image left on desktop; CTA to bundle; use emerald/gold as the hero identity.
4. Trust row: COD, UAE delivery, confirmation before shipping, elegant packaging.
5. Social proof strip with stars and UAE city cues.
6. Featured bundle card.
7. Emotion/problem section.
8. Product ritual section.
9. Authority/proof section.
10. Reviews carousel.
11. Comparison table.
12. FAQ.
13. Final CTA.
14. Footer.

### Collection `/collections`

Show offers in this order:

1. Main bundle AED 299 with `الأكثر طلباً`.
2. Two-serum refill set AED 99.
3. Musk AED 59.
4. Oud AED 69.

Each card includes image placeholder, Arabic name, stars, emotional heading, proof/usage subheading, price, scarcity badge, and CTA.

### Product pages

Build:

- `/products/luxury-bundle`
- `/products/white-rain-musk-serum`
- `/products/dubai-palace-oud-serum`
- `/products/serum-refill-set`

Required sections:

1. Hero with gallery left/text right on desktop.
2. Stars, reviews, scarcity, offer selector, price, CTA.
3. Sticky mobile CTA.
4. Emotional problem section.
5. Desired identity section.
6. Ingredient/proof section.
7. Usage steps.
8. Social proof.
9. Trust badges.
10. FAQ.
11. Final offer.

Alternate desktop sections: text right/image left, then image right/text left.

### About `/about`

Use brand story, premium curation, UAE-friendly service, COD clarity, and values: `فخامة هادئة، وضوح، عناية، ثقة`.

### Contact `/contact`

Include WhatsApp, email, delivery/confirmation policy, COD FAQ, and optional contact form.

### Thank-you `/thank-you/[orderId]`

Show:

- Order success.
- COD reminder.
- Order summary.
- Confirmation call/WhatsApp expectation.
- Support link.

## Cart drawer

Must include:

- Item list and quantity controls.
- Total.
- Microcopy: `الدفع عند الاستلام - لا تدفعين الآن`.
- Cross-sells:
  - Bundle in cart -> show two-serum refill set AED 99.
  - One serum in cart -> show the other serum and refill set.
  - Cart under AED 299 -> show bundle upgrade.
- CTA: `إتمام الطلب`.

## Checkout popup

Fields:

1. Name: Arabic/English allowed, min 2 chars.
2. UAE phone.

Accepted phone formats:

- `05XXXXXXXX`
- `5XXXXXXXX`
- `+9715XXXXXXXX`
- `009715XXXXXXXX`

Normalize to `+9715XXXXXXXX`. Reject invalid UAE numbers.

Popup content:

- Order summary.
- Social proof line.
- Scarcity line.
- COD reassurance.
- CTA enabled only after valid fields.

## Upsell modal

- Show only after order is saved.
- AED 39.
- Visible 10-15 second timer.
- Copy: `عرض خاص يظهر مرة واحدة فقط مع طلبك الحالي`.
- Buttons:
  - `أضيفيه بـ 39 درهم`
  - `لا شكراً، أكملي طلبي`

## Placeholder images

Add replaceable premium placeholders:

- `public/images/placeholders/hero-layali.webp`
- `public/images/placeholders/bundle-1.webp`
- `public/images/placeholders/musk-serum.webp`
- `public/images/placeholders/oud-serum.webp`
- `public/images/placeholders/ritual-1.webp`

Use deep emerald/gold backgrounds, bottle silhouettes, moon/star accents, and Arabic label placeholders that match the Layali Beauty logo.

## SEO

- Arabic metadata per page.
- Product JSON-LD with brand, price, AED currency, availability.
- Do not add fake aggregate review schema until real reviews exist.
