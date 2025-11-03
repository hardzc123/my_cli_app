#!/usr/bin/env python3
"""Simple demo script to show how Ink can trigger Python execution."""

from __future__ import annotations

from datetime import datetime
import platform
import sys


def main() -> None:
    print("Python demo script running inside the Ink UI.")
    print(f"Python executable: {sys.executable}")
    print(f"Version: {platform.python_version()}")
    print(f"Timestamp: {datetime.now().isoformat()}")


if __name__ == "__main__":
    main()
