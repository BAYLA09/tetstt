/** Verbose checkout diagnostics (enable with NEXT_PUBLIC_DEBUG_CHECKOUT=true). */
export function isCheckoutVerboseDebug(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEBUG_CHECKOUT === "true"
  );
}

export function checkoutVerboseLog(...args: unknown[]): void {
  if (!isCheckoutVerboseDebug()) return;
  console.debug("[checkout:verbose]", ...args);
}
