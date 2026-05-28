import pytest

from app.services.cod_economics import CodEconomicsInput, breakeven_max_cpl, compute_cod_economics


def test_compute_cod_economics_positive_profit_scenario() -> None:
    inp = CodEconomicsInput(
        leads=100,
        cost_per_lead_usd=5.0,
        confirmation_rate=0.4,
        delivery_rate=0.7,
        product_cost_per_unit_usd=10.0,
        aov_usd=80.0,
        avg_pieces_per_order=1.5,
    )
    r = compute_cod_economics(inp)
    assert r.confirmed == 40.0
    assert r.delivered == 28.0
    assert r.returned == 12.0
    assert r.gross_revenue_usd == 2240.0
    assert r.cod_fees_usd == pytest.approx(112.0)
    assert r.profit_usd > 0


def test_breakeven_max_cpl() -> None:
    inp = CodEconomicsInput(
        leads=200,
        cost_per_lead_usd=0.0,
        confirmation_rate=0.35,
        delivery_rate=0.75,
        product_cost_per_unit_usd=8.0,
        aov_usd=70.0,
        avg_pieces_per_order=1.2,
    )
    max_cpl = breakeven_max_cpl(inp)
    assert max_cpl is not None
    assert max_cpl > 0
    at_break = compute_cod_economics(
        CodEconomicsInput(
            leads=inp.leads,
            cost_per_lead_usd=max_cpl,
            confirmation_rate=inp.confirmation_rate,
            delivery_rate=inp.delivery_rate,
            product_cost_per_unit_usd=inp.product_cost_per_unit_usd,
            aov_usd=inp.aov_usd,
            avg_pieces_per_order=inp.avg_pieces_per_order,
        ),
    )
    assert at_break.profit_usd == pytest.approx(0.0, abs=0.05)
