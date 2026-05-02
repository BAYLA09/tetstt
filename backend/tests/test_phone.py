import pytest
from app.phone import InvalidPhone, normalize_uae_phone, phone_hash_for_meta_snap, phone_hash_for_tiktok

@pytest.mark.parametrize("raw", ["0501234567", "501234567", "+971501234567", "00971501234567"])
def test_normalizes_valid_uae_phone(raw):
    assert normalize_uae_phone(raw) == "+971501234567"

@pytest.mark.parametrize("raw", ["040123456", "+966501234567", "050123456", "05012345678"])
def test_rejects_invalid_phones(raw):
    with pytest.raises(InvalidPhone):
        normalize_uae_phone(raw)

def test_provider_hash_inputs_differ():
    phone = "+971501234567"
    assert phone_hash_for_meta_snap(phone) != phone_hash_for_tiktok(phone)
