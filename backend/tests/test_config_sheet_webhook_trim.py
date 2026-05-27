from app.config import Settings


def test_sheet_webhook_url_strips_whitespace(monkeypatch) -> None:
    monkeypatch.setenv("GOOGLE_SHEETS_WEBHOOK_URL", "  https://script.google.com/macros/s/test/exec  ")
    monkeypatch.setenv("SHEETS_WEBHOOK_SECRET", "  secret-value  ")
    s = Settings()
    assert s.google_sheets_webhook_url == "https://script.google.com/macros/s/test/exec"
    assert s.sheets_webhook_secret == "secret-value"
