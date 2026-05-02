"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { cartTotal, crossSellCandidates, useCart } from "@/lib/cart";
import { normalizeUaePhone } from "@/lib/phone";
import { collectTracking, collectUtm, createEventId } from "@/lib/events";
import { upsellProduct } from "@/lib/products";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "اكتبي الاسم على الأقل حرفين"),
  phone: z.string().refine((value) => Boolean(normalizeUaePhone(value)), "اكتبي رقم إماراتي صحيح"),
});
type CheckoutFields = z.infer<typeof checkoutSchema>;

export function StoreOverlays() {
  return <><CartDrawer /><CheckoutModal /><UpsellModal /></>;
}

function CartDrawer() {
  const { items, isCartOpen, closeCart, setQuantity, openCheckout, addProduct } = useCart();
  const total = cartTotal(items);
  const crossSells = crossSellCandidates(items);
  return <AnimatePresence>{isCartOpen && <>
    <motion.div className="drawer-backdrop" onClick={closeCart} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
    <motion.aside className="drawer" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }} aria-label="سلة الطلب">
      <button className="btn secondary" onClick={closeCart}>إغلاق</button>
      <h2>طلبك محفوظ الآن</h2><p className="badge">الدفع عند الاستلام - لا تدفعين الآن</p>
      {!items.length && <p>السلة فارغة حالياً.</p>}
      {items.map((item) => <div key={item.sku} className="card" style={{ padding: 14, margin: "12px 0" }}><strong>{item.name}</strong><p>AED {item.price}</p><div style={{ display: "flex", gap: 8 }}><button onClick={() => setQuantity(item.sku, item.quantity - 1)}>-</button><span>{item.quantity}</span><button onClick={() => setQuantity(item.sku, item.quantity + 1)}>+</button></div></div>)}
      {!!crossSells.length && <section><h3>أضيفي لمسة تكمل طلبك</h3>{crossSells.map((product) => <div key={product.sku} className="card" style={{ padding: 14, margin: "10px 0" }}><span className="badge">{product.sku === "LB-SERUM-SET-99" ? "الأكثر إضافة مع الباقة" : "ترقية ذكية"}</span><h4>{product.name}</h4><p>{product.subheading}</p><button className="btn secondary" onClick={() => addProduct(product)}>أضيفيه AED {product.price}</button></div>)}</section>}
      <h3>الإجمالي: AED {total}</h3><button className="btn" disabled={!items.length} onClick={openCheckout}>إتمام الطلب</button>
    </motion.aside>
  </>}</AnimatePresence>;
}

function CheckoutModal() {
  const { items, isCheckoutOpen, closeCheckout, setPendingOrder } = useCart();
  const [serverError, setServerError] = useState("");
  const searchParams = useSearchParams();
  const form = useForm<CheckoutFields>({ resolver: zodResolver(checkoutSchema), mode: "onChange", defaultValues: { name: "", phone: "" } });
  const total = cartTotal(items);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const canSubmit = form.formState.isValid && !!items.length && !form.formState.isSubmitting;
  async function submit(values: CheckoutFields) {
    setServerError("");
    const initiateEvent = createEventId("evt_checkout");
    const purchaseEvent = createEventId("evt_purchase");
    const response = await fetch(`${apiBase}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_name: values.name.trim(), phone: normalizeUaePhone(values.phone), items, currency: "AED", source_url: window.location.href, landing_page: window.localStorage.getItem("layali_landing_page") || window.location.href, event_ids: { initiate_checkout: initiateEvent, purchase: purchaseEvent }, tracking: collectTracking(searchParams), utm: collectUtm(searchParams) }) });
    if (!response.ok) { setServerError("تعذر حفظ الطلب. تأكدي من الرقم وحاولي مرة أخرى."); return; }
    const data = await response.json();
    setPendingOrder({ orderId: data.order_id, total: data.total });
  }
  return <AnimatePresence>{isCheckoutOpen && <><motion.div className="modal-backdrop" onClick={closeCheckout} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.div className="modal" initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}>
    <button className="btn secondary" onClick={closeCheckout}>إغلاق</button><h2>أكملي الطلب بالدفع عند الاستلام</h2><p>نساء كثيرات يفضلن الدفع عند الاستلام لتجربة أوضح.</p><p className="badge">العرض الحالي محجوز لك أثناء تعبئة البيانات.</p>
    <div className="card" style={{ padding: 14 }}>{items.map((item) => <p key={item.sku}>{item.name} × {item.quantity}</p>)}<strong>AED {total}</strong></div>
    <form onSubmit={form.handleSubmit(submit)}><label className="field">الاسم<input {...form.register("name")} autoComplete="name" />{form.formState.errors.name && <span className="error">{form.formState.errors.name.message}</span>}</label><label className="field">رقم الهاتف<input {...form.register("phone")} inputMode="tel" placeholder="05XXXXXXXX" />{form.formState.errors.phone && <span className="error">{form.formState.errors.phone.message}</span>}</label>{serverError && <p className="error">{serverError}</p>}<p>لن يتم طلب أي دفع الآن. سنتواصل معك لتأكيد الطلب قبل الشحن.</p><button className="btn" disabled={!canSubmit}>تأكيد الطلب</button></form>
  </motion.div></>}</AnimatePresence>;
}

function UpsellModal() {
  const { pendingOrder, setPendingOrder, clearCart } = useCart();
  const [seconds, setSeconds] = useState(12);
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const target = useMemo(() => pendingOrder ? `/thank-you/${pendingOrder.orderId}?total=${pendingOrder.total}` : "", [pendingOrder]);
  const finish = useCallback((href: string) => {
    clearCart();
    setPendingOrder(null);
    router.push(href);
  }, [clearCart, router, setPendingOrder]);
  useEffect(() => {
    if (!pendingOrder) return;
    const interval = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(interval);
  }, [pendingOrder]);
  useEffect(() => { if (pendingOrder && seconds <= 0) finish(target); }, [seconds, pendingOrder, target, finish]);
  async function accept() {
    if (!pendingOrder) return;
    const response = await fetch(`${apiBase}/orders/${pendingOrder.orderId}/upsell`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...upsellProduct, quantity: 1, event_id: createEventId("evt_upsell") }) });
    const data = response.ok ? await response.json() : { total: pendingOrder.total + 39 };
    finish(`/thank-you/${pendingOrder.orderId}?total=${data.total}`);
  }
  if (!pendingOrder) return null;
  return <><div className="modal-backdrop" /><div className="modal"><span className="badge">عرض خاص يظهر مرة واحدة فقط مع طلبك الحالي</span><h2>أضيفي سيروم إضافي بـ AED 39 فقط</h2><p>يظهر هذا العرض مرة واحدة بعد تأكيد الطلب. ينتهي خلال {seconds} ثانية.</p><button className="btn" onClick={accept}>أضيفيه بـ 39 درهم</button><button className="btn secondary" style={{ marginInlineStart: 8 }} onClick={() => finish(target)}>لا شكراً، أكملي طلبي</button></div></>;
}
