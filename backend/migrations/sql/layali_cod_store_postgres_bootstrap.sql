-- Layali Beauty — Postgres bootstrap for COD storefront + admin metrics.
-- Use when you are NOT running Alembic (otherwise prefer: `alembic upgrade head`).
-- Safe to re-run: CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS.

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    public_order_id VARCHAR(32) UNIQUE,
    customer_name VARCHAR(160) NOT NULL,
    phone_e164 VARCHAR(32) NOT NULL,
    phone_hash VARCHAR(64) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'AED',
    subtotal NUMERIC(10, 2) NOT NULL,
    upsell_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'received',
    source_url TEXT,
    landing_page TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    tracking_payload JSONB DEFAULT '{}'::jsonb,
    event_ids JSONB DEFAULT '{}'::jsonb,
    sheet_sync_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    sheet_sync_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_orders_phone_hash ON orders (phone_hash);
CREATE INDEX IF NOT EXISTS ix_orders_created_at ON orders (created_at);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    sku VARCHAR(80) NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    line_total NUMERIC(10, 2) NOT NULL,
    is_upsell BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_order_items_order_id ON order_items (order_id);

-- ---------------------------------------------------------------------------
-- tracking_events (pixels / CAPI audit)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tracking_events (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) REFERENCES orders (id) ON DELETE SET NULL,
    provider VARCHAR(40) NOT NULL,
    event_name VARCHAR(80) NOT NULL,
    event_id VARCHAR(160),
    status VARCHAR(32) NOT NULL,
    request_payload_redacted JSONB DEFAULT '{}'::jsonb,
    response_payload JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_tracking_provider_event ON tracking_events (provider, event_id);

-- ---------------------------------------------------------------------------
-- ad_clicks (paid landing sessions — admin conversion denominator)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ad_clicks (
    id VARCHAR(36) PRIMARY KEY,
    fbclid VARCHAR(512),
    ttclid VARCHAR(512),
    sc_click_id VARCHAR(512),
    landing_page TEXT,
    path VARCHAR(512),
    user_agent VARCHAR(512),
    client_ip VARCHAR(45),
    cf_country VARCHAR(2),
    maxmind_country VARCHAR(2),
    country_code VARCHAR(2),
    geo_valid_uae BOOLEAN NOT NULL DEFAULT FALSE,
    geo_reject_reason VARCHAR(64),
    ad_platform VARCHAR(16),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_ad_clicks_created_at ON ad_clicks (created_at);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_fbclid ON ad_clicks (fbclid);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_ttclid ON ad_clicks (ttclid);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_sc_click_id ON ad_clicks (sc_click_id);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_ad_platform ON ad_clicks (ad_platform);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_geo_valid_created ON ad_clicks (geo_valid_uae, created_at);
