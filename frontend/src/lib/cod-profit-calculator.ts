/**
 * COD profit / breakeven model (USD). Mirrors backend `cod_economics.py`.
 */

export const COD_NETWORK_FEE_RATE = 0.05;
export const CALL_CENTER_CONFIRMED_OR_RETURNED_USD = 1;
export const CALL_CENTER_DELIVERED_USD = 2;
export const FULFILLMENT_DELIVERED_USD = 5.99;
export const FULFILLMENT_RETURNED_USD = 4.99;

export type CodEconomicsInput = {
  leads: number;
  costPerLeadUsd: number;
  confirmationRate: number;
  deliveryRate: number;
  productCostPerUnitUsd: number;
  aovUsd: number;
  avgPiecesPerOrder: number;
};

export type CodEconomicsResult = {
  confirmed: number;
  delivered: number;
  returned: number;
  adSpendUsd: number;
  grossRevenueUsd: number;
  codFeesUsd: number;
  netRevenueUsd: number;
  callCenterUsd: number;
  fulfillmentUsd: number;
  productCostUsd: number;
  totalCostUsd: number;
  profitUsd: number;
  profitPerDeliveredUsd: number | null;
  marginOnNetRevenuePercent: number | null;
};

export function aedToUsd(amountAed: number, rate: number): number {
  return Math.round(amountAed * rate * 10000) / 10000;
}

export function computeCodEconomics(inp: CodEconomicsInput): CodEconomicsResult {
  const leads = Math.max(0, inp.leads);
  const cr = Math.min(1, Math.max(0, inp.confirmationRate));
  const dr = Math.min(1, Math.max(0, inp.deliveryRate));
  const pieces = Math.max(0, inp.avgPiecesPerOrder);
  const productUnit = Math.max(0, inp.productCostPerUnitUsd);
  const aov = Math.max(0, inp.aovUsd);
  const cpl = Math.max(0, inp.costPerLeadUsd);

  const confirmed = leads * cr;
  const delivered = confirmed * dr;
  const returned = Math.max(0, confirmed - delivered);

  const adSpend = leads * cpl;
  const grossRevenue = delivered * aov;
  const codFees = grossRevenue * COD_NETWORK_FEE_RATE;
  const netRevenue = grossRevenue - codFees;

  const callCenter =
    returned * CALL_CENTER_CONFIRMED_OR_RETURNED_USD + delivered * CALL_CENTER_DELIVERED_USD;
  const fulfillment = returned * FULFILLMENT_RETURNED_USD + delivered * FULFILLMENT_DELIVERED_USD;
  const productCost = (delivered + returned) * pieces * productUnit;

  const totalCost = adSpend + callCenter + fulfillment + productCost;
  const profit = netRevenue - totalCost;

  const profitPerDelivered = delivered > 0 ? profit / delivered : null;
  const marginPct = netRevenue > 0 ? (profit / netRevenue) * 100 : null;

  const r = (n: number) => Math.round(n * 100) / 100;

  return {
    confirmed: r(confirmed),
    delivered: r(delivered),
    returned: r(returned),
    adSpendUsd: r(adSpend),
    grossRevenueUsd: r(grossRevenue),
    codFeesUsd: r(codFees),
    netRevenueUsd: r(netRevenue),
    callCenterUsd: r(callCenter),
    fulfillmentUsd: r(fulfillment),
    productCostUsd: r(productCost),
    totalCostUsd: r(totalCost),
    profitUsd: r(profit),
    profitPerDeliveredUsd: profitPerDelivered != null ? r(profitPerDelivered) : null,
    marginOnNetRevenuePercent: marginPct != null ? r(marginPct) : null,
  };
}

export function breakevenMaxCpl(inp: CodEconomicsInput): number | null {
  if (inp.leads <= 0) return null;
  const base = computeCodEconomics({ ...inp, costPerLeadUsd: 0 });
  const operatingProfit = base.netRevenueUsd - (base.totalCostUsd - base.adSpendUsd);
  return operatingProfit > 0 ? Math.round((operatingProfit / inp.leads) * 10000) / 10000 : 0;
}

export function breakevenMinConfirmationRate(inp: CodEconomicsInput): number | null {
  if (inp.leads <= 0) return null;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    const trial = computeCodEconomics({ ...inp, confirmationRate: mid });
    if (trial.profitUsd >= 0) hi = mid;
    else lo = mid;
  }
  return Math.round(hi * 10000) / 10000;
}
