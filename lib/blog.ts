import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type BlogCategory =
  | "fee-updates"
  | "pricing-margin"
  | "marketplace-strategy"
  | "tool-guides";

export type BlogPlatform =
  | "amazon"
  | "ebay"
  | "tiktok-shop"
  | "shopify"
  | "walmart"
  | "general";

export type BlogSource = {
  label: string;
  url: string;
  note: string;
};

export type BlogFaqItem = {
  q: string;
  a: string;
};

export type BlogCta = {
  label: string;
  href: string;
};

export type BlogEntryMeta = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  category: BlogCategory;
  platform: BlogPlatform;
  tags: string[];
  featured: boolean;
  evergreen: boolean;
  keyTakeaways: string[];
  faq: BlogFaqItem[];
  sources: BlogSource[];
  cta: BlogCta;
  readingTimeMinutes: number;
};

export type BlogEntry = BlogEntryMeta & {
  body: string;
  bodyHtml: string;
  relatedPosts: BlogEntryMeta[];
};

type BlogFrontmatter = Omit<BlogEntryMeta, "readingTimeMinutes">;

const CONTENT_DIR = path.join(process.cwd(), "content", "updates");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const BLOG_CATEGORIES: BlogCategory[] = [
  "fee-updates",
  "pricing-margin",
  "marketplace-strategy",
  "tool-guides",
];
const BLOG_PLATFORMS: BlogPlatform[] = [
  "amazon",
  "ebay",
  "tiktok-shop",
  "shopify",
  "walmart",
  "general",
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[blog] ${message}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isFaqArray(value: unknown): value is BlogFaqItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.q === "string" &&
        typeof item.a === "string",
    )
  );
}

function isSourceArray(value: unknown): value is BlogSource[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.label === "string" &&
        typeof item.url === "string" &&
        typeof item.note === "string",
    )
  );
}

function validateDate(value: unknown, field: string, slug: string): string {
  assert(typeof value === "string", `${slug} frontmatter "${field}" must be a string.`);
  assert(DATE_PATTERN.test(value), `${slug} frontmatter "${field}" must use YYYY-MM-DD.`);
  return value;
}

function readingTimeMinutes(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function slugFromFilename(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
}

function parseFrontmatter(fileName: string, data: unknown): BlogFrontmatter {
  const slug = slugFromFilename(fileName);
  assert(isRecord(data), `${slug} frontmatter is missing or invalid.`);

  const frontmatterSlug =
    typeof data.slug === "string" && data.slug.trim().length > 0 ? data.slug : slug;
  assert(frontmatterSlug === slug, `${slug} frontmatter slug must match the filename.`);
  assert(typeof data.title === "string", `${slug} frontmatter "title" must be a string.`);
  assert(
    typeof data.description === "string",
    `${slug} frontmatter "description" must be a string.`,
  );
  assert(typeof data.excerpt === "string", `${slug} frontmatter "excerpt" must be a string.`);
  assert(
    typeof data.category === "string" &&
      BLOG_CATEGORIES.includes(data.category as BlogCategory),
    `${slug} frontmatter "category" is invalid.`,
  );
  assert(
    typeof data.platform === "string" &&
      BLOG_PLATFORMS.includes(data.platform as BlogPlatform),
    `${slug} frontmatter "platform" is invalid.`,
  );
  assert(isStringArray(data.tags), `${slug} frontmatter "tags" must be a string array.`);
  assert(
    typeof data.featured === "boolean",
    `${slug} frontmatter "featured" must be a boolean.`,
  );
  assert(
    typeof data.evergreen === "boolean",
    `${slug} frontmatter "evergreen" must be a boolean.`,
  );
  assert(
    isStringArray(data.keyTakeaways),
    `${slug} frontmatter "keyTakeaways" must be a string array.`,
  );
  assert(isFaqArray(data.faq), `${slug} frontmatter "faq" is invalid.`);
  assert(isSourceArray(data.sources), `${slug} frontmatter "sources" is invalid.`);
  assert(isRecord(data.cta), `${slug} frontmatter "cta" is invalid.`);
  assert(
    typeof data.cta.label === "string" && typeof data.cta.href === "string",
    `${slug} frontmatter "cta" must include label and href.`,
  );
  assert(
    data.cta.href.startsWith("/"),
    `${slug} frontmatter "cta.href" must be an internal site path.`,
  );

  return {
    slug,
    title: data.title,
    description: data.description,
    excerpt: data.excerpt,
    publishedAt: validateDate(data.publishedAt, "publishedAt", slug),
    updatedAt: validateDate(data.updatedAt, "updatedAt", slug),
    category: data.category as BlogCategory,
    platform: data.platform as BlogPlatform,
    tags: data.tags,
    featured: data.featured,
    evergreen: data.evergreen,
    keyTakeaways: data.keyTakeaways,
    faq: data.faq,
    sources: data.sources,
    cta: {
      label: data.cta.label,
      href: data.cta.href,
    },
  };
}

function renderMarkdown(body: string): string {
  return marked.parse(body, {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;
}

function sortEntries<T extends BlogEntryMeta>(entries: T[]): T[] {
  return [...entries].sort((left, right) => {
    if (left.publishedAt !== right.publishedAt) {
      return right.publishedAt.localeCompare(left.publishedAt);
    }
    if (left.updatedAt !== right.updatedAt) {
      return right.updatedAt.localeCompare(left.updatedAt);
    }
    return left.title.localeCompare(right.title);
  });
}

function summarizeEntry(fileName: string): BlogEntry {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = parseFrontmatter(fileName, data);

  return {
    ...meta,
    body: content.trim(),
    bodyHtml: renderMarkdown(content),
    readingTimeMinutes: readingTimeMinutes(content),
    relatedPosts: [],
  };
}

function getRelatedPosts(entry: BlogEntryMeta, entries: BlogEntryMeta[]): BlogEntryMeta[] {
  return entries
    .filter((candidate) => candidate.slug !== entry.slug)
    .map((candidate) => {
      let score = 0;
      if (candidate.platform === entry.platform) score += 3;
      if (candidate.category === entry.category) score += 2;
      score += candidate.tags.filter((tag) => entry.tags.includes(tag)).length;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return right.candidate.updatedAt.localeCompare(left.candidate.updatedAt);
    })
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

function loadEntries(): BlogEntry[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"));

  const entries = sortEntries(files.map(summarizeEntry));

  return entries.map((entry) => ({
    ...entry,
    relatedPosts: getRelatedPosts(entry, entries),
  }));
}

let cache: BlogEntry[] | null = null;

function getCachedEntries(): BlogEntry[] {
  if (!cache) {
    cache = loadEntries();
  }
  return cache;
}

export function getAllBlogEntries(): BlogEntryMeta[] {
  return getCachedEntries().map(({ body, bodyHtml, relatedPosts, ...meta }) => meta);
}

export function getBlogEntry(slug: string): BlogEntry | undefined {
  return getCachedEntries().find((entry) => entry.slug === slug);
}

export function getFeaturedBlogEntry(): BlogEntryMeta | undefined {
  const entries = getAllBlogEntries();
  const featuredEntries = entries.filter((entry) => entry.featured);
  return sortEntries(featuredEntries)[0] ?? entries[0];
}

export function getLatestBlogEntries(limit: number): BlogEntryMeta[] {
  return getAllBlogEntries().slice(0, limit);
}
