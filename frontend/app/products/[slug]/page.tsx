import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { ProductCta } from "@/components/ProductCta";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const product = getProduct((await params).slug); return { title: product ? `${product.name} | ليالي بيوتي` : "منتج ليالي بيوتي", description: product?.heading }; }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug); if (!product) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.name, brand: { "@type": "Brand", name: "Layali Beauty" }, offers: { "@type": "Offer", price: product.price, priceCurrency: "AED", availability: "https://schema.org/InStock" } };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><section className="section"><div className="container grid-2"><div className="placeholder" /><div><p className="stars">★★★★★ أكثر اختياراً هذا الأسبوع</p><span className="badge">{product.scarcity}</span><h1 style={{ fontSize: "clamp(32px,6vw,56px)", lineHeight: 1.15 }}>{product.name}</h1><p style={{ color: "var(--muted)", fontSize: 19 }}>{product.heading}</p><h2>AED {product.price}</h2><p>الدفع عند الاستلام داخل الإمارات</p><ProductCta product={product} /><ProductCta product={product} sticky /></div></div></section><ProductSections /></main>;
}

function ProductSections() { const sections = ["مو لازم تنتظرين مناسبة عشان تدللين نفسك.", "فخامة هادئة تعطي يومك حضوراً راقياً.", "مختارة بعناية لتناسب الذوق الخليجي.", "ضعي كمية بسيطة، انتظري اللحظة، واستمتعي بتفاصيل ناعمة.", "الدفع عند الاستلام، والتأكيد قبل الشحن."]; return <>{sections.map((text, index) => <section className="section" key={text}><div className="container grid-2"><div style={{ order: index % 2 ? 2 : 1 }}><h2>{text}</h2><p>كل خطوة واضحة من السلة إلى باب بيتك، بدون وعود مبالغ فيها أو شهادات غير حقيقية.</p></div><div className="placeholder" style={{ order: index % 2 ? 1 : 2 }} /></div></section>)}</>; }
