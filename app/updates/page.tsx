import type { Metadata } from "next";
import Link from "next/link";
import { UPDATE_ENTRIES } from "./data";
import { withSuiteBrand } from "@/lib/brand";

export const metadata: Metadata = {
  title: withSuiteBrand("Fee Policy Updates"),
  description:
    "Seller-focused fee change updates with practical margin actions and direct links to calculators.",
  alternates: {
    canonical: "/updates",
  },
};

export default function UpdatesIndexPage() {
  return (
    <div className="container">
      <section className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Fee Policy Updates</h1>
        <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
          Track platform fee changes and see exactly what actions to take in your
          pricing and profit model.
        </p>
      </section>

      <section className="grid" style={{ gap: 12 }}>
        {UPDATE_ENTRIES.map((entry) => (
          <Link
            key={entry.slug}
            href={`/updates/${entry.slug}`}
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "#eff6ff",
                  color: "#1d4ed8",
                }}
              >
                Deep Dive
              </span>
            </div>
            <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>{entry.title}</h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
              {entry.description}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
              <span>{entry.evidenceMatrix.length} evidence points</span>
              <span>{entry.changeLog.length} change items</span>
              <span>{entry.playbook.length} execution phases</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              Published: {entry.publishedAt} · Updated: {entry.updatedAt}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

