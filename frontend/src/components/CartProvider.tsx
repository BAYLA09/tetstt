"use client";

import { CheckCircle2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCartStore, type UpsellOfferPayload } from "@/lib/cart-store";
import { createOrder, addUpsell } from "@/lib/api";
import { getProductBySku, money, SKIP_POST_ORDER_UPSELL_MODAL } from "@/lib/products";
import { normalizeUaePhone } from "@/lib/phone";
import { generateEventId, getTrackingContext, trackEvent } from "@/lib/events";
import { saveLastCheckoutSnapshot } from "@/lib/order-confirmation-storage";

function UpsellModal({
  orderId,
  pending,
  onDone,
}: {
  orderId: string;
  pending: UpsellOfferPayload | null;
  onDone: () => void;
}) {
  const [seconds, setSeconds] = useState(15);
  const [busy, setBusy] = useState(false);
  const upsell = useMemo(() => {
    const fallback = getProductBySku("LB-UPSELL-OUD-39");
    return pending?.enabled
      ? {
          sku: pending.sku,
          name: pending.name,
          price: pending.price,
          line: `${pending.label} — ${pending.subtitle}`,
        }
      : !SKIP_POST_ORDER_UPSELL_MODAL && fallback
        ? { sku: fallback.sku, name: fallback.name, price: fallback.price, line: fallback.headline }
        : null;
  }, [pending]);

  useEffect(() => {
    if (upsell) {
      trackEvent("UpsellView", { sku: upsell.sku, value: upsell.price });
    }
  }, [upsell]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          onDone();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [onDone]);

  if (!upsell) return null;

  async function accept() {
    const offer = upsell;
    if (!offer) return;
    setBusy(true);
    const eventId = generateEventId("upsell");
    await addUpsell(orderId, offer.sku, eventId);
    trackEvent("UpsellAccepted", { eventId, value: offer.price });
    onDone();
  }

  function skip() {
    const offer = upsell;
    if (!offer) return;
    trackEvent("UpsellSkipped", { sku: offer.sku });
    onDone();
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4">
      <div className="max-w-md rounded-[2rem] border border-[var(--border-gold)] bg-[var(--emerald-950)] p-6 text-center text-white shadow-2xl">
        <p className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-[var(--gold-500)] text-3xl text-[var(--emerald-950)]">✦</p>
        <p className="text-sm font-bold text-[var(--gold-300)]">عرض خاص يظهر مرة واحدة فقط</p>
        <h3 className="mt-2 text-2xl font-black">{upsell.name}</h3>
        <p className="mt-3 text-sm leading-7 text-white/75">{upsell.line}</p>
        <p className="mt-2 text-xs text-white/60">ينتهى العرض خلال {seconds} ثانية.</p>
        <div className="mt-5 grid gap-3">
          <button disabled={busy} onClick={accept} className="rounded-full bg-[var(--gold-500)] px-5 py-4 font-black text-[var(--emerald-950)]">
            {busy ? "جاري الإضافة..." : `ضيفيه لطلبج — ${upsell.price} درهم`}
          </button>
          <button type="button" onClick={skip} className="text-sm font-bold text-white/75">
            لا شكراً، أكملي طلبج
          </button>
        </div>
      </div>
    </div>
  );
}

