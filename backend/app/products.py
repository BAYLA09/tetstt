from decimal import Decimal
from typing import TypedDict

class Product(TypedDict):
    name: str
    price: Decimal

PRODUCTS: dict[str, Product] = {
    "LB-BUNDLE-299": {"name": "باقة ليالي بيوتي الفاخرة", "price": Decimal("299")},
    "LB-SERUM-MUSK-59": {"name": "سيروم مسك المطر الأبيض", "price": Decimal("59")},
    "LB-SERUM-OUD-69": {"name": "سيروم عود قصر دبي", "price": Decimal("69")},
    "LB-SERUM-SET-99": {"name": "ثنائي السيروم الفاخر", "price": Decimal("99")},
    "LB-UPSELL-MUSK-39": {"name": "سيروم مسك المطر الأبيض - عرض خاص", "price": Decimal("39")},
    "LB-UPSELL-OUD-39": {"name": "سيروم عود قصر دبي - عرض خاص", "price": Decimal("39")},
}

UPSELL_SKUS = {"LB-UPSELL-MUSK-39", "LB-UPSELL-OUD-39"}
