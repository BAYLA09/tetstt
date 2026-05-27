from decimal import Decimal

# Lamp hero offer tiers (must match storefront `offerTiers` SKUs and prices).
LAMP_OFFER_SKUS = frozenset({"LB-LAMP-189", "LB-LAMP-OUD-379", "LB-LAMP-TRIPLE-449"})

PRODUCTS = {
    # sheet_sku: stable short codes for Google Sheet / ops (one per catalog line).
    "LB-BUNDLE-299": {"name": "باقة ليالي بيوتي الفاخرة", "price": Decimal("299"), "sheet_sku": "LY-8F3K2"},
    "LB-SERUM-MUSK-59": {"name": "سيروم مسك المطر الأبيض", "price": Decimal("59"), "sheet_sku": "LY-4M7Q9"},
    "LB-SERUM-OUD-69": {"name": "سيروم عود قصر دبي", "price": Decimal("69"), "sheet_sku": "LY-6D2P8"},
    # Dubai Palace Oud PDP quantity tiers (must match storefront `offerTiers` / landing `offers`).
    "LB-OUD-ONE-199": {"name": "سيروم عود قصر دبي — عبوة واحدة", "price": Decimal("199"), "sheet_sku": "LY-OUD1"},
    "LB-OUD-TWO-279": {"name": "سيروم عود قصر دبي — عبوتان", "price": Decimal("279"), "sheet_sku": "LY-OUD2"},
    "LB-OUD-THREE-349": {"name": "سيروم عود قصر دبي — ثلاث عبوات", "price": Decimal("349"), "sheet_sku": "LY-OUD3"},
    "LB-SERUM-SET-99": {"name": "ثنائي السيروم الفاخر", "price": Decimal("99"), "sheet_sku": "LY-9S5T1"},
    "LB-LAMP-189": {"name": "موقد ليالي الفاخر", "price": Decimal("299"), "sheet_sku": "LY-L2MP1"},
    "LB-LAMP-OUD-379": {"name": "موقد ليالي الفاخر + سيروم عود قصر دبي", "price": Decimal("379"), "sheet_sku": "LY-L3OU2"},
    "LB-LAMP-TRIPLE-449": {"name": "موقد ليالي الفاخر + سيرومين عود قصر دبي", "price": Decimal("449"), "sheet_sku": "LY-L4TP3"},
    "LB-UPSELL-MUSK-39": {"name": "سيروم مسك المطر الأبيض - عرض خاص", "price": Decimal("39"), "sheet_sku": "LY-3U8M4"},
    "LB-UPSELL-OUD-39": {"name": "سيروم عود قصر دبي - عرض خاص", "price": Decimal("39"), "sheet_sku": "LY-7O2D5"},
}


def lamp_bundle_prices() -> dict[str, str]:
    """Expose tier prices for /version (AED, string for JSON)."""
    out: dict[str, str] = {}
    for sku in sorted(LAMP_OFFER_SKUS):
        row = PRODUCTS.get(sku)
        if row:
            out[sku] = str(row["price"])
    return out
