"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, PhoneCall, Sparkles, Truck } from "lucide-react";
import { money } from "@/lib/products";
import { readLastCheckoutSnapshot } from "@/lib/order-confirmation-storage";

const OTHER_PRODUCT = {
  href: "/products/dubai-palace-oud-serum",
  title: "سيروم عود قصر دبي",
  blurb: "طلبج فيه الموقد؟ كملي روتين الجفاف بملمس ناعم ورائحة عود على البشرة.",
} as const;

const OTHER_PRODUCT_LAMP = {
  href: "/products/aroma-flame-lamp",
  title: "موقد الجو الجاف — ليالي بيوتي",
  blurb: "طلبج فيه السيروم؟ زيدي للغرفة ضباب بارد وهدوء مع نفس رائحة العود.",
} as const;

function dubaiHour(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value;
  return hour ? parseInt(hour, 10) : 12;
}

function isDubaiCallWindow(date: Date): boolean {
  const h = dubaiHour(date);
  return h >= 9 && h <= 21;
}

function maskPhoneDisplay(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length < 6) return phone;
  return `${d.slice(0, 3)}···${d.slice(-4)}`;
}

export function ThankYouClient({ orderId }: { orderId: string }) {
  const search = useSearchParams();
  const [snapshot, setSnapshot] = useState<ReturnType<typeof readLastCheckoutSnapshot>>(null);

  useEffect(() => {
    const skusRaw = search.get("s");
    const skus = skusRaw ? skusRaw.split(",").filter(Boolean) : [];
    const fromUrl = {
      name: search.get("n")?.trim() || "",
      phone: search.get("p")?.trim() || "",
      total: Number(search.get("t")) || 0,
      skus,
      savedAt: Date.now(),
    };
    if (fromUrl.name && fromUrl.phone) {
      setSnapshot(fromUrl);
      return;
    }
    setSnapshot(readLastCheckoutSnapshot());
  }, [search]);

  const name = snapshot?.name?.trim() || "";
  const phone = snapshot?.phone?.trim() || "";
  const total = snapshot?.total ?? 0;

  const callPlan = useMemo(() => {
    const now = new Date();
    if (isDubaiCallWindow(now)) {
      return {
        badge: "خلال 10 دقائق",
        title: "انتظري مكالمة التأكيد الآن",
        body:
          "فريق ليالي بيوتي يتصل بج خلال أقل من 10 دقائق (توقيت دبي) لتأكيد الاسم والعنوان والعرض. الرقم قد يظهر كـ«غير معروف» — أجيبي عشان نثبت طلبج ونجهز الشحنة بسرعة.",
      };
    }
    return {
      badge: "أول الصباح",
      title: "المكالمة بتكون أول شيء الصبح",
      body:
        "خارج أوقات التأكيد (٩ صباحاً — ٩ مساءً بتوقيت دبي). نكلّمج أول شي بالصبح عشان نأكد الطلب قبل أي تجهيز. احفظي الرقم الغريب: غالباً من عندنا.",
    };
  }, []);

  const hasLamp = snapshot?.skus?.some((sku) => sku.startsWith("LB-LAMP")) ?? false;
  const upsell = hasLamp ? OTHER_PRODUCT : OTHER_PRODUCT_LAMP;

  return (
    <div className="pb-16 pt-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border-gold)] bg-gradient-to-br from-[var(--emerald-950)] to-[#0f241e] px-5 py-6 text-center text-white shadow-2xl sm:px-8">
        <Sparkles className="mx-auto text-[var(--gold-300)]" size={36} aria-hidden />
        <p className="mt-3 text-xs font-black uppercase tracking-[0.35em] text-[var(--gold-300)]">شكراً · ليالي بيوتي</p>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
          {name ? `${name}، سجلنا طلبج بنجاح` : "سجلنا طلبج بنجاح"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/85">
          شكراً على ثقتج. الحين أهم خطوة: <span className="font-black text-[var(--gold-300)]">أجيبي التأكيد</span>{" "}
          عشان ما يتأخر التجهيز وما يصير إلغاء لأننا ما تواصلنا معاج.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-3">
        <section className="rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--emerald-950)] px-3 py-1 text-xs font-black text-[var(--gold-300)]">
              {callPlan.badge}
            </span>
            <span className="text-xs font-bold text-[var(--muted)]">توقيت دبي · الإمارات</span>
          </div>
          <h2 className="mt-4 flex items-center gap-2 text-2xl font-black text-[var(--emerald-950)]">
            <PhoneCall className="text-[var(--gold-500)]" size={26} aria-hidden />
            {callPlan.title}
          </h2>
          <p className="mt-3 text-base leading-8 text-[var(--muted)]">{callPlan.body}</p>
          <ul className="mt-5 grid gap-3 text-sm font-bold text-[var(--emerald-950)] sm:grid-cols-2">
            <li className="flex items-start gap-2 rounded-2xl bg-[var(--cream-50)] px-4 py-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
              ما فيه دفع إلكتروني — الدفع عند الاستلام بعد التوصيل.
            </li>
            <li className="flex items-start gap-2 rounded-2xl bg-[var(--cream-50)] px-4 py-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
              التجهيز يبدأ بعد تأكيدج بالمكالمة فقط.
            </li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-[var(--border-gold)] bg-[var(--cream-50)] p-6">
          <p className="text-xs font-black text-[var(--gold-500)]">ملخص سريع</p>
          <p className="mt-1 text-sm text-[var(--muted)]">رقم الطلب</p>
          <p className="mt-1 break-all text-lg font-black text-[var(--emerald-950)]">{orderId}</p>
          {total > 0 && (
            <>
              <p className="mt-5 text-sm text-[var(--muted)]">الإجمالي المتوقع</p>
              <p className="mt-1 text-2xl font-black text-[var(--emerald-950)]">{money(total)}</p>
            </>
          )}
          {phone && (
            <>
              <p className="mt-5 text-sm text-[var(--muted)]">رقم التواصل المحفوظ</p>
              <p className="mt-1 font-mono text-lg font-black text-[var(--emerald-950)]" dir="ltr">
                {maskPhoneDisplay(phone)}
              </p>
              <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                إذا الرقم غلط، راسلينا على واتساب فوراً عشان ما نفقد طلبج.
              </p>
            </>
          )}
        </section>
      </div>

      <div className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-[var(--emerald-950)]">تبين تكملين التجربة؟</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">{upsell.blurb}</p>
          </div>
          <Link
            href={upsell.href}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--gold-500)] px-6 py-3.5 text-sm font-black text-[var(--emerald-950)] shadow-lg transition hover:bg-[var(--gold-400)]"
          >
            شوفي {upsell.title}
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-gold)] bg-white p-5 text-center">
          <Truck className="mx-auto text-[var(--gold-500)]" size={28} />
          <p className="mt-3 text-sm font-black text-[var(--emerald-950)]">توصيل داخل الإمارات</p>
          <p className="mt-2 text-xs leading-6 text-[var(--muted)]">١–٣ أيام عمل حسب المنطقة بعد تأكيد الطلب.</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-gold)] bg-white p-5 text-center">
          <MessageCircle className="mx-auto text-[var(--gold-500)]" size={28} />
          <p className="mt-3 text-sm font-black text-[var(--emerald-950)]">واتساب</p>
          <p className="mt-2 text-xs leading-6 text-[var(--muted)]">لو التأخير طوّل، راسلينا من نفس الرقم عشان نرجع نتواصل.</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-gold)] bg-white p-5 text-center">
          <CheckCircle2 className="mx-auto text-[var(--gold-500)]" size={28} />
          <p className="mt-3 text-sm font-black text-[var(--emerald-950)]">تجربة مميزة</p>
          <p className="mt-2 text-xs leading-6 text-[var(--muted)]">تغليف أنيق، متابعة لطيفة من الفريق، وبدون مفاجآت بالسعر.</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl text-center">
        <Link href="/" className="text-sm font-bold text-[var(--gold-500)] underline-offset-4 hover:underline">
          رجوع للهوم
        </Link>
      </div>
    </div>
  );
}
