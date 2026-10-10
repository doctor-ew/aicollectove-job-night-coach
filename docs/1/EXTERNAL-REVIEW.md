# Independent external implementation review

## Decision and scope

Approved with no blocking implementation or assertion findings by independent reviewer `/root/delivery_design_review`. This review covers the local coaching-session starter for ticket 1, its seven acceptance requirements, generated instruction consistency, documentation, automated assertions and direct browser evidence. It is a direct external implementation review, not a Nightshift Product receipt, controller adoption, live provider certification, or authorization to publish or deploy.

The application and unit tests were implemented by a separate agent. This reviewer authored the browser fixture and, following the parent reviewer’s design, changed generated JavaScript formatting to one canonical source line per array item joined with an empty string. The parent reviewer independently checks that formatting change; canonical instruction bytes are unchanged.

## Findings

- Required-field checks reject blank and whitespace-only inputs without changing successful values. Exact assembly includes the canonical instructions once and preserves input text.
- Clipboard success is announced only after resolution. Rejection and absence expose identical selectable, read-only text. Edits during an asynchronous write do not claim the changed inputs were copied.
- Source uses text-only DOM assignments and has no network, persistence or logging integration. Reload clears inputs and prepared text. Visible privacy wording accurately distinguishes page memory from clipboard, browser history and later AI conversations.
- Visible labels, keyboard focus, validation and a 390-pixel layout passed rendered-browser assertions. Desktop and mobile screenshots were visually inspected.
- README explains direct local opening, regeneration and reproducible checks. `evals/unit/test-starter.sh` changes to the repository root, fails on errors, checks embed freshness, and runs all unit tests. It does not claim browser coverage.
- `docs/1/SPEC.md` defines AC-1 through AC-7 and preserves the separate recovery boundary. `docs/1/behavior-scenarios.json` maps all seven requirements, including explicit manual independent review for AC-7. The actual behavior validator returned `status: valid`, `outcome: pass`, task `1`; this is schema validation, not behavioral execution.

## Verification

- `bash evals/unit/test-starter.sh`: build freshness and 7 of 7 unit tests passed; final unit duration 243.1245 ms. Tests cover missing fields, exact text, HTML-like content, large input, strict types, canonical equality, stale/missing embeds and deterministic regeneration.
- `node starter/test-browser.mjs`, with `PLAYWRIGHT_MODULE` set to an existing Playwright installation: passed in Chromium 153.0.8010.12 over `file://`; final journey 1,352 ms. Clipboard success, rejection, absence and pending-write outcomes were simulated. No physical operating-system clipboard certification is claimed.
- Browser evidence: `docs/1/direct-verification/browser-acceptance/report.json`. Screenshots in that directory are `starter-empty.png`, `starter-desktop.png`, `starter-mobile.png`, and `starter-manual-copy.png`.
- Browser observations recorded zero provider calls, network requests, storage calls and logged input messages. All entered content was fictional. No consumer ledger, exhausted allowance or retained failed-run evidence was reset.

## Bounded evidence representation

The generated source now exposes individual canonical lines as JSON string array entries and joins them without a separator. VM equality and browser exact-prompt tests confirm the canonical UTF-8 text remains unchanged, including line endings. This permits small exact line references for recovery evidence; it does not prove an entire future recovery request fits its configured limit. The recovery controller must continue measuring each complete request and rejecting oversize evidence. No provider request was made for this review.

## Reviewed SHA-256 bindings

These hashes bind the reviewed workspace content before commit; this document does not hash itself. Browser report bindings match the final generated files.

| File | SHA-256 |
| --- | --- |
| `README.md` | `cd1f0726c57854bd82bc11fbc481f54c28b4428919fabd1f8c75eb587d153a5d` |
| `coach/START-HERE.md` | `8c0e422f985796a7b5b6656b9c4cfbd6e233212c0e6692624bb1e99ed9bc2341` |
| `starter/index.html` | `df7763a7f577674a5cc3a7987cc444160e909894160d9e3415057a4e40239b52` |
| `starter/styles.css` | `509621d07cf1c54cad3d4a3d8f64601401b4e676cd187ba2719e9d654b03e0c7` |
| `starter/app.js` | `b624463281eebd6de926b57018ce21b8fd38dace32331b110bd74ab9cc631bb7` |
| `starter/build.py` | `1864d7077cdcf65a21ac6d4d563b975344f74b63f6bb8359e227847dea075ad4` |
| `starter/instructions.js` | `7afe4d264aa5f749e50c54bfc90aba773092632b5d99dc6025beb209b47cfec8` |
| `starter/test-unit.cjs` | `2d974613c3481fd6d609b9d3ce846f62c61fee9555b7d481a9fb0af1078360eb` |
| `starter/test-browser.mjs` | `4bfec5c046581de7de5a8e1f5af66dde758526cc39caeb8a99c22c818a6d1171` |
| `evals/unit/test-starter.sh` | `69191ae53eed0c404a9a5354fd3f3280f84ebaac6dfe6cf5878ac20e43fedd70` |
| `docs/1/SPEC.md` | `bb4480e9d68860901895cdfa42c951ab09347631c9b046b60f10a48bb6c5a60d` |
| `docs/1/behavior-scenarios.json` | `3782ca84997515211dc287bb08d6259fe7c471630505dc356507018b26232dd8` |
| `docs/1/direct-verification/browser-acceptance/report.json` | `c4fe93e6c6d95c9bf6373f8547ff2c8502b4944ce99c4f7bd87f80dfe95e9664` |

## Recovery proposal supplement

