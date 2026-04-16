import React from "react";

// ─── Types ───────────────────────────────────────────────────

export type FAQAnswer =
  | string
  | { intro?: string; points?: string[]; conclusion?: string };

export type FAQItem = {
  q: string;
  a: FAQAnswer;
};

// ─── Schema helper ───────────────────────────────────────────

/** Flatten a structured answer back to plain text for JSON-LD FAQPage schema. */
export function faqAnswerToText(a: FAQAnswer): string {
  if (typeof a === "string") return a;
  const parts: string[] = [];
  if (a.intro) parts.push(a.intro);
  if (a.points?.length) parts.push(a.points.join(" "));
  if (a.conclusion) parts.push(a.conclusion);
  return parts.join(" ");
}

// ─── Render helpers ──────────────────────────────────────────

const BOLD_PATTERN =
  /(\d+(?:\.\d+)?%|\$[\d,.]+|€[\d,.]+|£[\d,.]+|¥[\d,.]+|C\$[\d,.]+|A\$[\d,.]+|[\d,.]+%)/g;

function highlightNumbers(text: string): React.ReactNode[] {
  const parts = text.split(BOLD_PATTERN);
  return parts.map((part, i) =>
    BOLD_PATTERN.test(part) ? (
      <strong key={i}>{part}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

function renderAnswer(a: FAQAnswer) {
  if (typeof a === "string") {
    return (
      <p className="faq-answer-text">{highlightNumbers(a)}</p>
    );
  }

  return (
    <div className="faq-answer-structured">
      {a.intro && <p>{highlightNumbers(a.intro)}</p>}
      {a.points && a.points.length > 0 && (
        <ul>
          {a.points.map((pt, i) => (
            <li key={i}>{highlightNumbers(pt)}</li>
          ))}
        </ul>
      )}
      {a.conclusion && <p>{highlightNumbers(a.conclusion)}</p>}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────

export function FAQSection({
  items,
  title = "Frequently Asked Questions",
}: {
  items: FAQItem[];
  title?: string;
}) {
  return (
    <section className="card faq-section" style={{ padding: 24 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginTop: 0,
          marginBottom: 20,
        }}
      >
        {title}
      </h2>
      <div style={{ display: "grid", gap: 0 }}>
        {items.map((item, i) => (
          <details
            key={item.q}
            style={{
              borderBottom:
                i < items.length - 1
                  ? "1px solid var(--color-border)"
                  : "none",
              padding: "14px 0",
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                padding: "2px 0",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              {item.q}
              <span
                className="faq-chevron"
                style={{
                  fontSize: 18,
                  color: "var(--color-text-tertiary)",
                  flexShrink: 0,
                  transition: "transform 0.2s ease",
                }}
              >
                +
              </span>
            </summary>
            <div className="faq-answer">{renderAnswer(item.a)}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
