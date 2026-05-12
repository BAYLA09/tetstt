"""UAE phone normalization used by POST /orders."""

import pytest

from app.services.phone import normalize_phone


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("0525449655", "+971525449655"),
        ("+971525449655", "+971525449655"),
        ("971525449655", "+971525449655"),
        ("525449655", "+971525449655"),
        ("00971525449655", "+971525449655"),
    ],
)
def test_normalize_uae_mobile_variants(raw: str, expected: str) -> None:
    assert normalize_phone(raw) == expected


def test_normalize_rejects_non_mobile() -> None:
    with pytest.raises(ValueError):
        normalize_phone("12345")
