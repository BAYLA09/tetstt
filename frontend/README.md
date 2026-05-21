# Layali Beauty Frontend

Arabic RTL Next.js storefront for `layalibeauty.shop`.

## Local development

```sh
npm install
npm run dev -- --host 0.0.0.0
```

## Environment

Copy `.env.example` to `.env.local` and adjust values.

### Checkout → Google Sheets

Successful checkouts POST JSON to `CHECKOUT_SHEET_WEBHOOK_URL` via the same-origin route `POST /api/checkout-sheet` (so the browser does not hit cross-origin CORS limits on `script.google.com`). The payload uses: `date`, `orderid`, `country`, `name`, `phone`, `product`, `url`, `sku`, `quantity`, `totalprice`, `currency`, `status`. If `CHECKOUT_SHEET_WEBHOOK_URL` is unset, the proxy returns `{ ok: true, skipped: true }` and checkout is unchanged.

## Sheet template

The order sheet CSV template is available at:

```text
public/sheet-template/orders_layali_beauty_store.csv
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
