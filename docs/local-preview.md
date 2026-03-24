# Local Preview Modes

This project has two different local preview modes:

## 1) Static preview (UI-only)

Use this when you only want to check static pages:

```bash
npm run build
npm run preview:static
```

This mode does **not** run Cloudflare Pages Functions, so `/api/title-optimizer` will be unavailable.

## 2) Pages preview (UI + Functions API)

Use this when you need `functions/api/title-optimizer.ts`:

```bash
npm run build
copy .dev.vars.example .dev.vars
npm run preview:pages
```

Then open:

```text
http://127.0.0.1:8788/ebay-title-optimizer
```

If you only run `serve -s out`, seeing local fallback titles in the optimizer is expected behavior.

## Optional: static frontend + deployed API

If you intentionally stay in static mode but want real API results, set this before `npm run build`:

```text
NEXT_PUBLIC_TITLE_OPTIMIZER_ENDPOINT=https://<your-pages-domain>/api/title-optimizer
```

Tip: if `NEXT_PUBLIC_TITLE_OPTIMIZER_ENDPOINT` is not set, the optimizer will try to reuse
the same host from `NEXT_PUBLIC_FEEDBACK_ENDPOINT` and call `/api/title-optimizer`.
