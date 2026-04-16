"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BlogCard } from "@/app/components/blog-card";
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
        <span className="hero-badge">SellerLab Blog</span>
        <h1>Actionable ecommerce insights for sellers who care about margin.</h1>
        <p>
          Use the blog to track fee changes, pricing playbooks, and marketplace
          strategy notes, then take the next step inside the right calculator.
        </p>
      </section>

      {featuredEntry ? (
        <section className="section" style={{ paddingTop: 0 }}>
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

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse the blog</h2>
            <p className="section-subtitle">
              {filteredEntries.length} article{filteredEntries.length === 1 ? "" : "s"} matching
              your current filters.
            </p>
          </div>
        </div>

        <div className="blog-filter-wrap">
          <div className="filter-bar" style={{ marginBottom: 12 }}>
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

          <div className="filter-bar">
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
          <div className="section-header">
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
        </section>
      ) : null}

      <section className="section">
        <div className="cta-banner">
          <h2>Turn blog insights into calculator-ready decisions</h2>
          <p>
            Read the context here, then validate your own fee stack, price floor,
            and margin assumptions with SellerLab Suite tools.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
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
