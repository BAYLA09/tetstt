import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "معلومات البناء",
  robots: { index: false, follow: false },
};

/** Proves which bundle EasyPanel served (NEXT_PUBLIC_* baked at `next build`). */
export default function BuildInfoPage() {
  const data = {
    "وقت البناء": process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
    "رقم النسخة": process.env.NEXT_PUBLIC_COMMIT_SHA ?? null,
    "نسخة المستودع": process.env.NEXT_PUBLIC_GIT_COMMIT ?? null,
    "مؤشر تحديث التخزين": process.env.NEXT_PUBLIC_DOCKER_CACHE_BUST ?? null,
    "علامة بناء التطبيق": process.env.NEXT_PUBLIC_APP_BUILD_MARKER ?? null,
    "رابط الخدمة": process.env.NEXT_PUBLIC_API_BASE_URL ?? null,
    "استخدام وكيل نفس النطاق للطلبات": process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? null,
    "بيئة التشغيل": process.env.NODE_ENV,
    "ملاحظة":
      "إذا كانت بعض الخانات ناقصة، فهذا يعني أن النسخة ما انبنت من جديد بإعدادات البناء المطلوبة.",
  };

  return (
    <main style={{ padding: "1.5rem", fontFamily: "ui-monospace, monospace", maxWidth: "56rem" }}>
      <h1 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>معلومات نسخة المتجر</h1>
      <p style={{ marginBottom: "1rem", opacity: 0.85 }}>
        قارني رقم النسخة الظاهر هنا مع رقم النسخة في المستودع ومسار نسخة الخدمة.
      </p>
      <pre
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "1rem",
          borderRadius: "8px",
          overflow: "auto",
          fontSize: "0.85rem",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
