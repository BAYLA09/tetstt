"""Webhook must not report sent when Apps Script returns Google echo JSON."""

from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

from app.services import sheet_webhook


def test_send_order_to_sheet_rejects_success_only_json() -> None:
    async def _run() -> None:
        mock_resp = MagicMock()
        mock_resp.raise_for_status = MagicMock()
        mock_resp.json = MagicMock(return_value={"success": True})

        cm = MagicMock()
        cm.post = AsyncMock(return_value=mock_resp)
        cm.__aenter__ = AsyncMock(return_value=cm)
        cm.__aexit__ = AsyncMock(return_value=False)

        fake_settings = MagicMock()
        fake_settings.effective_sheet_webhook_url = "https://script.google.com/macros/s/test/exec"
        fake_settings.effective_sheet_webhook_secret = None

        with (
            patch("app.services.sheet_webhook.settings", fake_settings),
            patch("app.services.sheet_webhook.httpx.AsyncClient", return_value=cm),
        ):
            status, err = await sheet_webhook.send_order_to_sheet({"orderid": "layali-test-1"})

        assert status == "failed"
        assert err and "success:true" in err

    asyncio.run(_run())
