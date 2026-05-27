-- =============================================================================
-- DESTRUCTIVE: deletes ALL orders and related rows. Use ONLY on dev/staging
-- or after explicit backup on production. Never run against production by mistake.
-- =============================================================================
-- Suggested order (Postgres / SQLite with FKs):
BEGIN;

DELETE FROM tracking_events;
DELETE FROM order_items;
DELETE FROM orders;

COMMIT;
