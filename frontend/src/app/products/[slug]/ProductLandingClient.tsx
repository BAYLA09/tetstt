"use client";

import dynamic from "next/dynamic";
import type { LandingProduct } from "@/config/landing-types";

const ProductLandingView = dynamic(
  () => import("@/components/product-landing/ProductLandingView").then((m) => m.ProductLandingView),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[88vh] bg-[var(--cream-50)]" aria-busy="true" aria-label="جاري تحميل الصفحة">
        <div className="border-b bg-[var(--emerald-950)] px-4 py-3">
          <div className="mx-auto h-4 max-w-lg animate-pulse rounded-full bg-white/15" />
        </div>
        <div className="mx-auto max-w-lg px-4 py-6">
          <div className="h-[420px] animate-pulse rounded-[2rem] bg-white/80 shadow-inner" />
            <div className="mt-6 space-y-3">
            <div className="h-6 w-[75%] animate-pulse rounded-lg bg-white/90" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-white/70" />
            <div className="h-4 w-[83%] animate-pulse rounded-lg bg-white/70" />
          </div>
        </div>
      </div>
    ),
  },
);

export function ProductLandingClient({ product }: { product: LandingProduct }) {
  return <ProductLandingView product={product} />;
}
