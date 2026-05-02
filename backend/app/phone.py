import hashlib
import re

class InvalidPhone(ValueError):
    pass

def normalize_uae_phone(value: str) -> str:
    compact = re.sub(r"[\s().-]", "", value or "")
    if compact.startswith("+"):
        compact = compact[1:]
    if compact.startswith("00971"):
        compact = "971" + compact[5:]
    if compact.startswith("971"):
        compact = compact[3:]
    if compact.startswith("0"):
        compact = compact[1:]
    if not re.fullmatch(r"5\d{8}", compact):
        raise InvalidPhone("Invalid UAE mobile phone")
    return f"+971{compact}"

def phone_hash_for_duplicate(phone_e164: str) -> str:
    return hashlib.sha256(phone_e164.encode()).hexdigest()

def phone_hash_for_meta_snap(phone_e164: str) -> str:
    return hashlib.sha256(phone_e164.replace("+", "").encode()).hexdigest()

def phone_hash_for_tiktok(phone_e164: str) -> str:
    return hashlib.sha256(phone_e164.encode()).hexdigest()
