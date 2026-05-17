-- Layali Beauty: ad click tracking for admin conversion metrics (Postgres).
-- Run against the same database as ORDER / Alembic migrations.

CREATE TABLE IF NOT EXISTS ad_clicks (
    id VARCHAR(36) PRIMARY KEY,
    fbclid VARCHAR(512),
    ttclid VARCHAR(512),
    sc_click_id VARCHAR(512),
    landing_page TEXT,
    path VARCHAR(512),
    user_agent VARCHAR(512),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_ad_clicks_created_at ON ad_clicks (created_at);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_fbclid ON ad_clicks (fbclid);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_ttclid ON ad_clicks (ttclid);
CREATE INDEX IF NOT EXISTS ix_ad_clicks_sc_click_id ON ad_clicks (sc_click_id);