The local browser wrapper `evals/unit/test-starter-browser.sh` was independently reviewed and executed successfully with fictional data and an externally supplied Playwright installation. Its result is retained separately under `/private/tmp/nightshift-consumer-recovery-browser-wrapper/report.json`; the committed acceptance report above remains unchanged.

`docs/1/recovery-plan.json` is an unapproved proposal for explicit independent semantic review. It maps 31 unique decisions across 41 gate evaluations, with a proposed limit of 31 provider calls and 10 expected cache reuses, including browser observations for clipboard, privacy and accessibility behavior. An independent line-union audit confirms complete changed source, specification, scenario and check-wrapper coverage in each gate. The proposal preserves the retained failed receipt as a finding to assess; it does not turn it into a valid receipt. A tested candidate runtime admitted the earlier independent draft and reran both unit and browser checks successfully in copied source. Its measured 45 input envelopes contained 34 unique packets and 11 potential cache reuses; the largest was 18,462 bytes and unique envelope total was 484,644 bytes. These sizes exclude CLI framing. Actual provider calls and cache reuses were zero; provider usage is unknown because none was invoked. The final tightened proposal requires fresh binding and sizing after commit; candidate runtime publication and separate operator authorization remain pending. No provider call or recovery authorization was made.

Additional SHA-256 bindings:

| File | SHA-256 |
| --- | --- |
| `evals/unit/test-starter-browser.sh` | `9f2c22c11a58c1a123c325a7cedb0c40034dc268c064408ac8cbab14099543e8` |
| `docs/1/recovery-plan.json` | `0e9ba922dd66e1fbf237ff48d992f563d00979363e812805d237520640e69f42` |

The recovery proposal explicitly sets `PLAYWRIGHT_BROWSERS_PATH` to the verified existing local Playwright cache. This lets copied-workspace verification locate its installed Chromium while retaining isolated `HOME`; it does not download a browser or modify the installed runtime. The earlier copied-workspace failure remains retained separately.

AC-7 remains a manual acceptance requirement. The draft no longer asks automated semantic decisions to establish that manual approval from test exits. Its scenario and surrounding documentation remain bound and included as context; deterministic requirement coverage covers AC-1 through AC-6. Final controller manual acceptance remains separate.

## Independent recovery packet context review

Reviewer `/root/certification_review` reviewed the proposal against source revision `93629616e94e34beb60c255935a8b41a6290d1f5` and the retained read-only verification at `/private/tmp/nightshift-job-coach-31call-verified-draft.json`. Both deterministic checks passed in that assessment. This supplemental review evaluates evidence selection, not controller acceptance or a live semantic verdict.

The amended proposal includes the prompt-builder and unit setup definitions for exact assembly, browser setup and helper definitions for clipboard and accessibility assertions, complete generator and VM setup for canonical chunk checks, and all 16 lines of successful unit observations. Clipboard and layout packets omit unrelated privacy instrumentation already included in the privacy packets. AC-7 remains manual; no automatic decision claims it passed. The source code, tests, canonical instructions and retained failed receipts are unchanged.

A sizing-only calculation using the amended proposal and previously retained verification output produced 31 unique packets over 41 gate evaluations, with 10 potential within-run reuses. The largest input envelope was 22,757 bytes; the largest placeholder preflight envelope was 20,400 bytes, within the respective 24,576 and 20,480 byte limits. These measurements exclude CLI framing and do not substitute for a fresh committed-source assessment. Actual provider calls and cache uses remain zero; provider token and billing usage is unknown. The amended plan file SHA-256 is `9175c341ffed3f0101ea10162888e0fabaffabbd8166f7f0c85023f0b076a0f9`.

One semantic boundary remains under review: a controller-bound schema or transport failure can motivate external adoption without changing the original failed receipt into a pass. Generic or substantive findings cannot receive that treatment without evidence. Final provenance classification, runtime revision, committed-source assessment, request sizing and separate operator authorization remain required. No authority was granted by this supplement.

## Full reviewer framing proposal supplement

Reviewer `/root/certification_review` evaluated the complete system-prompt, user-prompt and packet-specific schema argument sizes with the proposed shared renderer. Envelope-only sizing was insufficient: the previous mapping had nine unique packets exceeding the 24,576-byte combined argument-content bound. No live retry was used to test a new mapping.

The revised mapping removes unrelated unit-check observations and their wrapper reference from clipboard and accessibility packets, which retain their complete relevant browser assertions and observations. It moves the full README context from test-coverage packets to the canonical-generation chunk packets, where the local generation instructions directly apply. Every non-observation source line remains covered in every gate, every packet retains requirement/source/assertion/observation roles, and relevant implementation and helper definitions remain present. AC-7 stays manual. No application source, tests, canonical content, retained failure, allowance or runtime was changed.

Preliminary measurements using retained verified observations and the not-yet-published renderer show 41 gate evaluations, 31 unique packets and 10 potential reuses. The maximum complete argument content is 24,381 bytes, leaving 195 bytes under the 24,576-byte bound. These are three CLI argument payload lengths, not token usage or complete network transport. The final frozen runtime and fresh observations must be remeasured before any authorization; no authority or live certification is granted by this supplement. The 31-call and 600-second proposal limits are unchanged.

The revised recovery-plan file SHA-256 is `ab189c8000cf13c9f4e0e709ce59b685288e048c23b4b4448fc5bfef1fa24231`.

## Assertion mapping correction

The recovery plan now labels the test modules as assertion evidence and their shell launchers as source context. The retained-finding packet includes the canonical-assembly assertions and their setup. Application source, tests, existing failed receipts and budgets are unchanged. This plan correction is not a new semantic verdict or live authorization. Controller support is reviewed separately; fresh bound verification is required.
