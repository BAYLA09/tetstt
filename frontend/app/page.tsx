import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCta } from "@/components/ProductCta";

export default function HomePage() {
  const bundle = products[0];
  return <main>
    <section className="section"><div className="container grid-2"><div><span className="badge">الدفع عند الاستلام داخل الإمارات</span><h1 style={{ fontSize: "clamp(34px, 7vw, 64px)", lineHeight: 1.15 }}>فخامة هادئة تبدأ من تفاصيل العناية اليومية</h1><p style={{ color: "var(--muted)", fontSize: 19 }}>باقة مختارة للمرأة التي تحب النظافة، النعومة، والرائحة الراقية. تجربة عربية فاخرة مع دفع عند الاستلام داخل الإمارات.</p><ProductCta product={bundle} label="اطلبي الباقة الآن" /></div><div className="placeholder" aria-label="باقة ليالي بيوتي الفاخرة" /></div></section>
    <section className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>{["الدفع عند الاستلام", "توصيل داخل الإمارات", "تأكيد قبل الشحن", "تغليف أنيق"].map((item) => <div className="card" style={{ padding: 18 }} key={item}>{item}</div>)}</section>
    <section className="section"><div className="container"><p className="stars">★★★★★</p><h2>اختيار نساء يحبون الروائح الراقية والتفاصيل النظيفة بدون مبالغة.</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>{products.map((product) => <article className="card" style={{ padding: 18 }} key={product.sku}><div className="placeholder" /><span className="badge">{product.badge || "عرض محدود"}</span><h3>{product.name}</h3><p>{product.heading}</p><strong>AED {product.price}</strong><br /><ProductCta product={product} /></article>)}</div></div></section>
    <InfoSections />
    <section className="section"><div className="container card" style={{ padding: 28 }}><h2>أسئلة شائعة</h2>{["هل الدفع عند الاستلام؟ نعم، ما تحتاجين تدفعين الآن.", "متى يتم تأكيد الطلب؟ يتواصل الفريق قبل الشحن.", "هل المنتجات مناسبة للاستخدام اليومي؟ استخدميها حسب الإرشادات وجربي كمية بسيطة للبشرة الحساسة."].map((faq) => <p key={faq}>{faq}</p>)}<Link className="btn" href="/collections">شاهدي كل العروض</Link></div></section>
  </main>;
}

function InfoSections() { return <><section className="section"><div className="container grid-2"><div className="placeholder" /><div><h2>ليست منتجات عادية تُضاف للسلة.</h2><p>هذه طقوس عناية صغيرة تعطي يومك لمسة فخامة هادئة، مع وضوح في الطلب وتأكيد قبل الشحن.</p></div></div></section><section className="section"><div className="container grid-2"><div><h2>طريقة استعمال واضحة مع كل طلب</h2><p>مختارة بعناية لتناسب الذوق الخليجي، وتغليف أنيق يحافظ على تجربة الاستلام.</p></div><div className="placeholder" /></div></section></>; }
