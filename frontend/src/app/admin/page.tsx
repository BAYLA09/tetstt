"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProfitCalculatorTab } from "@/components/admin/ProfitCalculatorTab";

const TOKEN_KEY = "layali_admin_jwt_v1";

type Metrics = {
  date_from: string;
  date_to: string;
  clicks: number;
  clicks_uae_valid: number;
  clicks_rejected_geo: number;
  clicks_by_platform: Record<string, number>;
  orders: number;
  revenue_aed: number;
  conversion_rate_percent: number | null;
  average_order_value_aed: number | null;
  orders_by_status: Record<string, number>;
  pending_sheet_sync_count: number;
  orders_with_upsell: number;
  upsell_attach_rate_percent: number | null;
};

type OrderRow = {
  public_order_id: string | null;
  created_at: string;
  customer_name: string;
  phone_display: string;
  total: number;
  currency: string;
  status: string;
  utm_source: string | null;
  items_preview: string;
};

type OrdersPage = {
  total: number;
  limit: number;
  offset: number;
  orders: OrderRow[];
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

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function defaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { from: isoDate(start), to: isoDate(end) };
}

function presetRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  return { from: isoDate(start), to: isoDate(end) };
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
  const [tab, setTab] = useState<"overview" | "orders" | "profit" | "setup">("overview");
  const [dateFrom, setDateFrom] = useState(initialRange.from);
  const [dateTo, setDateTo] = useState(initialRange.to);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [ordersPayload, setOrdersPayload] = useState<OrdersPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

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
    setOrdersPayload(null);
    setDetail(null);
    setPage(0);
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
        const mRes = await fetch(`/api/admin/metrics?${qs}`, { headers: { Authorization: h } });
        if (mRes.status === 401) {
          logout();
          return;
        }
        if (!cancelled && mRes.ok) setMetrics(await mRes.json());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, dateFrom, dateTo, refreshTick, logout]);

  useEffect(() => {
    if (!token || tab !== "orders") return;
    const h = `Bearer ${token}`;
    let cancelled = false;
    const qs = new URLSearchParams({
      date_from: dateFrom,
      date_to: dateTo,
      limit: String(pageSize),
      offset: String(page * pageSize),
    });
    if (orderStatus.trim()) qs.set("status", orderStatus.trim());
    void (async () => {
      setOrdersLoading(true);
      try {
        const oRes = await fetch(`/api/admin/orders?${qs}`, { headers: { Authorization: h } });
        if (oRes.status === 401) {
          logout();
          return;
        }
        if (!cancelled && oRes.ok) setOrdersPayload(await oRes.json());
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, tab, dateFrom, dateTo, page, orderStatus, refreshTick, logout]);

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

  const filteredOrders = useMemo(() => {
    const rows = ordersPayload?.orders ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (o) =>
        (o.public_order_id && o.public_order_id.toLowerCase().includes(q)) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone_display.toLowerCase().includes(q) ||
        o.items_preview.toLowerCase().includes(q),
    );
  }, [ordersPayload, search]);

  const statusOptions = useMemo(() => {
    const fromMetrics = metrics ? Object.keys(metrics.orders_by_status) : [];
    const hints = ["received", "confirmed", "shipped", "cancelled"];
    return Array.from(new Set([...hints, ...fromMetrics])).sort();
  }, [metrics]);

  const exportCsv = () => {
    const rows = filteredOrders;
    const header = ["order_id", "created_at", "customer", "phone", "status", "total", "currency", "utm_source", "items"];
    const lines = [
      header.join(","),
      ...rows.map((o) =>
        [
          o.public_order_id ?? "",
          o.created_at,
          csvEscape(o.customer_name),
          o.phone_display,
          o.status,
          o.total,
          o.currency,
          o.utm_source ?? "",
          csvEscape(o.items_preview),
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `layali-orders-${dateFrom}_${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16"
        dir="ltr"
        style={{ background: "var(--emerald-950)", color: "var(--cream-50)" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold-400)" }}>
          ليالي بيوتي
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">Admin</h1>
        <p className="mt-2 text-sm opacity-80">COD operations · sign in with backend credentials.</p>
        <form onSubmit={login} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold">
            Username
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[var(--ink)] outline-none ring-amber-400/30 focus:ring-2"
              style={{ borderColor: "var(--border-gold)", background: "var(--cream-50)" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[var(--ink)] outline-none ring-amber-400/30 focus:ring-2"
              style={{ borderColor: "var(--border-gold)", background: "var(--cream-50)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="text-sm text-rose-300">{loginError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 text-sm font-black transition disabled:opacity-60"
            style={{ background: "var(--gold-500)", color: "var(--emerald-950)" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  const totalPages = ordersPayload ? Math.max(1, Math.ceil(ordersPayload.total / pageSize)) : 1;

  return (
    <div className="min-h-screen pb-28 text-[var(--ink)]" dir="ltr" style={{ background: "var(--cream-50)" }}>
      <header
        className="border-b shadow-sm"
        style={{ borderColor: "var(--border-gold)", background: "linear-gradient(135deg, var(--emerald-950) 0%, #132820 100%)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold-300)" }}>
              Layali Beauty
            </p>
            <h1 className="text-xl font-black">COD admin</h1>
            <p className="mt-0.5 text-xs text-white/70">Metrics · orders · fulfillment signals</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DatePresets
              onPick={(from, to) => {
                setDateFrom(from);
                setDateTo(to);
                setPage(0);
              }}
            />
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(0);
                }}
                className="rounded-md bg-transparent px-1 py-1 text-xs text-white"
              />
              <span className="text-white/40">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(0);
                }}
                className="rounded-md bg-transparent px-1 py-1 text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setRefreshTick((t) => t + 1)}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-rose-100 hover:bg-rose-500/30"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <nav className="flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: "var(--border-gold)" }}>
          {(
            [
              ["overview", "Overview"],
              ["orders", "Orders"],
              ["profit", "Profit calculator"],
              ["setup", "Setup"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-1.5 text-sm font-black transition ${
                tab === id ? "shadow-md" : "opacity-70 hover:opacity-100"
              }`}
              style={
                tab === id
                  ? { background: "var(--gold-500)", color: "var(--emerald-950)" }
                  : { background: "white", color: "var(--emerald-950)", border: "1px solid var(--border-gold)" }
              }
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <section className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="UAE-valid clicks"
                value={metrics?.clicks_uae_valid ?? "—"}
                hint={
                  metrics
                    ? `${metrics.clicks_rejected_geo} rejected geo · ${metrics.clicks} total beacons`
                    : "Cloudflare + MaxMind · AE only"
                }
              />
              <MetricCard label="Orders" value={metrics?.orders ?? "—"} />
              <MetricCard label="Revenue (AED)" value={metrics != null ? metrics.revenue_aed.toFixed(2) : "—"} />
              <MetricCard
                label="Conversion"
                value={metrics?.conversion_rate_percent != null ? `${metrics.conversion_rate_percent.toFixed(2)}%` : "—"}
                hint={metrics?.clicks_uae_valid === 0 ? "No UAE clicks in range" : "Orders ÷ UAE-valid clicks"}
              />
            </div>
            {metrics && Object.keys(metrics.clicks_by_platform).length > 0 && (
              <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
                <h2 className="text-sm font-black uppercase tracking-wide text-[var(--muted)]">Clicks by platform (UAE-valid)</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(metrics.clicks_by_platform)
                    .sort((a, b) => b[1] - a[1])
                    .map(([platform, n]) => (
                      <span
                        key={platform}
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold capitalize"
                        style={{ borderColor: "var(--border-gold)", background: "var(--cream-100)" }}
                      >
                        {platform}
                        <span style={{ color: "var(--gold-500)" }}>{n}</span>
                      </span>
                    ))}
                </div>
              </div>
            )}
            <div className="grid gap-4 lg:grid-cols-3">
              <MetricCard
                label="Average order value"
                value={metrics?.average_order_value_aed != null ? `${metrics.average_order_value_aed.toFixed(2)} AED` : "—"}
              />
              <MetricCard
                label="Upsell attach rate"
                value={metrics?.upsell_attach_rate_percent != null ? `${metrics.upsell_attach_rate_percent.toFixed(1)}%` : "—"}
                hint={`${metrics?.orders_with_upsell ?? 0} orders with upsell > 0`}
              />
              <MetricCard label="Sheet sync pending" value={metrics?.pending_sheet_sync_count ?? "—"} hint="Orders awaiting sheet push" />
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
              <h2 className="text-sm font-black uppercase tracking-wide text-[var(--muted)]">Orders by status</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {metrics && Object.keys(metrics.orders_by_status).length === 0 && (
                  <span className="text-sm text-[var(--muted)]">No orders in this UTC range.</span>
                )}
                {metrics &&
                  Object.entries(metrics.orders_by_status)
                    .sort((a, b) => b[1] - a[1])
                    .map(([st, n]) => (
                      <span
                        key={st}
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold"
                        style={{ borderColor: "var(--border-gold)", background: "var(--cream-100)" }}
                      >
                        <span className="text-[var(--emerald-950)]">{st}</span>
                        <span style={{ color: "var(--gold-500)" }}>{n}</span>
                      </span>
                    ))}
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">
                Range (UTC): {metrics?.date_from ?? dateFrom} → {metrics?.date_to ?? dateTo}
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5 text-sm leading-7 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
              <h2 className="text-sm font-black uppercase tracking-wide text-[var(--muted)]">How conversion is measured</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--muted)]">
                <li>Clicks require a paid id (Meta fbclid, TikTok ttclid, or Snap sc_click_id).</li>
                <li>Only UAE-valid clicks count: Cloudflare country header and MaxMind must agree on AE (risky IPs blocked).</li>
                <li>Conversion = orders ÷ UAE-valid clicks in the same UTC date window.</li>
              </ul>
            </div>
            {loading && <p className="text-center text-sm font-semibold text-[var(--muted)]">Loading metrics…</p>}
          </section>
        )}

        {tab === "orders" && (
          <section className="mt-8 space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="text-sm font-bold text-[var(--emerald-950)]">
                Status
                <select
                  className="mt-1 block min-w-[10rem] rounded-xl border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border-gold)", background: "white" }}
                  value={orderStatus}
                  onChange={(e) => {
                    setOrderStatus(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-[12rem] flex-1 text-sm font-bold text-[var(--emerald-950)]">
                Search (this page)
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border-gold)" }}
                  placeholder="Order id, name, phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={exportCsv}
                className="rounded-full border px-4 py-2 text-sm font-black"
                style={{ borderColor: "var(--border-gold)", color: "var(--emerald-950)" }}
              >
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
              <table className="min-w-full divide-y text-left text-sm" style={{ borderColor: "var(--border-gold)" }}>
                <thead style={{ background: "var(--cream-100)" }}>
                  <tr>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">Order</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">When</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">Customer</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">Phone</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">Status</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">Total</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">UTM</th>
                    <th className="px-4 py-3 font-black text-[var(--emerald-950)]">Items</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-gold)" }}>
                  {filteredOrders.map((o) => (
                    <tr key={o.public_order_id ?? o.created_at} className="hover:bg-[var(--cream-50)]">
                      <td className="px-4 py-3 font-mono text-xs">
                        <button
                          type="button"
                          className="font-bold underline decoration-[var(--gold-400)]"
                          style={{ color: "var(--emerald-900)" }}
                          onClick={() => void openOrder(o.public_order_id)}
                        >
                          {o.public_order_id}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-[var(--emerald-950)]">{o.customer_name}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{o.phone_display}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={o.status} />
                      </td>
                      <td className="px-4 py-3 font-black text-[var(--emerald-950)]">
                        {o.total} {o.currency}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">{o.utm_source ?? "—"}</td>
                      <td className="max-w-[14rem] truncate px-4 py-3 text-xs text-[var(--muted)]" title={o.items_preview}>
                        {o.items_preview}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ordersLoading && <p className="p-6 text-center text-sm text-[var(--muted)]">Loading orders…</p>}
              {!ordersLoading && filteredOrders.length === 0 && (
                <p className="p-6 text-center text-sm text-[var(--muted)]">No rows match filters on this page.</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="font-semibold text-[var(--muted)]">
                Total in range: <span className="text-[var(--emerald-950)]">{ordersPayload?.total ?? "—"}</span>
                {search.trim() ? ` · showing ${filteredOrders.length} after search` : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-full border px-3 py-1.5 text-xs font-black disabled:opacity-40"
                  style={{ borderColor: "var(--border-gold)" }}
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-[var(--muted)]">
                  Page {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={!ordersPayload || (page + 1) * pageSize >= ordersPayload.total}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border px-3 py-1.5 text-xs font-black disabled:opacity-40"
                  style={{ borderColor: "var(--border-gold)" }}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        )}

        {tab === "profit" && <ProfitCalculatorTab authHeader={authHeader()} />}

        {tab === "setup" && <SetupTab />}
      </div>

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-3 sm:items-center print:p-0" role="dialog">
          <div
            id="order-preview-panel"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-white shadow-2xl print:max-h-none print:shadow-none sm:max-w-xl"
            style={{ borderColor: "var(--border-gold)" }}
          >
            <div className="flex items-start justify-between gap-3 border-b px-5 py-4" style={{ borderColor: "var(--border-gold)" }}>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--gold-500)" }}>
                  Order preview
                </p>
                <p className="font-mono text-lg font-black text-[var(--emerald-950)]">{detail?.public_order_id ?? "…"}</p>
                <p className="text-xs text-[var(--muted)]">COD · pay on delivery</p>
              </div>
              <div className="flex gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full border px-3 py-1 text-xs font-black"
                  style={{ borderColor: "var(--border-gold)", color: "var(--emerald-950)" }}
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="rounded-full px-3 py-1 text-xs font-bold text-[var(--muted)] hover:bg-[var(--cream-100)]"
                >
                  Close
                </button>
              </div>
            </div>
            {detailLoading && <p className="p-8 text-center text-[var(--muted)]">Loading…</p>}
            {detail && (
              <div className="space-y-0 px-5 py-6 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-gold)", background: "var(--cream-50)" }}>
                    <p className="text-xs font-black uppercase text-[var(--muted)]">Customer</p>
                    <p className="mt-1 text-lg font-black text-[var(--emerald-950)]">{detail.customer_name}</p>
                    <p className="mt-2 font-mono text-sm font-bold" style={{ color: "var(--gold-500)" }}>
                      {detail.phone_e164}
                    </p>
                  </div>
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-gold)", background: "var(--cream-50)" }}>
                    <p className="text-xs font-black uppercase text-[var(--muted)]">Fulfillment</p>
                    <p className="mt-1 font-bold text-[var(--emerald-950)]">Status: {detail.status}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Sheet: {detail.sheet_sync_status}
                      {detail.sheet_sync_error ? ` — ${detail.sheet_sync_error}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border" style={{ borderColor: "var(--border-gold)" }}>
                  <table className="w-full text-left text-sm">
                    <thead style={{ background: "var(--emerald-950)", color: "var(--gold-300)" }}>
                      <tr>
                        <th className="px-4 py-2 font-black">Item</th>
                        <th className="px-4 py-2 font-black">Qty</th>
                        <th className="px-4 py-2 text-right font-black">Line</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "var(--border-gold)" }}>
                      {detail.items.map((it) => (
                        <tr key={`${it.sku}-${it.name}-${it.line_total}`}>
                          <td className="px-4 py-3">
                            <span className="font-bold text-[var(--emerald-950)]">{it.name}</span>
                            <span className="mt-0.5 block font-mono text-xs text-[var(--muted)]">{it.sku}</span>
                            {it.is_upsell && (
                              <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-black uppercase text-white" style={{ background: "var(--gold-500)" }}>
                                Upsell
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-bold">{it.quantity}</td>
                          <td className="px-4 py-3 text-right font-mono font-black">{it.line_total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="space-y-1 border-t px-4 py-4 text-right" style={{ borderColor: "var(--border-gold)", background: "var(--cream-100)" }}>
                    <p className="text-[var(--muted)]">
                      Subtotal <span className="font-mono font-bold text-[var(--emerald-950)]">{detail.subtotal.toFixed(2)}</span>
                    </p>
                    <p className="text-[var(--muted)]">
                      Upsells <span className="font-mono font-bold text-[var(--emerald-950)]">{detail.upsell_total.toFixed(2)}</span>
                    </p>
                    <p className="text-xl font-black text-[var(--emerald-950)]">
                      Total {detail.total.toFixed(2)} {detail.currency}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border p-4 text-xs" style={{ borderColor: "var(--border-gold)" }}>
                  <p className="font-black uppercase text-[var(--muted)]">Attribution</p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    {Object.entries(detail.utm).map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-[var(--muted)]">utm_{k}</dt>
                        <dd className="font-mono text-[var(--emerald-950)]">{v || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-[var(--muted)]">Tracking keys: {detail.tracking_keys.join(", ") || "—"}</p>
                </div>

                <pre className="mt-4 max-h-40 overflow-auto rounded-xl border p-3 text-[11px] leading-relaxed" style={{ borderColor: "var(--border-gold)", background: "#0c1814", color: "#c8e6d8" }}>
                  {JSON.stringify(
                    { event_ids: detail.event_ids, source_url: detail.source_url, landing_page: detail.landing_page },
                    null,
                    2,
                  )}
                </pre>
                <p className="mt-3 text-center text-[10px] text-[var(--muted)]">
                  Internal id · <span className="font-mono">{detail.internal_id}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DatePresets({ onPick }: { onPick: (from: string, to: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {[
        ["7d", 7],
        ["30d", 30],
        ["90d", 90],
      ].map(([label, days]) => (
        <button
          key={label}
          type="button"
          onClick={() => {
            const { from, to } = presetRange(days as number);
            onPick(from, to);
          }}
          className="rounded-full border border-white/20 px-2 py-1 text-[11px] font-bold text-white hover:bg-white/10"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
      <p className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[var(--emerald-950)]">{value}</p>
      {hint && <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-black" style={{ background: "var(--cream-100)", color: "var(--emerald-950)", border: "1px solid var(--border-gold)" }}>
      {status}
    </span>
  );
}

function SetupTab() {
  return (
    <section className="mt-8 space-y-6 text-sm leading-7" dir="ltr">
      <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
        <h2 className="text-lg font-black text-[var(--emerald-950)]">Backend environment</h2>
        <p className="mt-2 text-[var(--muted)]">
          Set these on the <strong>API</strong> service (not the Next.js storefront). The storefront proxies{" "}
          <code className="rounded bg-[var(--cream-100)] px-1">/api/admin/*</code> to your API host.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border p-4 text-xs" style={{ borderColor: "var(--border-gold)", background: "var(--cream-50)" }}>{`# Required together for POST /admin/login + JWT-protected admin routes
ADMIN_USERNAME=layali_ops
ADMIN_PASSWORD=use_a_long_random_password_here
ADMIN_JWT_SECRET=change_me_to_at_least_32_random_bytes_base64_or_hex

# Optional: profit calculator AED→USD (default ≈ 0.272294)
# AED_TO_USD_RATE=0.272294

# MaxMind + Cloudflare (cf-ipcountry) for UAE-valid click metrics
MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
ORDER_ALLOWED_COUNTRY=AE

# Example (do not commit real secrets)
# ADMIN_JWT_SECRET=$(openssl rand -hex 32)`}</pre>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--border-gold)" }}>
        <h2 className="text-lg font-black text-[var(--emerald-950)]">Database</h2>
        <p className="mt-2 text-[var(--muted)]">
          If you manage Postgres manually, run the idempotent bootstrap script once (or use <code className="rounded bg-[var(--cream-100)] px-1">alembic upgrade head</code>).
        </p>
        <p className="mt-2 font-mono text-xs text-[var(--emerald-900)]">backend/migrations/sql/layali_cod_store_postgres_bootstrap.sql</p>
        <p className="mt-2 text-[var(--muted)]">Includes: orders, order_items, tracking_events, ad_clicks.</p>
      </div>
    </section>
  );
}

function csvEscape(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
