#!/bin/sh
set -eu
PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
export NIGHTSHIFT_ROUTING_FILE="$PROJECT_DIR/routing.json"
exec nightshift spec:docs/PRD-frontier-20260921.md \
  --project "$PROJECT_DIR" \
  --provider codex \
  --profile standard \
  --provider-policy standard \
  --gear auto \
  --auth subscription \
  --branch auto \
  --base HEAD
