#!/usr/bin/env sh
# Start the Bina OCR server. Extra args pass through, e.g. ./run.sh --port 9000
cd "$(dirname "$0")" && exec .venv/bin/python server/app.py "$@"
