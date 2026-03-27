# AGENTS.md

Repository-level AI development guardrails.

## Mandatory Precondition

Before starting any implementation task in this repo, agents MUST read:
- `docs/standards/seo-geo-extreme-spec.md`

This is the single source of truth for SEO/GEO behavior and acceptance requirements.

## Required Output Behavior

When proposing or implementing changes, agents MUST include a `SEO/GEO Self-Check` section that states:
- Which contract sections were affected.
- Whether schema/date/canonical requirements are satisfied.
- What was validated locally (`npm run guardrails:seo-geo`).

## Conflict Handling

If user instructions conflict with the spec:
1. Explicitly mark the conflict.
2. State the risk of violating the spec.
3. Proceed with the user request only after documenting the deviation in the output.

## Merge Safety

Any change touching pages, metadata, schema, sitemap/robots, or indexing settings should run:
- `npm run guardrails:seo-geo`

If guardrails fail, do not claim SEO/GEO compliance.
