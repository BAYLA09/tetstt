import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";
import type { Product } from "@/lib/products";
import type { ProductContent } from "@/lib/product-content";

type Props = {
  product: Product;
  content: ProductContent;
};

/** Hero lifestyle shot + before/after + stat — shown above the buy card for lamp CRO flow. */
export function ProductLeadStory({ product, content }: Props) {
  return (
    <>
      <div className="hero-gradient relative overflow-hidden px-0 pb-2 pt-6 lg:px-4 lg:pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,150,69,0.2),transparent_32%)]" />
        <div className="relative w-screen max-w-none shrink-0 bg-[rgba(0,20,14,0.35)] mx-[calc(50%-50vw)] lg:mx-auto lg:w-full lg:max-w-[1180px] lg:overflow-hidden lg:rounded-[2.5rem] lg:bg-transparent">
          <Image
            src={product.image}
            alt={product.name}
            width={1536}
            height={1024}
            className="h-auto w-full object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, min(1180px, 90vw)"
          />
        </div>
      </div>

      <section className="bg-[var(--cream-50)] px-4 py-16">
        <div className="container-grid">
          <div className="section-heading">
            <span className="eyebrow">قبل وبعد</span>
            <h2 className="mt-4">{content.problemHeadline}</h2>
            <p className="mt-3">{content.problemSub}</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2" dir="ltr">
            <div className="overflow-hidden rounded-[2rem] border-2 border-red-200 bg-white">
              <div className="relative aspect-[4/3] w-full bg-[var(--cream-100)]">
                {product.beforeImage ? (
                  <Image
                    src={product.beforeImage}
                    alt={content.beforeLabel}
                    fill
                    sizes="(max-width:768px) 100vw,50vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                  <X size={14} /> قبل — {content.beforeLabel}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border-2 border-[var(--gold-400)] bg-white">
              <div className="relative aspect-[4/3] w-full bg-[var(--cream-100)]">
                {product.afterImage ? (
                  <Image
                    src={product.afterImage}
                    alt={content.afterLabel}
                    fill
                    sizes="(max-width:768px) 100vw,50vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-[var(--gold-500)]/90 px-4 py-2 text-sm font-bold text-[var(--emerald-950)] backdrop-blur-sm">
                  <CheckCircle2 size={14} /> بعد — {content.afterLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {content.stat && (
        <section className="bg-[var(--emerald-950)] px-4 py-14">
          <div className="container-grid">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--emerald-950)]">
                <Image
                  src={content.stat.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-contain object-top"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--emerald-950)] to-transparent" />
              </div>
              <div className="relative -mt-1 bg-[var(--emerald-950)] px-6 pb-6 pt-3">
                <div className="flex items-start gap-5">
                  <div className="flex-1">
                    <p className="text-lg font-bold leading-8 text-white md:text-xl">{content.stat.text}</p>
                    <p className="mt-2 text-xs text-white/40">{content.stat.source}</p>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-[var(--gold-500)] px-5 py-3 text-center shadow-lg">
                    <p className="text-2xl font-bold text-[var(--emerald-950)] md:text-3xl">{content.stat.number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
