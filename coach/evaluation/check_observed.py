#!/usr/bin/env python3
"""Check narrow observable invariants; semantic review is recorded separately."""
import json
from pathlib import Path

root=Path(__file__).resolve().parent/'results'
text=(root/'opus-session/session-4.md').read_text()
draft=text.split('## Application-ready resume draft',1)[1].split('## Evidence map',1)[0]
handoff=text.split('## Portable handoff',1)[1].split('## Works cited',1)[0]
checks={}
for line in ['Alex Example | alex@example.invalid','Operations Assistant, Fictional Freight Co, 2022–2025.',
             'Volunteer, Fictional Pantry, 2021. Tracked deliveries in Google Sheets.',
             'Education: High school diploma, Fictional School, 2020.']:
    checks['preserved: '+line]=line in draft
checks['accepted daily correction present']='daily' in draft.lower() and 'weekly' not in draft.lower()
checks['rejected wording absent']=all(word not in draft.lower() for word in ['managed','coordinated'])
checks['contact omitted from handoff']='alex@example.invalid' not in handoff
checks['clean draft has no source annotations']=all('['+prefix not in draft for prefix in ['R','J','A','W'])
checks['five JD IDs retained']=all('JD-0'+str(i) in handoff for i in range(1,6))
for case,turns in [('session',4),('unreadable',1),('truthfulness',1)]:
    for turn in range(1,turns+1):
        checks[f'{case}/{turn} has Works cited']='## Works cited' in (root/f'opus-{case}/{case}-{turn}.md').read_text()
receipt={'scope':'observable output invariants only; not citation entailment or complete behavioral proof',
         'checks':checks,'passed':sum(checks.values()),'total':len(checks)}
(root/'observed-checks.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt))
raise SystemExit(0 if all(checks.values()) else 1)
