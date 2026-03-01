#!/usr/bin/env python
"""
Simple launcher for the AI detection service.
Run this instead of typing the long uvicorn command.
"""
import subprocess
import sys

if __name__ == "__main__":
    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "main:app", "--reload", "--port", "8000"
    ])