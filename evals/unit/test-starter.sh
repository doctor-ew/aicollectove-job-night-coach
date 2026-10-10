#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
python3 starter/build.py --check
node --test starter/test-unit.cjs
