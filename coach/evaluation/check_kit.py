#!/usr/bin/env python3
"""Offline packaging checks only; does not grade model behavior."""
import hashlib
import json
from pathlib import Path
import re

root=Path(__file__).resolve().parents[1]
required=['PROMPT.md','START-HERE.md','WORDING-REFERENCE.md','QUICKSTART.md','FACILITATOR.md',
          'templates/WORKSHEET.md','examples/WORKED-SESSION.md','evaluation/README.md','DELIVERY.md']
for name in required:
    path=root/name
    assert path.is_file() and path.stat().st_size, f'missing/empty {name}'
start=(root/'START-HERE.md').read_text()
assert (root/'PROMPT.md').read_text() in start, 'starter drifted from prompt'
assert (root/'WORDING-REFERENCE.md').read_text() in start, 'starter missing wording reference'
for file in [root.parent/'README.md',*(root.rglob('*.md'))]:
    if 'results' in file.parts:continue
    for target in re.findall(r'\]\(([^)]+)\)',file.read_text()):
        if target.startswith(('http:','https:','#','mailto:')) or '<' in target:continue
        path=target.split('#')[0]
        assert (file.parent/path).exists(),f'broken local link {file}: {target}'
raw=(root/'evaluation/cases.json').read_bytes()
assert hashlib.sha256(raw).hexdigest()==(root/'evaluation/cases.sha256').read_text().strip()
cases=json.loads(raw)['cases']
assert len({c['id'] for c in cases})==len(cases)
assert all(c['synthetic'] and c['turns'] and c['criteria'] for c in cases)
print('PASS: kit files, starter parity, local links, frozen synthetic cases. Not behavioral approval.')
