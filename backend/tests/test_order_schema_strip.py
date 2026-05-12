from app.schemas import OrderCreate, OrderItemIn


def test_ordercreate_strips_phone_and_name() -> None:
    o = OrderCreate(
        customer_name="  ab  ",
        phone=" 0525449655 ",
        items=[OrderItemIn(sku="LB-BUNDLE-299", quantity=1)],
    )
    assert o.phone == "0525449655"
    assert o.customer_name == "ab"
