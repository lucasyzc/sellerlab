import type { Metadata } from "next";

export const FEE_SEO_YEAR = 2026;
export const FEE_SEO_LAST_REVIEWED = "2026-03-26";
export const FEE_SEO_LAST_REVIEWED_MONTH = "2026-03";

type FeeMetadataInput = {
  title: string;
  description: string;
  canonicalPath: string;
  keywords: string[];
  year?: number;
  yearKeywordPhrases?: string[];
  lastReviewed?: string;
  freshnessNote?: string;
  openGraphDescription?: string;
  twitterDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
  includeYearInTitle?: boolean;
};

type FreshnessInput = {
  lastReviewed?: string;
  docs?: Array<{ asOf?: string; effectiveDate?: string }>;
  fallback?: string;
};

function normalizeDate(value: string): string | undefined {
  if (!value) return undefined;

  const iso = /\b(20\d{2})-(\d{2})-(\d{2})\b/g;
  const dot = /\b(20\d{2})\.(\d{1,2})\.(\d{1,2})\b/g;
  const extracted: string[] = [];

  for (const match of value.matchAll(iso)) {
    extracted.push(`${match[1]}-${match[2]}-${match[3]}`);
  }
  for (const match of value.matchAll(dot)) {
    const mm = String(Number(match[2])).padStart(2, "0");
    const dd = String(Number(match[3])).padStart(2, "0");
    extracted.push(`${match[1]}-${mm}-${dd}`);
  }

  if (!extracted.length) return undefined;
  return extracted.sort().at(-1);
}

export function resolveSeoYear(effectiveYear?: number): number {
  if (effectiveYear && Number.isFinite(effectiveYear)) return effectiveYear;
  return FEE_SEO_YEAR;
}

export function withSeoYear(text: string, year = FEE_SEO_YEAR): string {
  if (!text) return text;
  if (text.includes(String(year))) return text;
  return `${text} (${year})`;
}

export function yearAwareKeywords(
  keywords: string[],
  year = FEE_SEO_YEAR,
  yearKeywordPhrases: string[] = [],
): string[] {
  const auto = keywords.slice(0, 3).map((term) => `${term} ${year}`);
  return Array.from(new Set([...keywords, ...auto, ...yearKeywordPhrases]));
}

export function latestReviewDateFromDocs(
  docs: Array<{ asOf?: string; effectiveDate?: string }> = [],
): string | undefined {
  const all = docs
    .flatMap((doc) => [doc.asOf, doc.effectiveDate])
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizeDate(value))
    .filter((value): value is string => Boolean(value));

  if (!all.length) return undefined;
  return all.sort().at(-1);
}

export function resolveLastReviewed(input: FreshnessInput): string {
  const fallback = input.fallback ?? FEE_SEO_LAST_REVIEWED;
  if (input.lastReviewed) return input.lastReviewed;

  const fromDocs = latestReviewDateFromDocs(input.docs);
  return fromDocs ?? fallback;
}

export function toReviewMonth(lastReviewed: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(lastReviewed)) {
    return lastReviewed.slice(0, 7);
  }
  return FEE_SEO_LAST_REVIEWED_MONTH;
}

export function lastReviewedLabel(lastReviewed: string): string {
  return `Last reviewed: ${lastReviewed} (as of ${toReviewMonth(lastReviewed)})`;
}

export function buildFeeMetadata(input: FeeMetadataInput): Metadata {
  const year = resolveSeoYear(input.year);
  const lastReviewed = resolveLastReviewed({ lastReviewed: input.lastReviewed });
  const freshnessNote = input.freshnessNote ?? `Last reviewed: ${lastReviewed}.`;
  const title =
    input.includeYearInTitle === false ? input.title : withSeoYear(input.title, year);

  const description = `${input.description} Updated for ${year}. ${freshnessNote}`;
  const openGraphDescription = input.openGraphDescription ?? description;
  const twitterDescription = input.twitterDescription ?? description;
  const keywords = yearAwareKeywords(
    input.keywords,
    year,
    input.yearKeywordPhrases,
  );

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: input.canonicalPath,
    },
    openGraph: {
      title,
      description: openGraphDescription,
      type: "website",
      siteName: "Data EDE",
      url: input.canonicalPath,
      locale: "en_US",
    },
    twitter: {
      card: input.twitterCard ?? "summary",
      title,
      description: twitterDescription,
    },
  };
}
