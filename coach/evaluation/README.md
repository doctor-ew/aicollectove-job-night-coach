# Evaluation

The frozen synthetic inputs and criteria are in [cases.json](cases.json); [cases.sha256](cases.sha256) records the pre-execution digest. No real resumes are in this evaluation. Original Nightshift private/held-out material was not reused or inspected.

## Execution

[run.py](run.py) takes `--command-json` (an argv array for a provider command reading stdin and returning text or a Claude JSON result), `--label`, and `--out` (a new directory). Optional repeated `--case` selects a case; `--timeout` bounds each turn. `--max-turns` selects a per-case prefix and is recorded in the receipt as limited coverage. No shell interpretation, automatic retries or API fallback is added. Each turn replays actual prior responses from that case. A zero process exit means a response was collected, not that behavior passed.

A custom adapter may connect another provider, including a local model. The caller must configure authentication, context capacity and no-tool behavior appropriately. The portable coach itself has no provider-specific API requirements. The supplied automated run used synthetic inputs only and a tool-free CLI.

## Review

Read every response against the frozen criteria, checking full JD coverage, source entailment and edit/version state. Count unsupported claims and grounding errors explicitly; do not mistake a substring match or a plausible citation for correctness. Report failed and unobserved behavior. A synthetic worked session is a demonstration, not a claim about hiring outcomes.

[RESULTS.md](RESULTS.md) records actual observations and provider scope. [check_kit.py](check_kit.py) verifies packaging and starter consistency, not model quality.

## Acceptance coverage map

| PRD cases | Exercise |
|---|---|
| 1, 5, 6, 7, 10, 12, 13, 14, 15, 16, 17 | session: full map, fragments, ownership, correction, acceptance, complete resume and handoff |
| 2, 3 | unreadable: inaccessible file/URL and incomplete scan |
| 4, 8, 9, 11 | truthfulness: different stack, explicit fabrication, embedded instructions, confirmed qualification gaps |

These are public release smoke cases, not held-out proof. Read the per-case observations before claiming a requirement passed. Unobserved host behavior (PDF extraction, browsing, Word generation) is not validated by text replay.
