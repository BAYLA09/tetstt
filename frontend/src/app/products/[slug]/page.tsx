import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { businessConfig } from "@/config/business";
import { getLandingProduct, landingSlugs } from "@/config/products";

const ProductLandingView = dynamic(
  () =>
    import("@/components/product-landing/ProductLandingView").then((mod) => mod.ProductLandingView),
  {
    ssr: true,
    loading: () => (
      <div
        className="min-h-[50vh] bg-[#fffaf2]"
        aria-busy="true"
        aria-label="جاري تحميل صفحة المنتج"
      />
    ),
  },
);

export function generateStaticParams() {
  return landingSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getLandingProduct(slug);
  return {
    title: product ? `${product.name} | ${businessConfig.brand.nameLocal}` : businessConfig.brand.nameLocal,
    description: product?.cardSubheadline ?? businessConfig.brand.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getLandingProduct(slug);
  if (!product) {
    notFound();
  }
  return <ProductLandingView product={product} />;
}
