# Database and Orders

Use Postgres database `layalibeauty`. Store `DATABASE_URL` in backend environment variables.

## Tables

- `orders`: public order id, raw customer name, normalized phone, phone hash, totals, status, tracking/UTM payloads, sheet sync status, timestamps.
- `order_items`: SKU, Arabic item name, authoritative unit price, quantity, line total, upsell flag.
- `tracking_events`: provider, event name/id, status, redacted payload, response/error.

## Product price registry in backend

```python
PRODUCTS = {
    "LB-BUNDLE-299": {"name": "باقة ليالي بيوتي الفاخرة", "price": 299},
    "LB-SERUM-MUSK-59": {"name": "سيروم مسك المطر الأبيض", "price": 59},
    "LB-SERUM-OUD-69": {"name": "سيروم عود قصر دبي", "price": 69},
    "LB-SERUM-SET-99": {"name": "ثنائي السيروم الفاخر", "price": 99},
    "LB-UPSELL-MUSK-39": {"name": "سيروم مسك المطر الأبيض - عرض خاص", "price": 39},
    "LB-UPSELL-OUD-39": {"name": "سيروم عود قصر دبي - عرض خاص", "price": 39},
}
```
