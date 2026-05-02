"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { createOrder, addUpsell } from "@/lib/api";
import { getCrossSells, getProductBySku, money, Product } from "@/lib/products";
import { normalizeUaePhone } from "@/lib/phone";
import { generateEventId, getTrackingContext, trackEvent } from "@/lib/events";

function MiniProduct({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-[var(--border-gold)] bg-[var(--cream-50)] p-3">
      <div className="flex items-center gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-[radial-gradient(circle_at_top,#d9ad63,#06472f_70%)] text-xl">
          ✦
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[var(--emerald-950)]">{product.name}</p>
          <p className="text-xs text-[var(--muted)]">{product.subheading}</p>
          <p className="mt-1 font-bold text-[var(--gold-500)]">{money(product.price)}</p>
        </div>
        <button onClick={onAdd} className="rounded-full bg-[var(--emerald-950)] px-3 py-2 text-xs font-bold text-[var(--gold-300)]">
          أضيفيه
        </button>
      </div>
    </div>
  );
}

function UpsellModal({ orderId, onDone }: { orderId: string; onDone: () => void }) {
  const [seconds, setSeconds] = useState(15);
  const [busy, setBusy] = useState(false);
  const upsell = getProductBySku("LB-UPSELL-OUD-39")!;

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

  async function accept() {
    setBusy(true);
    const eventId = generateEventId("upsell");
    await addUpsell(orderId, upsell.sku, eventId);
    trackEvent("UpsellAccepted", { eventId, value: upsell.price });
    onDone();
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md rounded-[2rem] border border-[var(--border-gold)] bg-[var(--emerald-950)] p-6 text-center text-white shadow-2xl">
        <p className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-[var(--gold-500)] text-3xl text-[var(--emerald-950)]">✦</p>
        <p className="text-sm font-bold text-[var(--gold-300)]">عرض خاص يظهر مرة واحدة فقط</p>
        <h3 className="mt-2 text-2xl font-black">أضيفي لمسة عود فاخرة بـ AED 39</h3>
        <p className="mt-3 text-sm leading-7 text-white/75">هذا السعر خاص بطلبك الحالي فقط، وينتهي خلال {seconds} ثانية.</p>
        <div className="mt-5 grid gap-3">
          <button disabled={busy} onClick={accept} className="rounded-full bg-[var(--gold-500)] px-5 py-4 font-black text-[var(--emerald-950)]">
            {busy ? "جاري الإضافة..." : "أضيفيه لطلبي بـ 39 درهم"}
          </button>
          <button onClick={onDone} className="text-sm font-bold text-white/75">لا شكراً، أكملي طلبي</button>
        </div>
      </motion.div>
    </div>
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, isCartOpen, checkoutState, addItem, removeItem, updateQuantity, closeCart, openCheckout, closeCheckout, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [upsellOrderId, setUpsellOrderId] = useState<string | null>(null);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const crossSells = getCrossSells(items.map((item) => item.sku));
  const normalizedPhone = normalizeUaePhone(phone);
  const canSubmit = name.trim().length >= 2 && Boolean(normalizedPhone) && items.length > 0 && !submitting;

  async function submitOrder(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || !normalizedPhone) return;
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
        event_ids: { purchase: purchaseEventId, initiate_checkout: generateEventId("checkout") },
        tracking: getTrackingContext().tracking,
        utm: getTrackingContext().utm,
      });
      trackEvent("Purchase", { eventId: purchaseEventId, value: order.total });
      closeCheckout();
      setUpsellOrderId(order.order_id);
    } catch {
      setError("تعذر إرسال الطلب الآن. تأكدي من الرقم وحاولي مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  function finishOrder() {
    const id = upsellOrderId || "LB-DEMO";
    setUpsellOrderId(null);
    clearCart();
    window.location.href = `/thank-you/${id}`;
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            <button aria-label="إغلاق السلة" className="absolute inset-0 bg-black/50" onClick={closeCart} />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-[var(--emerald-950)] p-5 text-white">
                <div>
                  <p className="text-sm text-[var(--gold-300)]">طلبك محفوظ الآن</p>
                  <h2 className="text-xl font-black">سلة ليالي بيوتي</h2>
                </div>
                <button onClick={closeCart} className="rounded-full border border-white/20 p-2"><X /></button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {items.length === 0 ? (
                  <div className="rounded-3xl bg-[var(--cream-50)] p-8 text-center">
                    <ShoppingBag className="mx-auto mb-3 text-[var(--gold-500)]" />
                    <p className="font-bold">السلة فارغة حالياً</p>
                  </div>
                ) : items.map((item) => (
                  <div key={item.sku} className="rounded-2xl border border-[var(--border-gold)] p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-black text-[var(--emerald-950)]">{item.name}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{money(item.price)}</p>
                      </div>
                      <button onClick={() => removeItem(item.sku)} className="text-sm text-red-700">حذف</button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="rounded-full border p-2"><Minus size={14} /></button>
                      <span className="min-w-8 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="rounded-full border p-2"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
                {crossSells.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-black text-[var(--emerald-950)]">أضيفي لمسة تكمل طلبك</p>
                    {crossSells.map((product) => <MiniProduct key={product.sku} product={product} onAdd={() => addItem(product)} />)}
                  </div>
                )}
              </div>
              <div className="border-t border-[var(--border-gold)] bg-[var(--cream-50)] p-5">
                <div className="mb-3 flex justify-between text-lg font-black">
                  <span>الإجمالي</span>
                  <span>{money(total)}</span>
                </div>
                <p className="mb-4 flex items-center gap-2 text-sm text-[var(--emerald-950)]"><CheckCircle2 size={16} /> الدفع عند الاستلام - لا تدفعين الآن</p>
                <button disabled={!items.length} onClick={openCheckout} className="w-full rounded-full bg-[var(--gold-500)] px-6 py-4 font-black text-[var(--emerald-950)] disabled:opacity-50">إتمام الطلب</button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutState === "checkout" && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4">
            <motion.form onSubmit={submitOrder} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--gold-500)]">الدفع عند الاستلام</p>
                  <h2 className="text-2xl font-black text-[var(--emerald-950)]">أكملي الطلب الآن</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">سنتواصل معك لتأكيد الطلب قبل الشحن.</p>
                </div>
                <button type="button" onClick={closeCheckout} className="rounded-full border p-2"><X /></button>
              </div>
              <div className="mb-5 rounded-2xl bg-[var(--cream-50)] p-4">
                <div className="flex justify-between font-black"><span>ملخص الطلب</span><span>{money(total)}</span></div>
                <p className="mt-2 text-sm text-[var(--muted)]">★★★★★ نساء في الإمارات يفضلن الطلب بالدفع عند الاستلام.</p>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-2 text-sm font-bold text-[var(--emerald-950)]">الاسم الكامل
                  <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-[var(--border-gold)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--gold-400)]" placeholder="مثال: فاطمة علي" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--emerald-950)]">رقم الهاتف الإماراتي
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="rounded-2xl border border-[var(--border-gold)] px-4 py-3 text-right outline-none focus:ring-2 focus:ring-[var(--gold-400)]" placeholder="05XXXXXXXX" />
                </label>
              </div>
              {phone && !normalizedPhone && <p className="mt-2 text-sm text-red-700">أدخلي رقم موبايل إماراتي صحيح.</p>}
              {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={!canSubmit} className="mt-5 w-full rounded-full bg-[var(--emerald-950)] px-6 py-4 font-black text-[var(--gold-300)] disabled:opacity-50">
                {submitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب الآن"}
              </button>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">العرض الحالي محجوز لك أثناء تعبئة البيانات.</p>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {upsellOrderId && <UpsellModal orderId={upsellOrderId} onDone={finishOrder} />}
    </>
  );
}
