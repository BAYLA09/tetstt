from app.services.sheet_webhook import interpret_apps_script_response


def test_interpret_appscript_ok_true() -> None:
    ok, err = interpret_apps_script_response({"ok": True})
    assert ok is True
    assert err is None


def test_interpret_appscript_ok_false() -> None:
    ok, err = interpret_apps_script_response({"ok": False, "error": "Unauthorized"})
    assert ok is False
    assert err == "Unauthorized"


def test_interpret_rejects_google_success_only_json() -> None:
    ok, err = interpret_apps_script_response({"success": True})
    assert ok is False
    assert err and "success:true" in err
