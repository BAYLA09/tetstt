# Design System

## Visual direction

Premium Arabic beauty brand, not marketplace dropshipping.

Keywords:

- Soft luxury
- UAE femininity
- Cream/gold/rose warmth
- Clean product photography
- Calm confidence

## Colors

Use CSS variables.

```css
--background: #fffaf3;
--surface: #ffffff;
--surface-warm: #f8efe3;
--text: #1f1712;
--muted: #7a6a5f;
--gold: #b88a44;
--gold-dark: #8a642e;
--rose: #d8a7a0;
--oud: #2b1c16;
--success: #2f7d50;
--danger: #b42318;
```

## Typography

Recommended fonts:

- Arabic: `IBM Plex Sans Arabic`, `Noto Kufi Arabic`, or `Tajawal`.
- English/numbers: inherit or `Inter`.

Rules:

- Arabic headlines need generous line-height.
- Use bold sparingly for premium feel.
- Avoid tiny text on mobile.

## Layout

- Max content width: 1180-1240px.
- Mobile padding: 16px.
- Desktop section padding: 72-96px vertical.
- Use alternating two-column layouts on desktop.
- Stack image then text on mobile unless the CTA needs to appear first.

## Components

### Buttons

Primary:

- gold background
- dark text or white depending contrast
- rounded full or 16px
- large tap target

Secondary:

- transparent/cream
- gold border

### Cards

Product cards:

- soft shadow
- cream/white surface
- rounded 24px
- image area with warm gradient
- badge top corner

### Badges

Use for:

- `الأكثر طلباً`
- `الدفع عند الاستلام`
- `عرض محدود`
- `توصيل داخل الإمارات`

### Drawer/dialog

- RTL layout.
- Close button on visual right for Arabic layout.
- Focus trap.
- Escape close.
- Scroll lock.
- Sticky CTA at bottom.

## Image placeholders

Until real images arrive:

- Use generated premium mockup blocks or static placeholder assets.
- Show bottle silhouettes, cream background, Arabic label placeholder.
- Never use random low-quality stock images.

Suggested alt text:

- `باقة ليالي بيوتي الفاخرة`
- `سيروم مسك المطر الأبيض`
- `سيروم عود قصر دبي`

## Responsive rules

- Test at 360px, 390px, 430px, 768px, 1024px, 1440px.
- Sticky mobile CTA must not cover required content; add bottom padding.
- Cart drawer full-screen on mobile, side drawer on desktop.
- Checkout popup full-screen or near full-screen on small mobile.

## Animation

Use subtle animation only:

- Drawer slide.
- Modal fade/scale.
- CTA hover.
- Review carousel if light.

Avoid heavy parallax, autoplay sound, or animation that delays CTA.
