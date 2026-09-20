# Run Jobs Night coach

The launcher was migrated from nightshift-community-runtime to nightshift-community using the installer with --previous-source. The consumer has an initial Git baseline and a checkout-local PRD; external-project PRDs are rejected by Nightshift input identity validation.

Run from the consumer repository:

```sh
cd /Users/doctorew/shuttlebay/_ATL_/AIC/jobs-night-agent
nightshift spec:docs/PRD.md --profile standard --provider-policy standard --gear auto --auth subscription --branch auto --base HEAD
```

CLI source: /Users/doctorew/shuttlebay/nightshift-community/scripts/nightshift-factory.sh:108. Input ownership: /Users/doctorew/shuttlebay/nightshift-community/scripts/nightshift-spec-source.py:28.

Configured routing: local qwen3-coder:30b for initial fact extraction; Codex gpt-5.4 for initial engineer/architect roles; Claude for specification and higher gears; cross-provider adversarial review enabled. See ../routing.json and ../.nightshift.toml. This is configuration verification, not a successful live model evaluation.

Admission checked with explicit --base HEAD: baseline, input, manifest, collision all passed. Task identity: spec-487b79d1751c30f1. No build model was launched during setup repair. Analytics will be generated when the actual factory runs. Local inference, model authentication, and final behavior gates remain subject to live verification.
