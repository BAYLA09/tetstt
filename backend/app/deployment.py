"""Build-time / runtime deployment metadata (no secrets)."""

from __future__ import annotations

import os


def deploy_commit_sha() -> str:
    return (
        os.environ.get("DEPLOY_COMMIT_SHA")
        or os.environ.get("GIT_SHA")
        or os.environ.get("COMMIT_SHA")
        or os.environ.get("GITHUB_SHA")
        or "unknown"
    )


def deploy_build_time_utc() -> str:
    return (
        os.environ.get("DEPLOY_BUILD_TIME_UTC")
        or os.environ.get("BUILD_TIME_UTC")
        or os.environ.get("BUILD_TIME")
        or "unknown"
    )
