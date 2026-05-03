import hashlib
import re


def normalize_phone(value: str) -> str:
    digits = re.sub(r"\D", "", value or "")
    if digits.startswith("00971"):
        digits = digits[2:]

    if digits.startswith("971"):
        local = digits[3:]
        country_code = "971"
    elif digits.startswith("05"):
        local = digits[1:]
        country_code = "971"
    elif digits.startswith("5"):
        local = digits
        country_code = "971"
    else:
        raise ValueError("Enter a valid UAE mobile number.")

    if not re.fullmatch(r"5\d{8}", local):
        raise ValueError("Enter a valid UAE mobile number.")

    return f"+{country_code}{local}"


def normalize_uae_phone(value: str) -> str:
    # Backward-compatible name used by the order router.
    return normalize_phone(value)


def numeric_phone(phone_e164: str) -> str:
    return re.sub(r"\D", "", phone_e164)


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()


def phone_hash(phone_e164: str) -> str:
    return sha256_hex(numeric_phone(phone_e164))

