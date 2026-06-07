import pytest

from app.services.geo_click import detect_ad_platform, evaluate_uae_click_geo


def test_detect_ad_platform_priority() -> None:
    assert detect_ad_platform(fbclid="x", ttclid="y", sc_click_id="z") == "meta"
    assert detect_ad_platform(fbclid=None, ttclid="y", sc_click_id="z") == "tiktok"
    assert detect_ad_platform(fbclid=None, ttclid=None, sc_click_id="z") == "snap"


@pytest.mark.parametrize(
    "cf,mm,block,expected,reason",
    [
        ("AE", "AE", None, True, None),
        ("AE", None, None, True, None),
        (None, "AE", None, True, None),
        ("US", "AE", None, False, "country_not_AE"),
        ("AE", "US", None, False, "country_not_AE"),
        (None, None, None, False, "geo_unknown"),
        ("AE", "AE", "blocked_trait:vpn", False, "blocked_trait:vpn"),
    ],
)
def test_evaluate_uae_click_geo(cf: str | None, mm: str | None, block: str | None, expected: bool, reason: str | None) -> None:
    valid, country, reject = evaluate_uae_click_geo(cf_country=cf, maxmind_country=mm, maxmind_block_reason=block)
    assert valid is expected
    assert reject == reason
    if expected:
        assert country == "AE"
