from __future__ import annotations

import logging
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models import AdClick
from app.schemas import AdClickIn

log = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/click", status_code=204)
async def record_ad_click(
    payload: AdClickIn,
    session: AsyncSession = Depends(get_session),
    user_agent: Annotated[str | None, Header(alias="user-agent")] = None,
) -> None:
    """Persist one row per landing that carries a paid click id (fbclid, ttclid, or sc_click_id)."""
    if not (payload.fbclid or payload.ttclid or payload.sc_click_id):
        raise HTTPException(status_code=400, detail="At least one of fbclid, ttclid, or sc_click_id is required")

    row = AdClick(
        id=str(uuid4()),
        fbclid=payload.fbclid,
        ttclid=payload.ttclid,
        sc_click_id=payload.sc_click_id,
        landing_page=payload.landing_page,
        path=payload.path,
        user_agent=(user_agent or "")[:512] or None,
    )
    session.add(row)
    await session.commit()
    log.debug(
        "ad_click_recorded path=%s has_fb=%s has_tt=%s has_sc=%s ip_present=%s",
        payload.path,
        bool(payload.fbclid),
        bool(payload.ttclid),
        bool(payload.sc_click_id),
    )
