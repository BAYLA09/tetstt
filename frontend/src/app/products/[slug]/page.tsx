import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { businessConfig } from "@/config/business";
import { getLandingProduct, landingSlugs } from "@/config/products";
import { ProductLandingView } from "@/components/product-landing/ProductLandingView";
import {
  DUBAI_PALACE_OUD_SERUM_IMAGE_ORDER,
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
    const origin = businessConfig.site.origin;
    const ogImages = DUBAI_PALACE_OUD_SERUM_IMAGE_ORDER.map((path) => ({
      url: new URL(path, origin).href,
      alt: product.name,
    }));
    const twitterImages = DUBAI_PALACE_OUD_SERUM_IMAGE_ORDER.map((path) => new URL(path, origin).href);
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: twitterImages,
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
      <>
        {DUBAI_PALACE_OUD_SERUM_IMAGE_ORDER.map((href, i) => (
          <link key={`dubai-oud-serum-img-${i}`} rel="preload" as="image" href={href} />
        ))}
      </>
    ) : null;

  return (
    <>
      {serumPreload}
      <ProductLandingView product={product} />
    </>
  );
}
