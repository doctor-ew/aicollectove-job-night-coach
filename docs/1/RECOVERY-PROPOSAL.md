# Ticket 1 recovery proposal

## Authorization and scope

This is a local proposal, not a recovery authorization. No provider call, new
allowance, ticket restart or controller-state reset is authorized by this file.
Retained controller attempts, findings, budgets and original evidence remain intact.
This document contains no copied credentials or provider configuration.

## Required preparation

Complete the external implementation and independent review first. Commit the
intended source, test scripts, specification and scenario artifacts on the owned
ticket branch. Recovery requires the original owned worktree, descent from its
retained base, changed implementation source and no tracked uncommitted changes.
An active or unfinished controller run, unresolved operator decision or required
specification approval blocks recovery.

The current `docs/1/SPEC.md` and `docs/1/behavior-scenarios.json` exist. The
corrected scenario document passes the canonical `nightshift-behavior-proof.py`
validator: six deterministic cases and one required manual case. Preserve this
contract when editing the source or requirements. The required manual case remains
pending operator acceptance; independent external review is retained separately
and is not a fabricated applicability approval or automated pass.

Prepare `docs/1/recovery-plan.json` with version 1, `checks`, `decisions` and
`limits`, optionally `environment`. Each check has exactly `id` and `argv`; the
supported command is a two-element array starting with `bash` or `python3` and a
safe repository-relative test-script path. Recovery executes the tests again in a
copied source snapshot; previously reported exit codes do not approve a gate.

Each mapped decision has `id`, `kind`, `case_ids`, `ac_ids`, `finding_ids`,
`references` and `high_risk`. References have `id`, `role`, `path`, `start_line`
and `end_line`; the roles are requirement, source, assertion and observation.
Every gate must cover all changed source, the specification, scenarios, test
assertions and its required cases and acceptance criteria. Adoption also resolves
all retained findings. Paths and line spans must describe the final committed
artifacts. Observations refer to executed check IDs, not invented output files.
No complete recovery plan or direct-verification result list existed when this
proposal was prepared.

## Current semantic-recovery blockers

The supported legacy recovery CLI exposes `assess`, `authorize` and `resume`.
Assessment is read-only. `authorize` is an executing action: it creates a separate
nonrenewable recovery allowance, runs verification, then evaluates adoption,
review, drift and QA. It is not a harmless approval preview.

The current implementation requires compact semantic evaluation even though Jev
is optional in the broader roadmap. Its configured model is currently an unpinned
alias, which readiness rejects. The required credential was absent from the
read-only assessment process environment; this is not a claim that an operator
has no credential elsewhere. Do not inspect private credential files, change
configuration or create a new allowance to work around this blocker.

Independent external review by itself has no supported import operation that
advances this retained controller. The injectable Python `runner` path is labeled
`legacy_fixture`; it is a testing seam, not an authorized production adoption API.
Do not use fixture injection, fabricated receipts or edited controller state.
A public implementation change making Jev optional in this recovery path may be
reviewed separately; it would still require a fresh explicit bounded allowance
before independent provider review.

## Assessment and proposed bounds

After preparation, use the reviewed runtime's `nightshift recover assess 1` with
`--project` set explicitly to the consumer repository. Retain the returned exact
assessment digest, runtime identity, source/test hashes, reviewer route and
readiness reasons. `--verify` additionally executes the declared deterministic
tests; it does not authorize a provider or adopt the work. Any changed input or
runtime requires reassessment.

No allowance is proposed as executable yet. The legacy default is 600 wall seconds,
600 active seconds and four provider calls. A valid plan may request positive
integer limits up to 600 wall seconds, 600 active seconds and 64 provider calls.
The actual minimum depends on mapped decisions, required independent reviews and
valid cache reuse; four calls must not be assumed sufficient. Each executed test
has at most 120 seconds within the aggregate limit.

Semantic requests are capped at 24,576 bytes. Readiness reserves 4,096 bytes for
observed output and transport framing, so preflight packets must fit 20,480 bytes.
Observed spans are bounded to 1,024 lines per referenced check. Oversized or
incomplete evidence blocks; it must not be silently truncated into an approval.

Only after a ready assessment and a concrete reviewed proposal may an operator
separately authorize the exact digest, identity and allowance. No `authorize` or
`resume` command is supplied for immediate execution here. Successful automated
recovery ends at pending manual acceptance; it does not imply publication, merge
or deployment.
