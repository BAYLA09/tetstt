import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { businessConfig } from "@/config/business";
import { getLandingProduct, landingSlugs } from "@/config/products";
import {
  DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC,
  DUBAI_PALACE_OUD_SERUM_SLUG,
} from "@/lib/dubai-palace-oud-serum-image";
import { ProductLandingView } from "@/components/product-landing/ProductLandingView";

export function generateStaticParams() {
  return landingSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  if (slug === DUBAI_PALACE_OUD_SERUM_SLUG) {
    preload(DUBAI_PALACE_OUD_SERUM_IMAGE_1_SRC, { as: "image", fetchPriority: "high" });
  }
  return <ProductLandingView product={product} />;
}
