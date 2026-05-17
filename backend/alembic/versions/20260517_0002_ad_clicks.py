"""ad_clicks table for admin metrics

Revision ID: 20260517_0002
Revises: 20260502_0001
Create Date: 2026-05-17
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260517_0002"
down_revision: str | None = "20260502_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "ad_clicks",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("fbclid", sa.String(length=512), nullable=True),
        sa.Column("ttclid", sa.String(length=512), nullable=True),
        sa.Column("sc_click_id", sa.String(length=512), nullable=True),
        sa.Column("landing_page", sa.Text(), nullable=True),
        sa.Column("path", sa.String(length=512), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_ad_clicks_created_at", "ad_clicks", ["created_at"])
    op.create_index("ix_ad_clicks_fbclid", "ad_clicks", ["fbclid"])
    op.create_index("ix_ad_clicks_ttclid", "ad_clicks", ["ttclid"])
    op.create_index("ix_ad_clicks_sc_click_id", "ad_clicks", ["sc_click_id"])


def downgrade() -> None:
    op.drop_index("ix_ad_clicks_sc_click_id", table_name="ad_clicks")
    op.drop_index("ix_ad_clicks_ttclid", table_name="ad_clicks")
    op.drop_index("ix_ad_clicks_fbclid", table_name="ad_clicks")
    op.drop_index("ix_ad_clicks_created_at", table_name="ad_clicks")
    op.drop_table("ad_clicks")
