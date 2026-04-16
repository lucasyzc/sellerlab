import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, withSuiteBrand } from "@/lib/brand";
import { formatBlogCategoryLabel, formatBlogPlatformLabel } from "@/lib/blog-ui";
import {
  getAllBlogEntries,
  getBlogEntry,
} from "@/lib/blog";
import { FAQSection, faqAnswerToText } from "@/app/components/faq-section";
import { BlogCard } from "@/app/components/blog-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getBlogEntry(slug);
  if (!entry) return {};

  return {
    title: withSuiteBrand(entry.title),
    description: entry.description,
    alternates: {
      canonical: `/updates/${entry.slug}`,
    },
    openGraph: {
      title: withSuiteBrand(entry.title),
      description: entry.description,
      type: "article",
      url: `/updates/${entry.slug}`,
    },
  };
}

function StructuredData({ slug }: { slug: string }) {
  const entry = getBlogEntry(slug);
  if (!entry) return null;

  const payload: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: entry.title,
      description: entry.description,
      datePublished: entry.publishedAt,
      dateModified: entry.updatedAt,
      author: { "@type": "Organization", name: BRAND.masterName },
      publisher: { "@type": "Organization", name: BRAND.masterName },
      mainEntityOfPage: absoluteUrl(`/updates/${entry.slug}`),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/updates") },
        {
          "@type": "ListItem",
          position: 3,
          name: entry.title,
          item: absoluteUrl(`/updates/${entry.slug}`),
        },
      ],
    },
  ];

  if (entry.faq.length > 0) {
    payload.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entry.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: faqAnswerToText(item.a) },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getBlogEntry(slug);
  if (!entry) notFound();

  return (
    <div className="container">
      <StructuredData slug={slug} />

      <nav className="blog-breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/updates">Blog</Link>
        <span>/</span>
        <span>{entry.title}</span>
      </nav>

      <section className="card blog-detail-hero">
        <div className="blog-card-kickers">
          <span className="blog-chip blog-chip-primary">
            {formatBlogCategoryLabel(entry.category)}
          </span>
          <span className="blog-chip">{formatBlogPlatformLabel(entry.platform)}</span>
          {entry.evergreen ? <span className="blog-chip blog-chip-success">Evergreen</span> : null}
        </div>
        <h1>{entry.title}</h1>
        <p className="muted blog-detail-description">{entry.description}</p>
        <div className="blog-detail-meta">
          <span>Published: {entry.publishedAt}</span>
          <span>Last reviewed: {entry.updatedAt}</span>
          <span>{entry.readingTimeMinutes} min read</span>
        </div>
        <div className="blog-detail-actions">
          <Link className="btn btn-primary" href={entry.cta.href}>
            {entry.cta.label}
          </Link>
          <p className="blog-detail-cta-note">
            Have a try with your own numbers while you read. One SKU is enough to see where
            margin changes by market.
          </p>
        </div>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Key takeaways</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {entry.keyTakeaways.map((item) => (
            <li key={item} style={{ marginBottom: 8, lineHeight: 1.7 }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <article className="card blog-prose" style={{ marginTop: 12 }}>
        <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
      </article>

      {entry.faq.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          <FAQSection items={entry.faq} title="Frequently Asked Questions" />
        </div>
      ) : null}

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>References</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {entry.sources.map((source) => (
            <div
              key={source.url}
              style={{
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: 10,
              }}
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-primary)", fontWeight: 600 }}
              >
                {source.label}
              </a>
              <p className="muted" style={{ margin: "6px 0 0", fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
                {source.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {entry.relatedPosts.length > 0 ? (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Related reads</h2>
              <p className="section-subtitle">
                Continue with adjacent fee, pricing, and marketplace strategy topics.
              </p>
            </div>
          </div>
          <div className="blog-grid blog-grid-compact">
            {entry.relatedPosts.map((related) => (
              <BlogCard key={related.slug} entry={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
