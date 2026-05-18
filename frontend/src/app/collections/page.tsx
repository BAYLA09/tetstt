import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "العروض | ليالي بيوتي",
  description: "موقد الجو الجاف وعود قصر دبي — عروض واضحة والدفع عند الاستلام في الإمارات.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-[var(--cream-50)] px-4 py-16">
      <div className="container-grid">
        <div className="mx-auto max-w-3xl text-center">
          <p className="badge">ليالي بيوتي</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-[var(--emerald-950)] md:text-5xl">عروض مختارة بعناية</h1>
          <p className="mt-4 text-lg leading-9 text-[var(--muted)]">
            قطعتان تكملان روتين الجفاف والجو في بيت الخليج: ترطيب البشرة مع عود قصر دبي، وتلطيف أجواء الغرفة مع موقد
            الجو الجاف. الدفع عند الاستلام داخل الإمارات.
          </p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
