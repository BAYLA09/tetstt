"""ad_clicks geo + platform columns for UAE-valid metrics

Revision ID: 20260521_0003
Revises: 20260517_0002
Create Date: 2026-05-21

"""

from alembic import op
import sqlalchemy as sa

revision = "20260521_0003"
down_revision = "20260517_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("ad_clicks", sa.Column("client_ip", sa.String(length=45), nullable=True))
    op.add_column("ad_clicks", sa.Column("cf_country", sa.String(length=2), nullable=True))
    op.add_column("ad_clicks", sa.Column("maxmind_country", sa.String(length=2), nullable=True))
    op.add_column("ad_clicks", sa.Column("country_code", sa.String(length=2), nullable=True))
    op.add_column(
        "ad_clicks",
        sa.Column("geo_valid_uae", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column("ad_clicks", sa.Column("geo_reject_reason", sa.String(length=64), nullable=True))
    op.add_column("ad_clicks", sa.Column("ad_platform", sa.String(length=16), nullable=True))
    op.create_index("ix_ad_clicks_ad_platform", "ad_clicks", ["ad_platform"])
    op.create_index("ix_ad_clicks_geo_valid_created", "ad_clicks", ["geo_valid_uae", "created_at"])


def downgrade() -> None:
    op.drop_index("ix_ad_clicks_geo_valid_created", table_name="ad_clicks")
    op.drop_index("ix_ad_clicks_ad_platform", table_name="ad_clicks")
    op.drop_column("ad_clicks", "ad_platform")
    op.drop_column("ad_clicks", "geo_reject_reason")
    op.drop_column("ad_clicks", "geo_valid_uae")
    op.drop_column("ad_clicks", "country_code")
    op.drop_column("ad_clicks", "maxmind_country")
    op.drop_column("ad_clicks", "cf_country")
    op.drop_column("ad_clicks", "client_ip")
