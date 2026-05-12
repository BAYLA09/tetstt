"""Order payloads normalize SKU strings (strip whitespace)."""

from app.schemas import OrderItemIn, UpsellCreate


def test_order_item_strips_sku_whitespace() -> None:
    item = OrderItemIn(sku="  LB-LAMP-OUD-379  ", quantity=1)
    assert item.sku == "LB-LAMP-OUD-379"


def test_upsell_strips_sku_whitespace() -> None:
    u = UpsellCreate(sku="\tLB-SERUM-OUD-69\n")
    assert u.sku == "LB-SERUM-OUD-69"
