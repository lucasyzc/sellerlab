import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, withSuiteBrand } from "@/lib/brand";
import { COMPARE_ENTRIES, getCompareEntry } from "../data";
import { FAQSection, faqAnswerToText } from "../../components/faq-section";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARE_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCompareEntry(slug);
  if (!entry) return {};

  return {
    title: withSuiteBrand(entry.title),
    description: entry.description,
    alternates: {
      canonical: `/compare/${entry.slug}`,
    },
    openGraph: {
      title: withSuiteBrand(entry.title),
      description: entry.description,
      type: "article",
      url: `/compare/${entry.slug}`,
    },
  };
}

function StructuredData({ slug }: { slug: string }) {
  const entry = getCompareEntry(slug);
  if (!entry) return null;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    dateModified: entry.updatedAt,
    author: { "@type": "Organization", name: BRAND.masterName },
    publisher: { "@type": "Organization", name: BRAND.masterName },
    mainEntityOfPage: absoluteUrl(`/compare/${entry.slug}`),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerToText(item.a) },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Compare", item: absoluteUrl("/compare") },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.title,
        item: absoluteUrl(`/compare/${entry.slug}`),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([article, faq, breadcrumb]),
      }}
    />
  );
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCompareEntry(slug);
  if (!entry) notFound();

  return (
    <div className="container">
      <StructuredData slug={slug} />

      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", paddingTop: 8 }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/compare" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Compare
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>{entry.title}</span>
      </nav>

      <section className="card" style={{ marginTop: 12 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{entry.title}</h1>
        <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>
          {entry.description}
        </p>
        <p style={{ marginBottom: 0, fontSize: 12, color: "var(--color-text-tertiary)" }}>
          Last reviewed: {entry.updatedAt}
        </p>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Key Takeaways</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {entry.takeaway.map((point) => (
            <li key={point} style={{ marginBottom: 8, lineHeight: 1.7 }}>
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginTop: 12, overflowX: "auto" }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Structured Comparison</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Metric</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>{entry.leftLabel}</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>{entry.rightLabel}</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Profit Impact</th>
            </tr>
          </thead>
          <tbody>
            {entry.rows.map((row) => (
              <tr key={row.metric} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.metric}</td>
                <td style={{ padding: "10px 12px" }}>{row.left}</td>
                <td style={{ padding: "10px 12px" }}>{row.right}</td>
                <td style={{ padding: "10px 12px" }}>{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div style={{ marginTop: 12 }}>
        <FAQSection items={entry.faq} title="FAQ" />
      </div>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 20 }}>Sources</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {entry.sources.map((source) => (
            <li key={source.url} style={{ marginBottom: 8 }}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginTop: 12, marginBottom: 8, textAlign: "center" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>Next Step</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
          Validate this comparison with your own product price and cost data.
        </p>
        <Link className="btn btn-primary" href={entry.cta.href}>
          {entry.cta.label}
        </Link>
      </section>
    </div>
  );
}


