import { Suspense } from "react";
import { ThankYouClient } from "@/components/ThankYouClient";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main className="min-h-screen bg-[var(--cream-50)]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl px-4 py-24 text-center text-[var(--muted)]">لحظة… نجهّز لج تفاصيل الطلب</div>
        }
      >
        <ThankYouClient orderId={orderId} />
      </Suspense>
    </main>
  );
}
