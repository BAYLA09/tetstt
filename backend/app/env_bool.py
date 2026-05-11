"""Strict boolean parsing from process environment (EasyPanel / Docker)."""

from __future__ import annotations

import os


def env_bool(name: str, default: bool = False) -> bool:
    """
    Parse env as bool. The string "false" must NOT be truthy.

    True:  1, true, yes, y, on (case-insensitive; surrounding quotes stripped)
    False: 0, false, no, n, off, empty
    Unknown / unset: *default*
    """
    value = os.getenv(name)
    if value is None:
        return default
    v = str(value).strip().strip('"').strip("'").lower()
    if v in ("0", "false", "no", "n", "off", ""):
        return False
    if v in ("1", "true", "yes", "y", "on"):
        return True
    return default
