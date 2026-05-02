import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main className="section emerald-panel min-h-[70vh]">
      <div className="container-page grid gap-8 py-16 md:grid-cols-[1fr_0.8fr] md:items-center">
        <section className="card p-8">
          <CheckCircle2 className="mb-4 text-[var(--gold-500)]" size={46} />
          <p className="eyebrow">تم استلام الطلب</p>
          <h1 className="mt-3 text-4xl font-bold text-[var(--emerald-950)]">
            شكراً لك، طلبك محفوظ الآن
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            طلبك بالدفع عند الاستلام. فريق ليالي بيوتي سيتواصل معك لتأكيد التفاصيل قبل الشحن.
          </p>
          <div className="mt-6 rounded-3xl bg-[var(--cream-50)] p-5">
            <p className="text-sm text-[var(--muted)]">رقم الطلب</p>
            <p className="mt-1 text-2xl font-bold text-[var(--emerald-950)]">{orderId}</p>
          </div>
          <Link href="/collections" className="btn-primary mt-7">
            متابعة التسوق
          </Link>
        </section>
        <section className="rounded-[2rem] border border-[var(--border-gold)] bg-[rgba(1,63,42,0.7)] p-8 text-white">
          <h2 className="text-2xl font-bold text-[var(--gold-300)]">الخطوات القادمة</h2>
          <ol className="mt-6 space-y-4 text-white/85">
            <li>1. تأكيد الطلب عبر اتصال أو واتساب.</li>
            <li>2. تجهيز الطلب بتغليف أنيق.</li>
            <li>3. التوصيل داخل الإمارات والدفع عند الاستلام.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
