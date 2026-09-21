# Fresh frontier build

Run `./run-nightshift.sh` from the repository root. The launcher can also be invoked by absolute path.

Active input: `docs/PRD-frontier-20260921.md`. Starts with requirements only on an isolated ticket branch based on the committed setup HEAD. Controller: Codex. Specialist routing: Claude and Codex only, with standard cross-provider review and subscription authentication. No local route or paid API fallback is authorized.

Do not launch an old PRD or resume an old batch. Old runs remain in their original worktrees. This setup does not launch the build, push, merge, or deploy.

The setup branch is `jobs-night/frontier-20260921`, based on requirements-only commit `be246e9`. The installed Nightshift launcher uses the canonical Nightshift source checkout; harness fixes are on its local `nightshift/source-bound-evaluation` branch.
