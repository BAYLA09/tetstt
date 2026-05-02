"""initial order schema"""
from alembic import op
import sqlalchemy as sa

revision = "20260502_0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table("orders", sa.Column("id", sa.String(), primary_key=True), sa.Column("public_order_id", sa.String(), unique=True, nullable=False), sa.Column("customer_name", sa.String(), nullable=False), sa.Column("phone_e164", sa.String(), nullable=False), sa.Column("phone_hash", sa.String(), nullable=False), sa.Column("currency", sa.String(), nullable=False), sa.Column("subtotal", sa.Numeric(10, 2), nullable=False), sa.Column("upsell_total", sa.Numeric(10, 2), nullable=False, server_default="0"), sa.Column("total", sa.Numeric(10, 2), nullable=False), sa.Column("status", sa.String(), nullable=False, server_default="received"), sa.Column("source_url", sa.Text()), sa.Column("landing_page", sa.Text()), sa.Column("utm_source", sa.String()), sa.Column("utm_medium", sa.String()), sa.Column("utm_campaign", sa.String()), sa.Column("utm_content", sa.String()), sa.Column("utm_term", sa.String()), sa.Column("tracking_payload", sa.JSON()), sa.Column("event_ids", sa.JSON()), sa.Column("sheet_sync_status", sa.String(), nullable=False, server_default="pending"), sa.Column("sheet_sync_error", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index("ix_orders_phone_hash", "orders", ["phone_hash"])
    op.create_index("ix_orders_created_at", "orders", ["created_at"])
    op.create_table("order_items", sa.Column("id", sa.String(), primary_key=True), sa.Column("order_id", sa.String(), sa.ForeignKey("orders.id"), nullable=False), sa.Column("sku", sa.String(), nullable=False), sa.Column("name", sa.String(), nullable=False), sa.Column("unit_price", sa.Numeric(10, 2), nullable=False), sa.Column("quantity", sa.Integer(), nullable=False), sa.Column("line_total", sa.Numeric(10, 2), nullable=False), sa.Column("is_upsell", sa.Boolean(), nullable=False, server_default=sa.false()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])
    op.create_table("tracking_events", sa.Column("id", sa.String(), primary_key=True), sa.Column("order_id", sa.String(), sa.ForeignKey("orders.id")), sa.Column("provider", sa.String(), nullable=False), sa.Column("event_name", sa.String(), nullable=False), sa.Column("event_id", sa.String()), sa.Column("status", sa.String(), nullable=False), sa.Column("request_payload_redacted", sa.JSON()), sa.Column("response_payload", sa.JSON()), sa.Column("error", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index("ix_tracking_provider_event", "tracking_events", ["provider", "event_id"])

def downgrade():
    op.drop_table("tracking_events")
    op.drop_table("order_items")
    op.drop_table("orders")
