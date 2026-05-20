import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { businessConfig } from "@/config/business";
import { getLandingProduct, landingSlugs } from "@/config/products";
import { ProductLandingView } from "@/components/product-landing/ProductLandingView";
import {
  DUBAI_PALACE_OUD_SERUM_IMAGE_SRC,
  DUBAI_PALACE_OUD_SERUM_SLUG,
} from "@/lib/dubai-palace-oud-serum-image";

export function generateStaticParams() {
  return landingSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getLandingProduct(slug);
  const title = product ? `${product.name} | ${businessConfig.brand.nameLocal}` : businessConfig.brand.nameLocal;
  const description = product?.cardSubheadline ?? businessConfig.brand.description;

  if (slug === DUBAI_PALACE_OUD_SERUM_SLUG && product) {
    const ogUrl = new URL(DUBAI_PALACE_OUD_SERUM_IMAGE_SRC, businessConfig.site.origin).href;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogUrl, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogUrl],
      },
    };
  }

  return { title, description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getLandingProduct(slug);
  if (!product) {
    notFound();
  }

  const serumPreload =
    slug === DUBAI_PALACE_OUD_SERUM_SLUG ? (
      <link key="dubai-oud-serum-hero-preload" rel="preload" as="image" href={DUBAI_PALACE_OUD_SERUM_IMAGE_SRC} />
    ) : null;

  return (
    <>
      {serumPreload}
      <ProductLandingView product={product} />
    </>
  );
}
