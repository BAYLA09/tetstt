"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CALL_CENTER_CONFIRMED_OR_RETURNED_USD,
  CALL_CENTER_DELIVERED_USD,
  COD_NETWORK_FEE_RATE,
  FULFILLMENT_DELIVERED_USD,
  FULFILLMENT_RETURNED_USD,
  aedToUsd,
  breakevenMaxCpl,
  breakevenMinConfirmationRate,
  computeCodEconomics,
  type CodEconomicsInput,
} from "@/lib/cod-profit-calculator";

type EconomicsApi = {
  lifetime_orders: number;
  lifetime_revenue_aed: number;
  lifetime_average_order_value_aed: number | null;
  lifetime_avg_pieces_per_order: number | null;
  lifetime_average_order_value_usd: number | null;
  aed_to_usd_rate: number;
  cod_network_fee_percent: number;
};

type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block text-sm font-bold text-[var(--emerald-950)]">
      {label}
      {children}
      {hint ? <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border px-3 py-2 text-sm font-semibold tabular-nums outline-none focus:ring-2 focus:ring-amber-400/40";

export function ProfitCalculatorTab({ authHeader }: { authHeader: string | null }) {
  const [economics, setEconomics] = useState<EconomicsApi | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [leads, setLeads] = useState("1000");
  const [costPerLead, setCostPerLead] = useState("8");
  const [confirmationRate, setConfirmationRate] = useState("35");
  const [deliveryRate, setDeliveryRate] = useState("72");
  const [productCostPerUnit, setProductCostPerUnit] = useState("12");
  const [aedToUsdRate, setAedToUsdRate] = useState("0.272294");
  const [aovAed, setAovAed] = useState("");
  const [aovUsd, setAovUsd] = useState("");
  const [avgPieces, setAvgPieces] = useState("1.5");

  useEffect(() => {
    if (!authHeader) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/economics", { headers: { Authorization: authHeader } });
        if (!res.ok) {
          setLoadError("Could not load lifetime AOV from API.");
          return;
        }
        const data = (await res.json()) as EconomicsApi;
        if (cancelled) return;
        setEconomics(data);
        setAedToUsdRate(String(data.aed_to_usd_rate));
        if (data.lifetime_average_order_value_aed != null) {
          setAovAed(String(data.lifetime_average_order_value_aed));
        }
        if (data.lifetime_average_order_value_usd != null) {
          setAovUsd(String(data.lifetime_average_order_value_usd));
        }
        if (data.lifetime_avg_pieces_per_order != null) {
          setAvgPieces(String(data.lifetime_avg_pieces_per_order));
        }
      } catch {
        if (!cancelled) setLoadError("Network error loading economics.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authHeader]);

  const rate = parseFloat(aedToUsdRate) || 0.272294;

  const syncAovFromAed = (aed: string) => {
    setAovAed(aed);
    const n = parseFloat(aed);
    if (!Number.isNaN(n)) setAovUsd(String(aedToUsd(n, rate)));
  };

  const syncAovFromUsd = (usd: string) => {
    setAovUsd(usd);
    const n = parseFloat(usd);
    if (!Number.isNaN(n) && rate > 0) setAovAed(String(Math.round((n / rate) * 100) / 100));
  };

  const input: CodEconomicsInput = useMemo(
    () => ({
      leads: parseFloat(leads) || 0,
      costPerLeadUsd: parseFloat(costPerLead) || 0,
      confirmationRate: (parseFloat(confirmationRate) || 0) / 100,
      deliveryRate: (parseFloat(deliveryRate) || 0) / 100,
      productCostPerUnitUsd: parseFloat(productCostPerUnit) || 0,
      aovUsd: parseFloat(aovUsd) || 0,
      avgPiecesPerOrder: parseFloat(avgPieces) || 0,
    }),
    [leads, costPerLead, confirmationRate, deliveryRate, productCostPerUnit, aovUsd, avgPieces],
  );

  const result = useMemo(() => computeCodEconomics(input), [input]);
  const maxCpl = useMemo(() => breakevenMaxCpl(input), [input]);
  const minCr = useMemo(() => breakevenMinConfirmationRate(input), [input]);

  return (
    <section className="mt-8 space-y-8" dir="ltr">
      <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
        <h2 className="text-lg font-black text-[var(--emerald-950)]">Store defaults (lifetime)</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Pulled from all orders in your database. Edit fields below to model campaigns or scale scenarios.
        </p>
        {loadError && <p className="mt-2 text-sm text-rose-700">{loadError}</p>}
        {economics && (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <dt className="text-[var(--muted)]">Lifetime orders</dt>
              <dd className="font-black text-[var(--emerald-950)]">{economics.lifetime_orders}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Lifetime revenue</dt>
              <dd className="font-black text-[var(--emerald-950)]">{economics.lifetime_revenue_aed.toFixed(2)} AED</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Lifetime AOV</dt>
              <dd className="font-black text-[var(--emerald-950)]">
                {economics.lifetime_average_order_value_aed?.toFixed(2) ?? "—"} AED
                {economics.lifetime_average_order_value_usd != null
                  ? ` · $${economics.lifetime_average_order_value_usd.toFixed(2)}`
                  : ""}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Avg pieces / order</dt>
              <dd className="font-black text-[var(--emerald-950)]">
                {economics.lifetime_avg_pieces_per_order?.toFixed(2) ?? "—"}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
          <h2 className="text-lg font-black text-[var(--emerald-950)]">Inputs</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">COD funnel · USD costs except AOV (AED → USD)</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Leads" hint="Paid clicks or form leads in period">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={leads} onChange={(e) => setLeads(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Cost per lead (USD)">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={costPerLead} onChange={(e) => setCostPerLead(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Confirmation rate (%)" hint="Leads → confirmed COD orders">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={confirmationRate} onChange={(e) => setConfirmationRate(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Delivery rate (%)" hint="% of confirmed that deliver">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={deliveryRate} onChange={(e) => setDeliveryRate(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Product cost (USD / unit)">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={productCostPerUnit} onChange={(e) => setProductCostPerUnit(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Avg pieces per order" hint="Drives COGS with AOV">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={avgPieces} onChange={(e) => setAvgPieces(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="AOV (AED)">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={aovAed} onChange={(e) => syncAovFromAed(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="AOV (USD)">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={aovUsd} onChange={(e) => syncAovFromUsd(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="AED → USD rate" hint="Default ≈ 1/3.6725">
              <input className={inputClass} style={{ borderColor: "var(--border-gold)" }} value={aedToUsdRate} onChange={(e) => setAedToUsdRate(e.target.value)} inputMode="decimal" />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border p-6 shadow-sm" style={{ borderColor: "var(--border-gold)", background: "var(--cream-100)" }}>
          <h2 className="text-lg font-black text-[var(--emerald-950)]">Fixed costs (built-in)</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li>Confirmed / returned call center: ${CALL_CENTER_CONFIRMED_OR_RETURNED_USD} per returned lead</li>
            <li>Delivered call center: ${CALL_CENTER_DELIVERED_USD} per delivered order</li>
            <li>Delivered fulfillment: ${FULFILLMENT_DELIVERED_USD} per delivered order</li>
            <li>Return handling: ${FULFILLMENT_RETURNED_USD} per returned order</li>
            <li>COD network fee: {(COD_NETWORK_FEE_RATE * 100).toFixed(0)}% of gross delivered revenue</li>
            <li>COGS: avg pieces × unit cost on delivered + returned</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ResultPanel
          title="Break-even"
          subtitle="Targets before scaling ad spend"
          accent="var(--gold-500)"
          rows={[
            ["Max cost per lead (USD)", maxCpl != null ? `$${maxCpl.toFixed(2)}` : "—"],
            ["Min confirmation rate", minCr != null ? `${(minCr * 100).toFixed(1)}%` : "—"],
            ["Funnel snapshot", `${result.confirmed.toFixed(0)} confirmed · ${result.delivered.toFixed(0)} delivered · ${result.returned.toFixed(0)} returned`],
          ]}
        />
        <ResultPanel
          title="Profit at scale"
          subtitle="With your current inputs"
          accent="var(--emerald-950)"
          rows={[
            ["Net revenue (after 5% COD)", `$${result.netRevenueUsd.toFixed(2)}`],
            ["Total costs", `$${result.totalCostUsd.toFixed(2)}`],
            ["Profit", `$${result.profitUsd.toFixed(2)}`, result.profitUsd >= 0],
            ["Profit / delivered", result.profitPerDeliveredUsd != null ? `$${result.profitPerDeliveredUsd.toFixed(2)}` : "—"],
            ["Margin on net revenue", result.marginOnNetRevenuePercent != null ? `${result.marginOnNetRevenuePercent.toFixed(1)}%` : "—"],
          ]}
          breakdown={[
            ["Ad spend", result.adSpendUsd],
            ["Call center", result.callCenterUsd],
            ["Fulfillment", result.fulfillmentUsd],
            ["Product (COGS)", result.productCostUsd],
            ["COD fees", result.codFeesUsd],
          ]}
        />
      </div>
    </section>
  );
}

function ResultPanel({
  title,
  subtitle,
  accent,
  rows,
  breakdown,
}: {
  title: string;
  subtitle: string;
  accent: string;
  rows: [string, string, boolean?][];
  breakdown?: [string, number][];
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
      <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
        {title}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
      <dl className="mt-5 space-y-3">
        {rows.map(([k, v, positive]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 border-b pb-2" style={{ borderColor: "var(--border-gold)" }}>
            <dt className="text-sm font-semibold text-[var(--muted)]">{k}</dt>
            <dd
              className={`text-lg font-black tabular-nums ${
                positive === true ? "text-emerald-800" : positive === false ? "text-rose-700" : "text-[var(--emerald-950)]"
              }`}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
      {breakdown && (
        <ul className="mt-4 space-y-1 text-xs text-[var(--muted)]">
          {breakdown.map(([label, amount]) => (
            <li key={label} className="flex justify-between">
              <span>{label}</span>
              <span className="font-mono font-bold">${amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
