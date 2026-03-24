import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, withSuiteBrand } from "@/lib/brand";
import { getUpdateEntry, UPDATE_ENTRIES, type UpdateSource } from "../data";

export const dynamicParams = false;

export function generateStaticParams() {
  return UPDATE_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getUpdateEntry(slug);
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
  const entry = getUpdateEntry(slug);
  if (!entry) return null;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    author: { "@type": "Organization", name: BRAND.masterName },
    publisher: { "@type": "Organization", name: BRAND.masterName },
    mainEntityOfPage: absoluteUrl(`/updates/${entry.slug}`),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Updates", item: absoluteUrl("/updates") },
      { "@type": "ListItem", position: 3, name: entry.title, item: absoluteUrl(`/updates/${entry.slug}`) },
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

function sourceLabelMap(sources: UpdateSource[]) {
  return new Map(sources.map((source) => [source.id, source]));
}

function SourceLinks({
  ids,
  sourceMap,
}: {
  ids: string[];
  sourceMap: Map<string, UpdateSource>;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {ids.map((id) => {
        const source = sourceMap.get(id);
        if (!source) return null;
        return (
          <a
            key={id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "var(--color-primary)",
              textDecoration: "none",
              border: "1px solid var(--color-border)",
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {source.label}
          </a>
        );
      })}
    </div>
  );
}

function ConfidenceBadge({ level }: { level: "High" | "Medium" }) {
  const color = level === "High" ? "#16a34a" : "#ca8a04";
  const bg = level === "High" ? "#dcfce7" : "#fef9c3";
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        background: bg,
        borderRadius: 999,
        padding: "2px 10px",
      }}
    >
      {level}
    </span>
  );
}

function priorityColor(priority: "P0" | "P1" | "P2") {
  if (priority === "P0") return { bg: "#fee2e2", text: "#b91c1c" };
  if (priority === "P1") return { bg: "#fef3c7", text: "#92400e" };
  return { bg: "#dbeafe", text: "#1d4ed8" };
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getUpdateEntry(slug);
  if (!entry) notFound();

  const sourceMap = sourceLabelMap(entry.sources);

  return (
    <div className="container">
      <StructuredData slug={slug} />

      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", paddingTop: 8 }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/updates" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Updates
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>{entry.title}</span>
      </nav>

      <section className="card" style={{ marginTop: 12 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{entry.title}</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 14, lineHeight: 1.7 }}>
          {entry.description}
        </p>
        <p style={{ marginBottom: 0, fontSize: 12, color: "var(--color-text-tertiary)" }}>
          Published: {entry.publishedAt} · Last reviewed: {entry.updatedAt}
        </p>
      </section>

      <section
        className="card"
        style={{
          marginTop: 12,
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {entry.heroStats.map((card) => (
          <div
            key={card.label}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: 10,
              padding: "12px 14px",
              background: "#fafcff",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{card.value}</div>
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
              {card.note}
            </div>
          </div>
        ))}
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Executive Summary</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {entry.summary.map((item) => (
            <li key={item} style={{ marginBottom: 8, lineHeight: 1.7 }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginTop: 12, overflowX: "auto" }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Evidence Matrix</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Claim</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Evidence</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Sources</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {entry.evidenceMatrix.map((row) => (
              <tr key={row.claim} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, minWidth: 220 }}>{row.claim}</td>
                <td style={{ padding: "10px 12px", minWidth: 260 }}>{row.evidence}</td>
                <td style={{ padding: "10px 12px", minWidth: 260 }}>
                  <SourceLinks ids={row.sourceIds} sourceMap={sourceMap} />
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <ConfidenceBadge level={row.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginTop: 12, overflowX: "auto" }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Change Log & Business Impact</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Area</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Before</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>After</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Effective Date</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Business Impact</th>
            </tr>
          </thead>
          <tbody>
            {entry.changeLog.map((row) => (
              <tr key={`${row.area}-${row.effectiveDate}`} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, minWidth: 160 }}>{row.area}</td>
                <td style={{ padding: "10px 12px", minWidth: 220 }}>{row.before}</td>
                <td style={{ padding: "10px 12px", minWidth: 220 }}>{row.after}</td>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{row.effectiveDate}</td>
                <td style={{ padding: "10px 12px", minWidth: 220 }}>
                  <div style={{ marginBottom: 8 }}>{row.businessImpact}</div>
                  <SourceLinks ids={row.sourceIds} sourceMap={sourceMap} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Scenario Model (Illustrative)</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {entry.scenarioModel.map((scenario) => {
            const delta = Number((scenario.marginAfter - scenario.marginBefore).toFixed(2));
            const lossMagnitude = Math.min(Math.abs(delta) * 8, 100);
            const isPositive = delta >= 0;
            return (
              <div
                key={scenario.scenario}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  background: "#ffffff",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{scenario.scenario}</div>
                <div className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
                  {scenario.assumptions}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8, fontSize: 13 }}>
                  <span>Before: <strong>{scenario.marginBefore.toFixed(2)}%</strong></span>
                  <span>After: <strong>{scenario.marginAfter.toFixed(2)}%</strong></span>
                  <span style={{ color: isPositive ? "#15803d" : "#b91c1c" }}>
                    Delta: <strong>{isPositive ? "+" : ""}{delta.toFixed(2)} pts</strong>
                  </span>
                </div>
                <div style={{ height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
                  <div
                    style={{
                      width: `${lossMagnitude}%`,
                      height: "100%",
                      background: isPositive ? "#22c55e" : "#ef4444",
                    }}
                  />
                </div>
                <div style={{ fontSize: 13 }}>
                  <strong>Recommended action:</strong> {scenario.action}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Execution Playbook</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {entry.playbook.map((phase) => (
            <div
              key={phase.phase}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{phase.phase}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{phase.window} · Owner: {phase.owner}</div>
              </div>
              <ul style={{ margin: "10px 0 10px", paddingLeft: 20 }}>
                {phase.tasks.map((task) => (
                  <li key={task} style={{ marginBottom: 6, lineHeight: 1.6 }}>
                    {task}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: 13 }}>
                <strong>Output:</strong> {phase.output}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ marginTop: 12, overflowX: "auto" }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Risk Checklist</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Risk</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Trigger</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Mitigation</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {entry.riskChecklist.map((item) => {
              const color = priorityColor(item.priority);
              return (
                <tr key={item.risk} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, minWidth: 220 }}>{item.risk}</td>
                  <td style={{ padding: "10px 12px", minWidth: 220 }}>{item.trigger}</td>
                  <td style={{ padding: "10px 12px", minWidth: 260 }}>{item.mitigation}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: color.text,
                        background: color.bg,
                        borderRadius: 999,
                        padding: "2px 10px",
                      }}
                    >
                      {item.priority}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Methodology</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {entry.methodology.map((line) => (
            <li key={line} style={{ marginBottom: 8, lineHeight: 1.7 }}>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>FAQ</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {entry.faq.map((item) => (
            <details key={item.q} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 10 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{item.q}</summary>
              <p className="muted" style={{ marginBottom: 0, lineHeight: 1.7 }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 20 }}>References</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {entry.sources.map((source) => (
            <div key={source.id} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 10 }}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                {source.label}
              </a>
              <p className="muted" style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.6 }}>
                {source.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ marginTop: 12, marginBottom: 8, textAlign: "center" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>Next Step</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
          Apply this analysis to your own SKU data in the calculator.
        </p>
        <Link className="btn btn-primary" href={entry.cta.href}>
          {entry.cta.label}
        </Link>
      </section>
    </div>
  );
}


