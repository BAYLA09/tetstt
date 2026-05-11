from decimal import Decimal

# Catalog prices + sheet codes. Line items may override price from the storefront when the same
# logical SKU is sold at a tier price (payload item.price).
PRODUCTS = {
    "LB-BUNDLE-299": {"name": "باقة ليالي بيوتي الفاخرة", "price": Decimal("299"), "sheet_sku": "LY-8F3K2"},
    "LB-BUNDLE-379": {"name": "عرض مركّب — موقد + سيرومان", "price": Decimal("379"), "sheet_sku": "LY-B379"},
    "LB-BUNDLE-449": {"name": "عرض كامل — موقد + عود + مسك", "price": Decimal("449"), "sheet_sku": "LY-B449"},
    "LB-LAMP-189": {"name": "موقد ليالي الفاخر", "price": Decimal("299"), "sheet_sku": "LY-L2MP1"},
    "LB-SERUM-MUSK-59": {"name": "سيروم مسك المطر الأبيض", "price": Decimal("59"), "sheet_sku": "LY-4M7Q9"},
    "LB-SERUM-OUD-69": {"name": "سيروم عود قصر دبي", "price": Decimal("69"), "sheet_sku": "LY-6D2P8"},
    "LB-SERUM-OUD-199": {"name": "سيروم عود قصر دبي", "price": Decimal("199"), "sheet_sku": "LY-6D2P8"},
    "LB-SERUM-DUO-279": {"name": "ثنائي السيروم الفاخر", "price": Decimal("279"), "sheet_sku": "LY-9S5T1"},
    "LB-SERUM-SET-99": {"name": "ثنائي السيروم الفاخر", "price": Decimal("99"), "sheet_sku": "LY-9S5T1"},
    "LB-UPSELL-MUSK-39": {"name": "سيروم مسك المطر الأبيض - عرض خاص", "price": Decimal("39"), "sheet_sku": "LY-3U8M4"},
    "LB-UPSELL-OUD-39": {"name": "سيروم عود قصر دبي - عرض خاص", "price": Decimal("39"), "sheet_sku": "LY-7O2D5"},
    "LB-UPSELL-OUD-49": {"name": "سيروم عود قصر دبي - عرض خاص", "price": Decimal("49"), "sheet_sku": "LY-7O2D5"},
}
