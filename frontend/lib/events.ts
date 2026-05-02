export function createEventId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `${prefix}_${Date.now()}_${random}`;
}

export function collectTracking(searchParams: URLSearchParams) {
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc") || (searchParams.get("fbclid") ? `fb.1.${Date.now()}.${searchParams.get("fbclid")}` : ""),
    ttclid: searchParams.get("ttclid") || "",
    ttp: readCookie("_ttp"),
    sc_click_id: searchParams.get("ScCid") || searchParams.get("sc_click_id") || "",
    sc_cookie1: readCookie("sc_cookie1"),
  };
}

export function collectUtm(searchParams: URLSearchParams) {
  return {
    source: searchParams.get("utm_source") || "",
    medium: searchParams.get("utm_medium") || "",
    campaign: searchParams.get("utm_campaign") || "",
    content: searchParams.get("utm_content") || "",
    term: searchParams.get("utm_term") || "",
  };
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  return document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))?.split("=")[1] || "";
}
