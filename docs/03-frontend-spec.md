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
- COD only.
- Product CTA adds selected offer to cart and opens cart drawer.
- Cart CTA opens checkout popup.
- Checkout has only name and phone.
- After valid submit, show one-time AED 39 upsell for 10-15 seconds, then thank-you.

## Pages

Home `/`, collection `/collections`, product pages for all offers, about, contact, and thank-you must use Arabic metadata and premium RTL layouts.

## Cart drawer

Must include item list, quantity controls, total, COD microcopy, cross-sells, and CTA `إتمام الطلب`.

## Checkout popup

Fields are name and UAE phone only. Accepted formats: `05XXXXXXXX`, `5XXXXXXXX`, `+9715XXXXXXXX`, `009715XXXXXXXX`. Normalize to `+9715XXXXXXXX`.

## Upsell modal

Show only after order is saved. AED 39. Visible 10-15 second timer. Copy: `عرض خاص يظهر مرة واحدة فقط مع طلبك الحالي`.
