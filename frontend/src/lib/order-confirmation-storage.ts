const KEY = "layali_last_checkout_v1";

export type LastCheckoutSnapshot = {
  name: string;
  phone: string;
  total: number;
  skus: string[];
  savedAt: number;
};

export function saveLastCheckoutSnapshot(data: LastCheckoutSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function readLastCheckoutSnapshot(): LastCheckoutSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as LastCheckoutSnapshot;
    if (!j || typeof j.name !== "string" || typeof j.phone !== "string" || typeof j.total !== "number") return null;
    const skus = Array.isArray(j.skus) ? j.skus.filter((x): x is string => typeof x === "string") : [];
    return { ...j, skus };
  } catch {
    return null;
  }
}
