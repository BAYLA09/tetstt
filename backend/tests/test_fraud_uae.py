"""Fraud gate must not block normalized UAE national numbers."""

from app.services.fraud import _is_uae_mobile_cod, is_uae_national_phone_e164


def test_uae_mobile_cod_digits() -> None:
    assert _is_uae_mobile_cod("+971525449655")
    assert _is_uae_mobile_cod("0525449655") is False  # router normalizes to E.164 before fraud


def test_uae_national_any_prefix971() -> None:
    assert is_uae_national_phone_e164("+971525449655")
    assert is_uae_national_phone_e164("+97142345678")
    assert is_uae_national_phone_e164("+447700900123") is False
