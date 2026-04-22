"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BlogCard } from "@/app/components/blog-card";
import { BlogCover } from "@/app/components/blog-cover";
import type { BlogCategory, BlogEntryMeta, BlogPlatform } from "@/lib/blog";
import { formatBlogCategoryLabel, formatBlogPlatformLabel } from "@/lib/blog-ui";

type BlogIndexClientProps = {
  entries: BlogEntryMeta[];
  featuredEntry?: BlogEntryMeta;
};

const CATEGORY_OPTIONS: Array<{ value: BlogCategory; label: string }> = [
  { value: "fee-updates", label: formatBlogCategoryLabel("fee-updates") },
  { value: "pricing-margin", label: formatBlogCategoryLabel("pricing-margin") },
  { value: "marketplace-strategy", label: formatBlogCategoryLabel("marketplace-strategy") },
  { value: "tool-guides", label: formatBlogCategoryLabel("tool-guides") },
];

const PLATFORM_OPTIONS: Array<{ value: BlogPlatform; label: string }> = [
  { value: "amazon", label: formatBlogPlatformLabel("amazon") },
  { value: "ebay", label: formatBlogPlatformLabel("ebay") },
  { value: "tiktok-shop", label: formatBlogPlatformLabel("tiktok-shop") },
  { value: "shopify", label: formatBlogPlatformLabel("shopify") },
  { value: "walmart", label: formatBlogPlatformLabel("walmart") },
  { value: "general", label: formatBlogPlatformLabel("general") },
];

export default function BlogIndexClient({
  entries,
  featuredEntry,
}: BlogIndexClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<BlogCategory | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<BlogPlatform | "all">("all");
  const heroEntry = featuredEntry ?? entries[0];
  const articleCount = entries.length;
  const platformCount = new Set(entries.map((entry) => entry.platform)).size;
  const latestReviewedAt = entries.reduce(
    (latest, entry) => (entry.updatedAt > latest ? entry.updatedAt : latest),
    entries[0]?.updatedAt ?? "",
  );

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const categoryMatch = categoryFilter === "all" || entry.category === categoryFilter;
        const platformMatch = platformFilter === "all" || entry.platform === platformFilter;
        return categoryMatch && platformMatch;
      }),
    [categoryFilter, entries, platformFilter],
  );

  const latestEntries = filteredEntries.filter((entry) => entry.slug !== featuredEntry?.slug);
  const evergreenEntries = filteredEntries.filter((entry) => entry.evergreen).slice(0, 4);

  return (
    <div className="container">
      <section className="blog-hero">
        <div className="blog-hero-layout">
          <div className="blog-hero-copy">
            <span className="hero-badge">SellerLab Blog</span>
            <h1>Actionable ecommerce insights for sellers who care about margin.</h1>
            <p>
              Track fee changes, pricing playbooks, and marketplace strategy notes,
              then move from context to calculator-ready decisions without losing the
              business signal in the noise.
            </p>
            <div className="blog-stat-strip">
              <div className="blog-stat-item">
                <span className="blog-stat-label">Articles</span>
                <strong>{articleCount}</strong>
              </div>
              <div className="blog-stat-item">
                <span className="blog-stat-label">Platforms covered</span>
                <strong>{platformCount}</strong>
              </div>
              <div className="blog-stat-item">
                <span className="blog-stat-label">Latest review</span>
                <strong>{latestReviewedAt}</strong>
              </div>
            </div>
            <div className="blog-hero-actions">
              <Link className="btn btn-primary" href={heroEntry ? `/updates/${heroEntry.slug}` : "#browse-blog"}>
                Read featured insight
              </Link>
              <Link className="btn btn-secondary" href="/compare">
                Explore comparison guides
              </Link>
            </div>
          </div>

          {heroEntry ? (
            <div className="blog-hero-visual">
              <div className="blog-hero-visual-frame">
                <div className="blog-hero-visual-note">
                  Editorial signal
                  <strong>Margin-first briefings</strong>
                </div>
                <div className="blog-hero-visual-card">
                  <Link
                    href={`/updates/${heroEntry.slug}`}
                    className="blog-hero-preview-link"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <BlogCover
                      slug={heroEntry.slug}
                      category={heroEntry.category}
                      platform={heroEntry.platform}
                      featured
                      evergreen={heroEntry.evergreen}
                      title={heroEntry.title}
                    />
                    <div className="blog-hero-preview-copy">
                      <div className="blog-card-kickers">
                        <span className="blog-chip blog-chip-primary">
                          {formatBlogCategoryLabel(heroEntry.category)}
                        </span>
                        <span className="blog-chip">{formatBlogPlatformLabel(heroEntry.platform)}</span>
                      </div>
                      <h2>{heroEntry.title}</h2>
                      <p>{heroEntry.excerpt}</p>
                      <div className="blog-card-meta">
                        <span>Last reviewed: {heroEntry.updatedAt}</span>
                        <span>{heroEntry.readingTimeMinutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {featuredEntry ? (
        <section className="section blog-featured-section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured article</h2>
              <p className="section-subtitle">
                A decision-grade read linked directly to the matching tool.
              </p>
            </div>
          </div>
          <BlogCard entry={featuredEntry} featured />
        </section>
      ) : null}

      <section className="section" id="browse-blog" style={{ paddingTop: 8 }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse the blog</h2>
            <p className="section-subtitle">
              {filteredEntries.length} article{filteredEntries.length === 1 ? "" : "s"} matching
              your current filters.
            </p>
          </div>
        </div>

        <div className="blog-filter-panel">
          <div className="blog-filter-group">
            <span className="blog-filter-label">Topic lens</span>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              <button
                className="filter-tab"
                data-active={categoryFilter === "all" && platformFilter === "all" ? "true" : undefined}
                onClick={() => {
                  setCategoryFilter("all");
                  setPlatformFilter("all");
                }}
              >
                All
              </button>
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className="filter-tab"
                  data-active={categoryFilter === option.value ? "true" : undefined}
                  onClick={() =>
                    setCategoryFilter((current) => (current === option.value ? "all" : option.value))
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="blog-filter-group">
            <span className="blog-filter-label">Marketplace</span>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {PLATFORM_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className="filter-tab"
                  data-active={platformFilter === option.value ? "true" : undefined}
                  onClick={() =>
                    setPlatformFilter((current) => (current === option.value ? "all" : option.value))
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {latestEntries.length > 0 ? (
          <div className="blog-grid">
            {latestEntries.map((entry) => (
              <BlogCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ marginTop: 16 }}>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              No articles match the current filters. Clear the filters to see the
              full blog library.
            </p>
          </div>
        )}
      </section>

      {evergreenEntries.length > 0 ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="blog-secondary-band">
            <div className="section-header" style={{ marginBottom: 18 }}>
              <div>
                <h2 className="section-title">Evergreen guides</h2>
                <p className="section-subtitle">
                  Core pricing and margin playbooks you can revisit across review cycles.
                </p>
              </div>
            </div>
            <div className="blog-grid blog-grid-compact">
              {evergreenEntries.map((entry) => (
                <BlogCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="blog-cta-banner">
          <h2>Turn blog insights into calculator-ready decisions</h2>
          <p>
            Read the context here, then validate your own fee stack, price floor,
            and margin assumptions with SellerLab Suite tools and comparison guides.
          </p>
          <div className="blog-cta-actions">
            <Link className="btn" href="/amazon-fee-calculator">
              Open Amazon Calculator
            </Link>
            <Link className="btn" href="/compare">
              Explore Comparison Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
