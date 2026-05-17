"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "layali_admin_jwt_v1";

type Metrics = {
  date_from: string;
  date_to: string;
  clicks: number;
  orders: number;
  revenue_aed: number;
  conversion_rate_percent: number | null;
  average_order_value_aed: number | null;
};

type OrderRow = {
  public_order_id: string | null;
  created_at: string;
  customer_name: string;
  phone_display: string;
  total: number;
  currency: string;
  utm_source: string | null;
  items_preview: string;
};

type OrderDetail = {
  public_order_id: string | null;
  internal_id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  phone_e164: string;
  currency: string;
  subtotal: number;
  upsell_total: number;
  total: number;
  status: string;
  source_url: string | null;
  landing_page: string | null;
  utm: Record<string, string | null>;
  tracking_keys: string[];
  event_ids: Record<string, string>;
  sheet_sync_status: string;
  sheet_sync_error: string | null;
  items: {
    sku: string;
    name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
    is_upsell: boolean;
  }[];
};

function defaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(start), to: iso(end) };
}

export default function AdminDashboardPage() {
  const initialRange = useMemo(() => defaultDateRange(), []);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "orders">("overview");
  const [dateFrom, setDateFrom] = useState(initialRange.from);
  const [dateTo, setDateTo] = useState(initialRange.to);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const authHeader = useCallback(() => {
    if (!token) return null;
    return `Bearer ${token}`;
  }, [token]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    setToken(null);
    setMetrics(null);
    setOrders([]);
    setDetail(null);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(typeof data.detail === "string" ? data.detail : "Login failed");
        return;
      }
      const t = data.access_token as string | undefined;
      if (!t) {
        setLoginError("No token returned");
        return;
      }
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    const h = `Bearer ${token}`;
    let cancelled = false;
    const qs = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
    void (async () => {
      setLoading(true);
      try {
        const [mRes, oRes] = await Promise.all([
          fetch(`/api/admin/metrics?${qs}`, { headers: { Authorization: h } }),
          fetch(`/api/admin/orders?${qs}&limit=100&offset=0`, { headers: { Authorization: h } }),
        ]);
        if (mRes.status === 401 || oRes.status === 401) {
          logout();
          return;
        }
        if (!cancelled) {
          if (mRes.ok) setMetrics(await mRes.json());
          if (oRes.ok) {
            const data = await oRes.json();
            setOrders(Array.isArray(data) ? data : []);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, dateFrom, dateTo, refreshTick, logout]);

  const openOrder = async (id: string | null) => {
    if (!id) return;
    const h = authHeader();
    if (!h) return;
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { headers: { Authorization: h } });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        setDetail(null);
        return;
      }
      setDetail(await res.json());
    } finally {
      setDetailLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16" dir="ltr">
        <h1 className="text-2xl font-bold tracking-tight text-white">Layali Beauty · Admin</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with backend credentials (Bearer JWT).</p>
        <form onSubmit={login} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Username
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-amber-500/40 focus:ring-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-amber-500/40 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="text-sm text-rose-400">{loginError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100" dir="ltr">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Layali Beauty</p>
            <h1 className="text-xl font-bold text-white">Operations dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <label className="sr-only" htmlFor="df">
                From
              </label>
              <input
                id="df"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              />
              <span className="text-slate-500">—</span>
              <label className="sr-only" htmlFor="dt">
                To
              </label>
              <input
                id="dt"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setRefreshTick((t) => t + 1)}
              className="rounded-md border border-slate-600 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-md bg-rose-600/90 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex gap-2 border-b border-slate-800 pb-3">
          {(
            [
              ["overview", "Overview"],
              ["orders", "Orders"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                tab === id ? "bg-amber-500 text-emerald-950" : "text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <section className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Ad clicks (with fb/tt/sc id)" value={metrics?.clicks ?? "—"} hint="Session beacon, paid click params only" />
              <MetricCard label="Orders" value={metrics?.orders ?? "—"} />
              <MetricCard label="Revenue (AED)" value={metrics != null ? metrics.revenue_aed.toFixed(2) : "—"} />
              <MetricCard
                label="Conversion (orders ÷ clicks)"
                value={metrics?.conversion_rate_percent != null ? `${metrics.conversion_rate_percent.toFixed(2)}%` : "—"}
                hint={metrics?.clicks === 0 ? "No clicks in range — set paid params on URL or run ads" : undefined}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Average order value</h2>
                <p className="mt-2 text-3xl font-black text-white">
                  {metrics?.average_order_value_aed != null ? `${metrics.average_order_value_aed.toFixed(2)} AED` : "—"}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Range (UTC): {metrics?.date_from ?? dateFrom} → {metrics?.date_to ?? dateTo}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">How clicks are counted</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  <li>One row per browser session when the URL (or stored params) includes Meta `fbclid`, TikTok `ttclid`, or Snap `ScCid` / `sc_click_id`.</li>
                  <li>Organic visits without those parameters are not counted as clicks here.</li>
                  <li>Conversion uses those clicks as the denominator; orders are COD checkouts in the same date range (UTC).</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {tab === "orders" && (
          <section className="mt-8 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-400">Order</th>
                  <th className="px-4 py-3 font-semibold text-slate-400">When</th>
                  <th className="px-4 py-3 font-semibold text-slate-400">Customer</th>
                  <th className="px-4 py-3 font-semibold text-slate-400">Phone</th>
                  <th className="px-4 py-3 font-semibold text-slate-400">Total</th>
                  <th className="px-4 py-3 font-semibold text-slate-400">UTM src</th>
                  <th className="px-4 py-3 font-semibold text-slate-400">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                {orders.map((o) => (
                  <tr key={o.public_order_id ?? o.created_at} className="hover:bg-slate-900/60">
                    <td className="px-4 py-3 font-mono text-xs text-amber-200">
                      <button
                        type="button"
                        className="text-left underline decoration-amber-500/50 hover:text-amber-100"
                        onClick={() => void openOrder(o.public_order_id)}
                      >
                        {o.public_order_id}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white">{o.customer_name}</td>
                    <td className="px-4 py-3 text-slate-400">{o.phone_display}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {o.total} {o.currency}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{o.utm_source ?? "—"}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-slate-400" title={o.items_preview}>
                      {o.items_preview}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="p-6 text-center text-slate-500">No orders in this range.</p>}
          </section>
        )}
      </div>

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-400">Order preview</p>
                <h2 className="mt-1 font-mono text-lg text-white">{detail?.public_order_id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            {detailLoading && <p className="mt-6 text-slate-400">Loading…</p>}
            {detail && (
              <div className="mt-6 space-y-5 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-500">Customer</p>
                    <p className="font-semibold text-white">{detail.customer_name}</p>
                    <p className="mt-1 font-mono text-amber-200">{detail.phone_e164}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-500">Totals</p>
                    <p className="text-white">
                      Subtotal <span className="font-mono">{detail.subtotal}</span>
                    </p>
                    <p className="text-white">
                      Upsell <span className="font-mono">{detail.upsell_total}</span>
                    </p>
                    <p className="mt-1 text-lg font-black text-amber-300">
                      {detail.total} {detail.currency}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-bold text-slate-500">Line items</p>
                  <ul className="mt-2 divide-y divide-slate-800">
                    {detail.items.map((it) => (
                      <li key={`${it.sku}-${it.name}`} className="flex flex-wrap justify-between gap-2 py-2">
                        <span className="text-slate-200">
                          {it.name}{" "}
                          <span className="text-slate-500">
                            ×{it.quantity} {it.is_upsell && <span className="text-amber-400">· upsell</span>}
                          </span>
                        </span>
                        <span className="font-mono text-white">{it.line_total}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs font-bold text-slate-500">Attribution</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300">
                    {Object.entries(detail.utm).map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-slate-500">utm_{k}</dt>
                        <dd className="font-mono">{v || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 text-xs text-slate-500">Tracking keys present: {detail.tracking_keys.join(", ") || "—"}</p>
                </div>
                <pre className="max-h-48 overflow-auto rounded-xl border border-slate-800 bg-black/40 p-3 text-xs text-emerald-100/90">
                  {JSON.stringify({ event_ids: detail.event_ids, source_url: detail.source_url, landing_page: detail.landing_page }, null, 2)}
                </pre>
                <p className="text-xs text-slate-500">
                  Sheet sync: {detail.sheet_sync_status}
                  {detail.sheet_sync_error ? ` — ${detail.sheet_sync_error}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
