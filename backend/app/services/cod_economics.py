from __future__ import annotations

from dataclasses import dataclass

# COD network fee (5% of collected revenue on delivered orders).
COD_NETWORK_FEE_RATE = 0.05

# Call center (USD).
CALL_CENTER_CONFIRMED_OR_RETURNED_USD = 1.0
CALL_CENTER_DELIVERED_USD = 2.0

# Fulfillment / logistics (USD).
FULFILLMENT_DELIVERED_USD = 5.99
FULFILLMENT_RETURNED_USD = 4.99

DEFAULT_AED_TO_USD = 0.272294  # 1 AED ≈ 0.272 USD (1/3.6725)


@dataclass
class CodEconomicsInput:
    leads: float
    cost_per_lead_usd: float
    confirmation_rate: float
    delivery_rate: float
    product_cost_per_unit_usd: float
    aov_usd: float
    avg_pieces_per_order: float


@dataclass
class CodEconomicsResult:
    confirmed: float
    delivered: float
    returned: float
    ad_spend_usd: float
    gross_revenue_usd: float
    cod_fees_usd: float
    net_revenue_usd: float
    call_center_usd: float
    fulfillment_usd: float
    product_cost_usd: float
    total_cost_usd: float
    profit_usd: float
    profit_per_delivered_usd: float | None
    margin_on_net_revenue_percent: float | None


def aed_to_usd(amount_aed: float, rate: float = DEFAULT_AED_TO_USD) -> float:
    return round(amount_aed * rate, 4)


def compute_cod_economics(inp: CodEconomicsInput) -> CodEconomicsResult:
    leads = max(0.0, inp.leads)
    cr = min(1.0, max(0.0, inp.confirmation_rate))
    dr = min(1.0, max(0.0, inp.delivery_rate))
    pieces = max(0.0, inp.avg_pieces_per_order)
    product_unit = max(0.0, inp.product_cost_per_unit_usd)
    aov = max(0.0, inp.aov_usd)
    cpl = max(0.0, inp.cost_per_lead_usd)

    confirmed = leads * cr
    delivered = confirmed * dr
    returned = max(0.0, confirmed - delivered)

    ad_spend = leads * cpl
    gross_revenue = delivered * aov
    cod_fees = gross_revenue * COD_NETWORK_FEE_RATE
    net_revenue = gross_revenue - cod_fees

    call_center = returned * CALL_CENTER_CONFIRMED_OR_RETURNED_USD + delivered * CALL_CENTER_DELIVERED_USD
    fulfillment = returned * FULFILLMENT_RETURNED_USD + delivered * FULFILLMENT_DELIVERED_USD
    product_cost = (delivered + returned) * pieces * product_unit

    total_cost = ad_spend + call_center + fulfillment + product_cost
    profit = net_revenue - total_cost

    profit_per_delivered = (profit / delivered) if delivered > 0 else None
    margin_pct = (profit / net_revenue * 100.0) if net_revenue > 0 else None

    return CodEconomicsResult(
        confirmed=round(confirmed, 2),
        delivered=round(delivered, 2),
        returned=round(returned, 2),
        ad_spend_usd=round(ad_spend, 2),
        gross_revenue_usd=round(gross_revenue, 2),
        cod_fees_usd=round(cod_fees, 2),
        net_revenue_usd=round(net_revenue, 2),
        call_center_usd=round(call_center, 2),
        fulfillment_usd=round(fulfillment, 2),
        product_cost_usd=round(product_cost, 2),
        total_cost_usd=round(total_cost, 2),
        profit_usd=round(profit, 2),
        profit_per_delivered_usd=round(profit_per_delivered, 2) if profit_per_delivered is not None else None,
        margin_on_net_revenue_percent=round(margin_pct, 2) if margin_pct is not None else None,
    )


def breakeven_max_cpl(inp: CodEconomicsInput) -> float | None:
    """Max cost per lead (USD) to break even at zero profit."""
    if inp.leads <= 0:
        return None
    probe = CodEconomicsInput(
        leads=inp.leads,
        cost_per_lead_usd=0.0,
        confirmation_rate=inp.confirmation_rate,
        delivery_rate=inp.delivery_rate,
        product_cost_per_unit_usd=inp.product_cost_per_unit_usd,
        aov_usd=inp.aov_usd,
        avg_pieces_per_order=inp.avg_pieces_per_order,
    )
    base = compute_cod_economics(probe)
  # profit without ad spend
    operating_profit = base.net_revenue_usd - (base.total_cost_usd - base.ad_spend_usd)
    return round(operating_profit / inp.leads, 4) if operating_profit > 0 else 0.0


def breakeven_min_confirmation_rate(inp: CodEconomicsInput) -> float | None:
    """Min confirmation rate (0–1) to break even at current CPL."""
    if inp.leads <= 0:
        return None
    lo, hi = 0.0, 1.0
    for _ in range(48):
        mid = (lo + hi) / 2
        trial = CodEconomicsInput(
            leads=inp.leads,
            cost_per_lead_usd=inp.cost_per_lead_usd,
            confirmation_rate=mid,
            delivery_rate=inp.delivery_rate,
            product_cost_per_unit_usd=inp.product_cost_per_unit_usd,
            aov_usd=inp.aov_usd,
            avg_pieces_per_order=inp.avg_pieces_per_order,
        )
        if compute_cod_economics(trial).profit_usd >= 0:
            hi = mid
        else:
            lo = mid
    return round(hi, 4)
