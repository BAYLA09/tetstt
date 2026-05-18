import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductHero } from "@/components/ProductHero";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/** Slugs not in `generateStaticParams` return 404 (no on-demand pages for removed products). */
export const dynamicParams = false;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} | ليالي بيوتي` : "ليالي بيوتي",
    description: product?.subheading,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))]">
      <ProductHero key={slug} product={product} />
      <section className="border-t border-[var(--border-gold)] bg-[var(--cream-50)] px-4 py-10">
        <div className="container-grid text-center" dir="rtl">
          <p className="text-sm font-bold text-[var(--muted)]">
            نفس فكرة الهوم: القصة والثقة هناك، واختيار العرض هنا فقط.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-[var(--border-gold)] px-6 py-3 text-sm font-black text-[var(--emerald-950)] transition hover:bg-white"
          >
            العودة للرئيسية
          </Link>
        </div>
      </section>
    </div>
  );
}
