"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type CalcResult,
  type Cat,
  type FormState,
  type MarketConfig,
  type MarketId,
  MARKETS,
  MARKET_LIST,
  calculate,
  describeRule,
  formatCurrency,
} from "./market-config";
import { FlagIcon } from "../components/country-flags";

export default function EbayFeeCalculator({ marketId }: { marketId: MarketId }) {
  const config = MARKETS[marketId];

  const [form, setForm] = useState<FormState>(() => ({
    storeType: config.storeTypes[0].value,
    category: config.categories[0].value,
    subCategory: "",
    soldPrice: config.defaults.soldPrice,
    shippingCharged: config.defaults.shippingCharged,
    actualShippingCost: config.defaults.shippingCost,
    itemCost: config.defaults.itemCost,
    otherCosts: 0,
    taxRate: 0,
    isTopRated: false,
    isInternational: false,
    internationalDestination: config.internationalDestinations?.[0]?.value ?? "",
    adRate: 0,
  }));

  const selectedCat = config.categories.find((c: Cat) => c.value === form.category);
  const subs = selectedCat?.subs;
  const res = useMemo(() => calculate(form, config), [form, config]);
  const fmt = useCallback((v: number) => formatCurrency(v, config), [config]);

  function patch(partial: Partial<FormState>) {
    setForm(p => ({ ...p, ...partial }));
  }

  function setNum(key: keyof FormState, raw: string) {
    const n = Number(raw);
    patch({ [key]: Number.isFinite(n) ? n : 0 });
  }

  function handleCategoryChange(value: string) {
    const cat = config.categories.find((c: Cat) => c.value === value);
    patch({ category: value, subCategory: cat?.subs?.[0]?.value ?? "" });
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      {/* Header */}
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{config.seo.h1}</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          {config.seo.subtitle}
        </p>
        <MarketSwitcher current={marketId} />
      </section>

      {/* Calculator */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
          gap: 20,
        }}
      >
        <CalculatorForm
          form={form}
          config={config}
          subs={subs}
          onPatch={patch}
          onSetNum={setNum}
          onCategoryChange={handleCategoryChange}
        />
        <ResultsPanel form={form} config={config} res={res} fmt={fmt} />
      </section>

      {/* Share & Feedback */}
      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ShareButtons config={config} />
        <FeedbackSection config={config} form={form} res={res} fmt={fmt} />
      </section>

      {/* Notes */}
      {config.notes.length > 0 && (
        <section className="card">
          <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>Notes</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {config.notes.map((note, i) => (
              <li key={i} className="muted" style={{ fontSize: 13, lineHeight: 1.65, marginBottom: 4 }}>
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Market Switcher
// ═══════════════════════════════════════════════════════════════

function MarketSwitcher({ current }: { current: MarketId }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {MARKET_LIST.map(m => (
        <Link
          key={m.id}
          href={`/ebay-fee-calculator/${m.id}`}
          style={{
            padding: "5px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: 13,
            fontWeight: 600,
            background: m.id === current ? "var(--color-primary)" : "transparent",
            color: m.id === current ? "#fff" : "var(--color-text-secondary)",
            border: `1px solid ${m.id === current ? "var(--color-primary)" : "var(--color-border)"}`,
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          <FlagIcon code={m.id} />
          {m.name}
        </Link>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Calculator Form
// ═══════════════════════════════════════════════════════════════

function CalculatorForm({
  form, config, subs,
  onPatch, onSetNum, onCategoryChange,
}: {
  form: FormState;
  config: MarketConfig;
  subs: Cat["subs"];
  onPatch: (p: Partial<FormState>) => void;
  onSetNum: (key: keyof FormState, raw: string) => void;
  onCategoryChange: (v: string) => void;
}) {
  const sym = config.currency.symbol;

  return (
    <form className="card grid" style={{ gap: 14 }} onSubmit={e => e.preventDefault()}>
      <SectionLabel>Sale Configuration</SectionLabel>

      <Field label={config.storeLabel}>
        <select
          className="input"
          value={form.storeType}
          onChange={e => onPatch({ storeType: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.storeTypes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Category">
        <select
          className="input"
          value={form.category}
          onChange={e => onCategoryChange(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          {config.categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      {subs && (
        <Field label="Sub Category">
          <select
            className="input"
            value={form.subCategory}
            onChange={e => onPatch({ subCategory: e.target.value })}
            style={{ cursor: "pointer" }}
          >
            {subs.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
      )}

      <SectionLabel>Pricing</SectionLabel>

      <Field label={`Sold Price (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.soldPrice}
          onChange={e => onSetNum("soldPrice", e.target.value)} />
      </Field>

      <Field label={`Shipping Charged to Buyer (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.shippingCharged}
          onChange={e => onSetNum("shippingCharged", e.target.value)} />
      </Field>

      <SectionLabel>Your Costs</SectionLabel>

      <Field label={`Item Cost (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.itemCost}
          onChange={e => onSetNum("itemCost", e.target.value)} />
      </Field>

      <Field label={`Actual Shipping Cost (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.actualShippingCost}
          onChange={e => onSetNum("actualShippingCost", e.target.value)} />
      </Field>

      <Field label={`Other Costs (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.otherCosts}
          onChange={e => onSetNum("otherCosts", e.target.value)} />
      </Field>

      <SectionLabel>Options</SectionLabel>

      <Field label={config.taxLabel}>
        <input className="input" type="number" min="0" step="0.01" value={form.taxRate}
          onChange={e => onSetNum("taxRate", e.target.value)} />
      </Field>

      <Field label="Promoted Listing Ad Rate (%)">
        <input className="input" type="number" min="0" max="20" step="0.1" value={form.adRate}
          onChange={e => onSetNum("adRate", e.target.value)} />
      </Field>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={form.isTopRated}
          onChange={e => onPatch({ isTopRated: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }} />
        <span style={{ fontSize: 14 }}>{config.topRatedLabel}</span>
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={form.isInternational}
          onChange={e => onPatch({ isInternational: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }} />
        <span style={{ fontSize: 14 }}>{config.internationalLabel}</span>
      </label>

      {form.isInternational && config.internationalDestinations && config.internationalFeeOverride?.(form.storeType) == null && (
        <Field label="Destination">
          <select
            className="input"
            value={form.internationalDestination}
            onChange={e => onPatch({ internationalDestination: e.target.value })}
            style={{ cursor: "pointer" }}
          >
            {config.internationalDestinations.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </Field>
      )}
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════
// Results Panel
// ═══════════════════════════════════════════════════════════════

function ResultsPanel({
  form, config, res, fmt,
}: {
  form: FormState;
  config: MarketConfig;
  res: CalcResult;
  fmt: (v: number) => string;
}) {
  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Calculation Results</h2>

      <GroupLabel>Sale Summary</GroupLabel>
      <Row label="Sold Price" value={fmt(form.soldPrice)} />
      <Row label="+ Shipping" value={fmt(form.shippingCharged)} />
      {form.taxRate > 0 && <Row label={`+ ${config.taxLabel.replace(" (%)", "")}`} value={fmt(res.tax)} />}
      <Row label="Total Received" value={fmt(res.totalWithTax)} bold />

      <Divider />

      <GroupLabel>eBay Fees</GroupLabel>
      <Row label="Final Value Fee" value={fmt(res.fvfBase)} />
      <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
        {describeRule(res.rule, config.currency.symbol)}
        {res.fvfCapped && " (capped)"}
      </div>
      <Row label="Per Order Fee" value={fmt(res.perOrder)} />
      {form.isTopRated && (
        <Row label="Top Rated Discount" value={`\u2212${fmt(res.trsDiscount)}`} color="#16a34a" />
      )}
      {config.paymentProcessing && (
        <Row label={config.paymentProcessing.label} value={fmt(res.mpFee)} />
      )}
      {config.regulatoryFee && res.regFee > 0 && (
        <Row label={config.regulatoryFee.label} value={fmt(res.regFee)} />
      )}
      {form.isInternational && (
        <Row
          label={config.internationalDestinations
            ? `International Fee (${(res.intlRate * 100).toFixed(2)}%)`
            : config.internationalLabel}
          value={fmt(res.intlFee)}
        />
      )}
      {form.adRate > 0 && (
        <Row label={`Promoted Listing (${form.adRate}%)`} value={fmt(res.adFee)} />
      )}
      <Row label="Total eBay Fees" value={fmt(res.totalFees)} bold color="#dc2626" />

      <Divider />

      <GroupLabel>Profit</GroupLabel>
      <Row label="Revenue" value={fmt(res.revenue)} />
      <Row label={`\u2212 Item Cost`} value={fmt(form.itemCost)} />
      <Row label={`\u2212 Shipping Cost`} value={fmt(form.actualShippingCost)} />
      {form.otherCosts > 0 && <Row label={`\u2212 Other Costs`} value={fmt(form.otherCosts)} />}
      <Row label={`\u2212 eBay Fees`} value={fmt(res.totalFees)} />

      <Divider />

      <Row
        label="Net Profit" value={fmt(res.netProfit)} bold large
        color={res.netProfit >= 0 ? "#16a34a" : "#dc2626"}
      />
      <Row
        label="Profit Margin" value={`${res.margin.toFixed(2)}%`} bold large
        color={res.margin >= 0 ? "#16a34a" : "#dc2626"}
      />
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════
// Share Buttons
// ═══════════════════════════════════════════════════════════════

function ShareButtons({ config }: { config: MarketConfig }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const text = encodeURIComponent(`${config.seo.h1} - Calculate eBay fees & profit | SellerLab`);
  const url = encodeURIComponent(shareUrl);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--color-text-secondary)" }}>
        Share this calculator
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}
        >
          <XIcon /> Post on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}
        >
          <FacebookIcon /> Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}
        >
          <LinkedInIcon /> Share
        </a>
        <button onClick={copyLink} className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}>
          <LinkIcon /> {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Feedback Section
// ═══════════════════════════════════════════════════════════════

function FeedbackSection({
  config, form, res, fmt,
}: {
  config: MarketConfig;
  form: FormState;
  res: CalcResult;
  fmt: (v: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  async function handleSubmit() {
    setStatus("sending");
    try {
      const resp = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "calculator_issue",
          source: "ebay-fee-calculator",
          message,
          context: {
            Market: `${config.name} (${config.siteName})`,
            "Store Type": form.storeType,
            Category: `${form.category}${form.subCategory ? ` > ${form.subCategory}` : ""}`,
            "Sold Price": fmt(form.soldPrice),
            "Shipping Charged": fmt(form.shippingCharged),
            "Total Fees": fmt(res.totalFees),
            "Net Profit": fmt(res.netProfit),
            URL: window.location.href,
          },
        }),
      });
      if (!resp.ok) throw new Error();
      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setMessage("");
      }, 2500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 12 }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: "var(--color-primary)", fontWeight: 600, padding: 0,
          }}
        >
          Calculation not correct? Report an issue
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius)",
          padding: 24, maxWidth: 480, width: "90vw",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 18 }}>Report Calculation Issue</h3>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 13 }}>
          Describe the issue you found. Your current calculation parameters will be included automatically.
        </p>

        {status === "success" ? (
          <div style={{
            textAlign: "center", padding: "24px 0",
            color: "#16a34a", fontWeight: 600, fontSize: 15,
          }}>
            Report submitted successfully. Thank you for your feedback!
          </div>
        ) : (
          <>
            {status === "error" && (
              <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>
                Failed to submit. Please try again later.
              </div>
            )}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. The final value fee for Jewelry seems incorrect for orders above $5,000..."
              style={{
                width: "100%", minHeight: 100, border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)", padding: 10, fontSize: 14,
                resize: "vertical", fontFamily: "inherit",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={!message.trim() || status === "sending"}
              >
                {status === "sending" ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <div style={{ marginBottom: 6, fontSize: 14 }}>{label}</div>
      {children}
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
      color: "var(--color-text-tertiary)", borderBottom: "1px solid var(--color-border)",
      paddingBottom: 6, marginTop: 4,
    }}>
      {children}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--color-text-secondary)" }}>
      {children}
    </div>
  );
}

function Row({ label, value, bold, color, large }: {
  label: string; value: string; bold?: boolean; color?: string; large?: boolean;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      paddingBottom: 6, marginBottom: 2, fontSize: large ? 16 : 14,
    }}>
      <span className={bold ? undefined : "muted"} style={bold ? { fontWeight: 600 } : undefined}>
        {label}
      </span>
      <span style={{ fontWeight: bold ? 700 : 500, color }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ borderBottom: "1px solid var(--color-border)", margin: "6px 0 10px" }} />;
}

// ═══════════════════════════════════════════════════════════════
// Icons (inline SVG)
// ═══════════════════════════════════════════════════════════════

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
