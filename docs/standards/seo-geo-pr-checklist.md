# SEO/GEO PR Checklist

Use this checklist for every PR touching pages, metadata, schema, sitemap/robots, or indexing flow.

## Required

- [ ] Ran `npm run guardrails:seo-geo` and it passed.
- [ ] Read and followed `docs/standards/seo-geo-extreme-spec.md`.
- [ ] Added `SEO/GEO self-check` section in PR description.
- [ ] Listed all changed routes/pages.

## Structured Data

- [ ] Calculator pages include required schema (`BreadcrumbList` + `SoftwareApplication`; `FAQPage` when FAQ exists).
- [ ] `/ebay-title-optimizer` includes required schema (`HowTo` + `SoftwareApplication`).
- [ ] Content pages keep `Article` + `BreadcrumbList` (and `FAQPage` when FAQ exists).
- [ ] Visible FAQ content and `FAQPage` entries are aligned.

## Freshness & Facts

- [ ] Required pages include `Last reviewed` signal.
- [ ] Date format uses `YYYY-MM-DD` where concrete dates are shown.
- [ ] Policy/fee claims include source links.
- [ ] Core calculator hubs include `Calculation Logic` + `Primary Sources`.

## Metadata / Canonical

- [ ] `title`, `description`, `canonical`, `openGraph.url` are set for changed indexable pages.
- [ ] Domain is consistent with `lib/site-url.ts`.
- [ ] Sitemap/robots/indexing settings remain host-consistent.

## Evidence

- [ ] Attached validation notes (and screenshots where UI/schema changed).
- [ ] Documented known limitations or follow-ups.

## GEO Assets

- [ ] `public/llms.txt` exists and uses primary domain URLs.
- [ ] `public/llms-full.txt` exists and uses primary domain URLs.
- [ ] `/glossary` route exists and is listed in sitemap.
