# SEO + GEO Extreme Spec (Single Source of Truth)

Last updated: 2026-03-27 (Asia/Shanghai)
Applies to: this repository only
Default language strategy: English-first

## Global MUST Rules

1. Every production page must be machine-readable and citation-ready.
- MUST provide consistent metadata, visible facts, and structured data.
- MUST include at least one crawlable internal link to a relevant tool/content page.

2. One canonical domain policy.
- MUST use a single primary domain from `lib/site-url.ts` for canonical/open graph/sitemap/robots/indexing flows.
- MUST NOT hardcode legacy primary domain values in site-level SEO files.

3. Date and freshness policy.
- MUST render `Last reviewed` on core tool/content pages.
- MUST use `YYYY-MM-DD` when a concrete date is shown.
- MUST tie freshness claims to data source updates or reviewed policy notes.

4. Source-backed claims policy.
- MUST attach source links for policy/fee claims.
- MUST avoid unsupported numerical statements.

5. GEO crawler assets policy.
- MUST keep `public/llms.txt` and `public/llms-full.txt` updated with primary domain URLs.
- MUST include `Last reviewed: YYYY-MM-DD` in both files.
- MUST keep `/glossary` available as a stable definition endpoint.

Failure conditions (blocking):
- Missing required schema for page type.
- Missing `Last reviewed` signal on required pages.
- Canonical/OpenGraph/Sitemap host mismatch.
- FAQ visible content and FAQ schema out of sync.

## Structured Data Contract

### Calculator pages (`/amazon-fee-calculator`, `/ebay-fee-calculator`, `/ebay-pricing-calculator`, `/tiktok-shop-fee-calculator`, `/shopify-fee-calculator`, `/walmart-fee-calculator`)
MUST include:
- `BreadcrumbList`
- `SoftwareApplication`
- `FAQPage` (if FAQ block exists in UI)

`SoftwareApplication` minimum fields:
- `@context`, `@type`, `name`, `description`, `url`, `applicationCategory`, `operatingSystem`, `offers`, `dateModified`
- `offers.price` should be `0` for free tools.

### Title optimizer page (`/ebay-title-optimizer`)
MUST include:
- `BreadcrumbList`
- `SoftwareApplication`
- `HowTo`
- `FAQPage`

`HowTo` contract:
- Steps must match visible UI workflow (1:1 intent alignment).
- At least 4 actionable steps.

### Content pages (`/compare/*`, `/updates/*`)
MUST include:
- `Article`
- `BreadcrumbList`
- `FAQPage` (if FAQ block exists)
- `datePublished` and/or `dateModified` as applicable.

## Fact Anchor Contract

1. Calculation Logic block (required on core calculator hubs)
- MUST expose formula structure in plain English.
- MUST list variable definitions and units.
- Recommended baseline:
  - `Total Fees = Platform Commission + Fulfillment Fee + Payment Fee + Other Fees`

2. Data Freshness block
- MUST show:
  - `Last reviewed: YYYY-MM-DD`
  - Effective date context (when relevant)
  - Primary source links

3. Evidence field standard (required for analytical content pages)
- Use structured fields:
  - `claim`
  - `evidence`
  - `source_url`
  - `effective_date`
  - `confidence`

## Q&A Contract

1. Core tools must contain FAQ intent coverage.
- MUST include scenario-focused questions (market, fees, usage, interpretation).
- MUST align visible FAQ and `FAQPage` schema entries.

2. Freshness statement in answers.
- SHOULD include explicit update language:
  - `Updated for 2026, last reviewed on YYYY-MM-DD`.

3. Title optimization pages.
- SHOULD include before/after examples and practical rationale.

## Metadata / Canonical Contract

MUST for indexable pages:
- `title`
- `description`
- `alternates.canonical`
- `openGraph.title`
- `openGraph.description`
- `openGraph.url`

Canonical consistency rules:
- canonical path, open graph url, sitemap url output must refer to the same route identity.
- all absolute site URLs must resolve to the primary domain from `lib/site-url.ts`.

## Publish & Acceptance Checklist

Before merge:
- [ ] `npm run guardrails:seo-geo` passes.
- [ ] Required schema by page type is present.
- [ ] `Last reviewed` signal exists on required pages.
- [ ] Host consistency checks pass for canonical/open graph/sitemap/robots/indexing configs.
- [ ] FAQ visible block and FAQ schema are aligned.
- [ ] Core calculator hubs include `Calculation Logic` and `Primary Sources` sections.
- [ ] GEO assets (`llms.txt`, `llms-full.txt`, `/glossary`) are present and updated.
- [ ] PR includes changed pages + validation notes/screenshots.

If any blocking rule fails, PR must not merge.
