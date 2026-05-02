import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "مجموعة ليالي بيوتي | عروض فاخرة بالدفع عند الاستلام",
};

export default function CollectionsPage() {
  return (
    <section className="section bg-[var(--cream-50)]">
      <div className="container-layali">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">مجموعة ليالي</span>
          <h1 className="mt-4 text-4xl font-bold text-[var(--emerald-950)] md:text-6xl">
            اختاري العرض اللي يكمل روتينك
          </h1>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            باقات وسيرومات مختارة للمرأة التي تحب الرائحة الراقية والتجربة
            الواضحة داخل الإمارات.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
