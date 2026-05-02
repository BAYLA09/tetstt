import { products } from "@/lib/products";
import { ProductCta } from "@/components/ProductCta";

export const metadata = { title: "عروض ليالي بيوتي" };
export default function CollectionsPage() {
  return <main className="section"><div className="container"><h1>عروض ليالي بيوتي</h1><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18 }}>{products.map((product) => <article className="card" style={{ padding: 18 }} key={product.sku}><div className="placeholder" /><p className="stars">★★★★★</p><span className="badge">{product.badge || product.scarcity}</span><h2>{product.name}</h2><p>{product.heading}</p><p>{product.subheading}</p><strong>AED {product.price}</strong><br /><ProductCta product={product} /></article>)}</div></div></main>;
}