function thankYouUrl(orderId: string, name: string, phone: string, total: number, skus: string[]) {
  const qp = new URLSearchParams();
  qp.set("n", name);
  qp.set("p", phone);
  qp.set("t", String(total));
  qp.set("s", skus.join(","));
  return `/thank-you/${orderId}?${qp.toString()}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, isCartOpen, checkoutState, removeItem, updateQuantity, closeCart, openCheckout, closeCheckout, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [upsellOrderId, setUpsellOrderId] = useState<string | null>(null);
  const [postUpsellSnapshot, setPostUpsellSnapshot] = useState<UpsellOfferPayload | null>(null);
  const submitGuardRef = useRef(false);
  const initiateCheckoutEventIdRef = useRef<string | null>(null);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const normalizedPhone = normalizeUaePhone(phone);
  const canSubmit = name.trim().length >= 2 && Boolean(normalizedPhone) && items.length > 0 && !submitting;

  async function submitOrder(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || !normalizedPhone) return;
    if (submitGuardRef.current) return;
    submitGuardRef.current = true;
    setSubmitting(true);
    setError("");
    const purchaseEventId = generateEventId("purchase");
    try {
      const order = await createOrder({
        customer_name: name.trim(),
        phone: normalizedPhone,
        items,
        currency: "AED",
        source_url: window.location.href,
        landing_page: window.location.origin,
        event_ids: {
          purchase: purchaseEventId,
          initiate_checkout: initiateCheckoutEventIdRef.current ?? generateEventId("initiate_checkout"),
        },
        tracking: getTrackingContext().tracking,
        utm: getTrackingContext().utm,
      });
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      trackEvent("Purchase", {
        event_id: purchaseEventId,
        eventId: purchaseEventId,
        transaction_id: order.order_id,
        value: order.total,
        currency: "AED",
        content_ids: items.map((i) => i.sku),
        number_items: itemCount,
      });
      const skus = items.map((i) => i.sku);
      saveLastCheckoutSnapshot({
        name: name.trim(),
        phone: normalizedPhone,
        total,
        skus,
        savedAt: Date.now(),
      });
      const snap = useCartStore.getState().pendingUpsellOffer;
      useCartStore.getState().setPendingUpsellOffer(null);
      closeCheckout();
      clearCart();
      if (snap?.enabled) {
        setPostUpsellSnapshot(snap);
        setUpsellOrderId(order.order_id);
      } else if (!SKIP_POST_ORDER_UPSELL_MODAL) {
        setUpsellOrderId(order.order_id);
      } else {
        window.location.href = thankYouUrl(order.order_id, name.trim(), normalizedPhone, total, skus);
      }
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : "ما قدرنا نرسل الطلب الحين. تأكدي من الرقم وحاولي مرة ثانية.";
      setError(msg);
    } finally {
      setSubmitting(false);
      window.setTimeout(() => {
        submitGuardRef.current = false;
      }, 900);
    }
  }

  function finishOrder() {
    const id = upsellOrderId || "LB-DEMO";
    setUpsellOrderId(null);
    setPostUpsellSnapshot(null);
    clearCart();
    window.location.href = `/thank-you/${id}`;
  }

  return (
    <>
      {children}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <button aria-label="إغلاق السلة" className="absolute inset-0 bg-black/50" onClick={closeCart} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg translate-x-0 flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-200 ease-out lg:rounded-l-[2rem]">
            <div className="flex items-center justify-between bg-[var(--emerald-950)] p-5 text-white">
              <div>
                <p className="text-sm text-[var(--gold-300)]">طلبج محفوظ الحين</p>
                <h2 className="text-xl font-black">سلة ليالي بيوتي</h2>
              </div>
              <button onClick={closeCart} className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:bg-white/10">
                <X />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--cream-50)] p-5">
              <div className="rounded-3xl border border-[var(--border-gold)] bg-white p-4 text-[var(--emerald-950)] shadow-sm">
                <p className="text-xs font-bold text-[var(--gold-500)]">مهم قبل التأكيد</p>
                <p className="mt-1 text-sm leading-7">بنأكد طلبج عبر الهاتف/واتساب قبل الشحن. الطلبات المؤكدة بس تدخل التجهيز عشان توصلج التجربة مثل ما اخترتيها.</p>
              </div>
              {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[var(--border-gold)] bg-white p-8 text-center">
                  <ShoppingBag className="mx-auto mb-3 text-[var(--gold-500)]" />
                  <p className="font-bold">السلة فارغة حالياً</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.sku} className="rounded-3xl border border-[var(--border-gold)] bg-white p-4 shadow-sm">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-black text-[var(--emerald-950)]">{item.name}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{money(item.price)}</p>
                      </div>
                      <button onClick={() => removeItem(item.sku)} className="text-sm font-bold text-red-700">
                        حذف
                      </button>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)] bg-[var(--cream-50)] p-1">
                      <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="rounded-full bg-white p-2 shadow-sm">
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="rounded-full bg-white p-2 shadow-sm">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-[var(--border-gold)] bg-white p-5">
              <div className="mb-3 flex justify-between text-lg font-black">
                <span>الإجمالي</span>
                <span>{money(total)}</span>
              </div>
              <p className="mb-4 flex items-center gap-2 text-sm text-[var(--emerald-950)]">
                <CheckCircle2 size={16} /> الدفع عند الاستلام - لا تدفعين الآن
              </p>
              <button
                disabled={!items.length}
                onClick={() => {
                  const checkoutEventId = generateEventId("initiate_checkout");
                  initiateCheckoutEventIdRef.current = checkoutEventId;
                  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
                  trackEvent("InitiateCheckout", {
                    event_id: checkoutEventId,
                    value: total,
                    currency: "AED",
                    content_ids: items.map((i) => i.sku),
                    number_items: itemCount,
                  });
                  openCheckout();
                }}
                className="w-full rounded-full bg-[var(--gold-500)] px-6 py-4 font-black text-[var(--emerald-950)] shadow-lg transition hover:bg-[var(--gold-400)] disabled:opacity-50"
              >
                ثبتي الطلب للتأكيد
              </button>
            </div>
          </aside>
        </div>
      )}

      {checkoutState === "checkout" && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4 lg:place-items-center">
          <form
            onSubmit={submitOrder}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-[var(--border-gold)] bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[var(--gold-500)]">خطوة التأكيد - الدفع عند الاستلام</p>
                <h2 className="text-2xl font-black text-[var(--emerald-950)]">اكتبي بياناتج ونثبت لج الطلب</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  ما فيه دفع الحين. بنراجع الرقم ونتواصل معاج عشان نأكد الشحنة قبل التجهيز ونقلل الغلط والتأخير.
                </p>
              </div>
              <button type="button" onClick={closeCheckout} className="rounded-full border border-[var(--border-gold)] p-2">
                <X />
              </button>
            </div>
            <div className="mb-5 rounded-2xl bg-[var(--cream-50)] p-4">
              <div className="flex justify-between font-black">
                <span>ملخص الطلب</span>
                <span>{money(total)}</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">طلبج محجوز مؤقتاً. إذا الرقم صحيح، فريق التأكيد يتواصل قبل الشحن.</p>
            </div>
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-[var(--emerald-950)]">
                الاسم الكامل
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  dir="rtl"
                  className="rounded-2xl border border-[var(--border-gold)] px-4 py-3 text-right outline-none placeholder:text-right focus:ring-2 focus:ring-[var(--gold-400)]"
                  placeholder="مثال: فاطمة علي"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--emerald-950)]">
                رقم الهاتف الإماراتي
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="rtl"
                  inputMode="tel"
                  className="rounded-2xl border border-[var(--border-gold)] px-4 py-3 text-right outline-none placeholder:text-right focus:ring-2 focus:ring-[var(--gold-400)]"
                  placeholder="05 123 4567"
                />
              </label>
            </div>
            {phone && !normalizedPhone && <p className="mt-2 text-sm text-red-700">أدخلي رقم هاتف إماراتي صحيح.</p>}
            {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={!canSubmit} className="mt-5 w-full rounded-full bg-[var(--emerald-950)] px-6 py-4 font-black text-[var(--gold-300)] disabled:opacity-50">
              {submitting ? "جاري تثبيت الطلب..." : "ثبتي الطلب الآن"}
            </button>
            <p className="mt-3 text-center text-xs leading-6 text-[var(--muted)]">
              الطلب ما يدخل الشحن إلا بعد تأكيدج. هالشي يساعدنا نوصل الطلبات المؤكدة بسرعة ونقلل الإلغاءات.
            </p>
          </form>
        </div>
      )}

      {upsellOrderId && (postUpsellSnapshot?.enabled || !SKIP_POST_ORDER_UPSELL_MODAL) ? (
        <UpsellModal orderId={upsellOrderId} pending={postUpsellSnapshot} onDone={finishOrder} />
      ) : null}
    </>
  );
}
