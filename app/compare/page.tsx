import type { Metadata } from "next";
import Link from "next/link";
import { COMPARE_ENTRIES } from "./data";

export const metadata: Metadata = {
  title: "Marketplace Fee Comparisons | SellerLab",
  description:
    "Compare marketplace selling fees and profit impact across countries and platforms with structured, calculator-linked guides.",
  alternates: {
    canonical: "/compare",
  },
};

export default function CompareIndexPage() {
  return (
    <div className="container">
      <section className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Marketplace Fee Comparisons</h1>
        <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
          Side-by-side fee comparisons to help you choose the right market before
          listing products.
        </p>
      </section>

      <section className="grid" style={{ gap: 12 }}>
        {COMPARE_ENTRIES.map((entry) => (
          <Link
            key={entry.slug}
            href={`/compare/${entry.slug}`}
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>{entry.title}</h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
              {entry.description}
            </p>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              Updated: {entry.updatedAt}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

