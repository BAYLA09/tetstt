# Design System

## Visual direction

Premium Arabic beauty brand, not marketplace dropshipping.

Keywords:

- Soft luxury
- UAE femininity
- Deep emerald and warm gold from the Layali Beauty logo
- Clean product photography
- Calm confidence

## Logo-led brand direction

The supplied Layali Beauty logo is the source of truth for the visual system:

- Primary background: deep emerald green.
- Primary accent: warm metallic gold.
- Mood: premium night luxury, moon/stars, elegant Arabic beauty, high-price authority.
- Use cream only as a soft content surface, not as the main brand color.
- Avoid pink/rose-led layouts; they make the brand feel generic beauty instead of owned and premium.

## Colors

Use CSS variables. The entire store should feel built from the logo palette.

```css
--emerald-950: #013f2a;
--emerald-900: #06472f;
--emerald-800: #0b5739;
--gold-500: #c99645;
--gold-400: #d9ad63;
--gold-300: #ebc982;
--cream-50: #fff8ec;
--cream-100: #f7ead7;
--ink: #18130d;
--muted: #7b705f;
--surface: #ffffff;
--surface-dark: #063824;
--border-gold: rgba(201, 150, 69, 0.34);
--success: #2f7d50;
--danger: #b42318;
```

Usage rules:

- Header, footer, hero, announcement bar, cart CTA area, and major authority sections should use emerald.
- Primary CTAs should use gold on emerald or emerald text on gold.
- Product cards can use cream/white surfaces with gold borders and emerald headings.
- Scarcity and premium badges should use emerald fill with gold text/border.
- Never introduce a competing primary color.

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
- cream/white surface with emerald headings
- rounded 24px
- image area with emerald-to-gold or cream-to-gold gradient
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
- Show bottle silhouettes, emerald/gold backgrounds, Arabic label placeholder.
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
