# Local coaching-session starter

## Sources

- https://github.com/doctor-ew/aicollectove-job-night-coach/issues/1
- README.md
- coach/START-HERE.md (canonical instructions, unchanged)

## Scope

A plain HTML/CSS/JavaScript local page prepares the first message for an AI conversation. It does not analyze resumes or call an AI. It opens directly from disk and uses a reproducibly generated copy of the canonical instructions, checked for staleness. No backend, external assets, analytics, uploads or persistence.

## Acceptance requirements

- **AC-1:** Require Resume and Job posting; reject empty or whitespace-only values and identify the missing field. Preserve every character of successful input.
- **AC-2:** Copy the complete canonical coach instructions exactly once, followed by clearly labeled Resume and Job posting sections. Treat all content as text.
- **AC-3:** Announce successful clipboard writes accessibly. On unavailable or rejected clipboard, expose the same complete prompt in a selectable read-only field and explain manual copying without claiming success.
- **AC-4:** Keep inputs in page memory only. No content persistence, cookies, logging, network, backend or AI integration. A fresh load begins empty. Do not claim to erase clipboard or host history.
- **AC-5:** Provide visible labels, keyboard operation, readable validation and a narrow mobile layout without horizontal overflow.
- **AC-6:** Retain automated tests for missing fields, exact assembly, canonical consistency and HTML-like text, plus actual browser checks for copy success/failure, validation, refresh and mobile layout.
- **AC-7:** Obtain independent implementation and assertion review before acceptance. Link local opening and reproducible generation/check instructions from README.

## Delivery boundary

Local owned ticket branch only. No branch push, PR, merge, deployment or website publication. Fictional test inputs only. Preserve runtime configuration and all failed-run evidence. This specification records external implementation after the retained Product run stopped; it is not a retroactive stage receipt. Controller recovery and manual acceptance remain separate.
