"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type AmazonCalcResult,
  type AmazonFormState,
  type AmazonMarketConfig,
  type AmazonMarketId,
  MONTHS,
  calculate,
  formatCurrency,
} from "./amazon-config";
import { AMAZON_MARKET_LIST, AMAZON_MARKETS } from "./markets";

export default function AmazonFeeCalculator({ marketId }: { marketId: AmazonMarketId }) {
  const config = AMAZON_MARKETS[marketId];

  const [form, setForm] = useState<AmazonFormState>(() => ({
    sellerType: config.sellerTypes[0].value,
    category: config.categories[0].value,
    fulfillmentMethod: config.fulfillmentMethods[0].value,
    soldPrice: config.defaults.soldPrice,
    shippingCharged: config.defaults.shippingCharged,
    giftWrapCharge: 0,
    itemCost: config.defaults.itemCost,
    actualShippingCost: config.defaults.shippingCost,
    otherCosts: 0,
    weightMajor: config.defaults.weightMajor,
    weightMinor: config.defaults.weightMinor,
    dimensionLength: config.defaults.dimensionLength,
    dimensionWidth: config.defaults.dimensionWidth,
    dimensionHeight: config.defaults.dimensionHeight,
    isApparel: false,
    isDangerousGoods: false,
    storageMonths: 1,
    storageMonth: 1,
  }));

  const res = useMemo(() => calculate(form, config), [form, config]);
  const fmt = useCallback((v: number) => formatCurrency(v, config), [config]);

  function patch(partial: Partial<AmazonFormState>) {
    setForm(p => ({ ...p, ...partial }));
  }

  function setNum(key: keyof AmazonFormState, raw: string) {
    const n = Number(raw);
    patch({ [key]: Number.isFinite(n) ? n : 0 });
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{config.seo.h1}</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          {config.seo.subtitle}
        </p>
        <MarketSwitcher current={marketId} />
      </section>

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
          onPatch={patch}
          onSetNum={setNum}
        />
        <ResultsPanel form={form} config={config} res={res} fmt={fmt} />
      </section>

      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ShareButtons config={config} />
        <FeedbackSection config={config} form={form} res={res} fmt={fmt} />
      </section>

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

function MarketSwitcher({ current }: { current: AmazonMarketId }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {AMAZON_MARKET_LIST.map(m => (
        <Link
          key={m.id}
          href={`/amazon-fee-calculator/${m.id}`}
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
          {m.flag} {m.name}
        </Link>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Calculator Form
// ═══════════════════════════════════════════════════════════════

function CalculatorForm({
  form, config,
  onPatch, onSetNum,
}: {
  form: AmazonFormState;
  config: AmazonMarketConfig;
  onPatch: (p: Partial<AmazonFormState>) => void;
  onSetNum: (key: keyof AmazonFormState, raw: string) => void;
}) {
  const isFba = form.fulfillmentMethod === "fba";
  const sym = config.currency.symbol;
  const u = config.units;

  return (
    <form className="card grid" style={{ gap: 14 }} onSubmit={e => e.preventDefault()}>
      <SectionLabel>Sale Configuration</SectionLabel>

      <Field label="Seller Type">
        <select
          className="input"
          value={form.sellerType}
          onChange={e => onPatch({ sellerType: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.sellerTypes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Category">
        <select
          className="input"
          value={form.category}
          onChange={e => onPatch({ category: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Fulfillment Method">
        <select
          className="input"
          value={form.fulfillmentMethod}
          onChange={e => onPatch({ fulfillmentMethod: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.fulfillmentMethods.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </Field>

      <SectionLabel>Pricing</SectionLabel>

      <Field label={`Sold Price (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.soldPrice}
          onChange={e => onSetNum("soldPrice", e.target.value)} />
      </Field>

      <Field label={`Shipping Charged to Buyer (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.shippingCharged}
          onChange={e => onSetNum("shippingCharged", e.target.value)} />
      </Field>

      <Field label={`Gift Wrap Charge (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.giftWrapCharge}
          onChange={e => onSetNum("giftWrapCharge", e.target.value)} />
      </Field>

      <SectionLabel>Your Costs</SectionLabel>

      <Field label={`Item Cost (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.itemCost}
          onChange={e => onSetNum("itemCost", e.target.value)} />
      </Field>

      {!isFba && (
        <Field label={`Actual Shipping Cost (${sym})`}>
          <input className="input" type="number" min="0" step="0.01" value={form.actualShippingCost}
            onChange={e => onSetNum("actualShippingCost", e.target.value)} />
        </Field>
      )}

      <Field label={`Other Costs (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.otherCosts}
          onChange={e => onSetNum("otherCosts", e.target.value)} />
      </Field>

      {isFba && (
        <>
          <SectionLabel>FBA Product Info</SectionLabel>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label={`Weight (${u.major})`}>
              <input className="input" type="number" min="0" step="1" value={form.weightMajor}
                onChange={e => onSetNum("weightMajor", e.target.value)} />
            </Field>
            <Field label={`Weight (${u.minor})`}>
              <input className="input" type="number" min="0" max={u.minorPerMajor - 1} step="1" value={form.weightMinor}
                onChange={e => onSetNum("weightMinor", e.target.value)} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label={`Length (${u.dimLabel})`}>
              <input className="input" type="number" min="0" step="0.1" value={form.dimensionLength}
                onChange={e => onSetNum("dimensionLength", e.target.value)} />
            </Field>
            <Field label={`Width (${u.dimLabel})`}>
              <input className="input" type="number" min="0" step="0.1" value={form.dimensionWidth}
                onChange={e => onSetNum("dimensionWidth", e.target.value)} />
            </Field>
            <Field label={`Height (${u.dimLabel})`}>
              <input className="input" type="number" min="0" step="0.1" value={form.dimensionHeight}
                onChange={e => onSetNum("dimensionHeight", e.target.value)} />
            </Field>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.isApparel}
              onChange={e => onPatch({ isApparel: e.target.checked })}
              style={{ width: 16, height: 16, cursor: "pointer" }} />
            <span style={{ fontSize: 14 }}>Apparel item (higher FBA fee)</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.isDangerousGoods}
              onChange={e => onPatch({ isDangerousGoods: e.target.checked })}
              style={{ width: 16, height: 16, cursor: "pointer" }} />
            <span style={{ fontSize: 14 }}>Dangerous goods (higher FBA fee)</span>
          </label>

          <SectionLabel>FBA Storage</SectionLabel>

          <Field label="Storage Duration (months)">
            <input className="input" type="number" min="0" max="24" step="1" value={form.storageMonths}
              onChange={e => onSetNum("storageMonths", e.target.value)} />
          </Field>

          <Field label="Storage Month (for seasonal rate)">
            <select
              className="input"
              value={form.storageMonth}
              onChange={e => onPatch({ storageMonth: Number(e.target.value) })}
              style={{ cursor: "pointer" }}
            >
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </Field>
        </>
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
  form: AmazonFormState;
  config: AmazonMarketConfig;
  res: AmazonCalcResult;
  fmt: (v: number) => string;
}) {
  const isFba = form.fulfillmentMethod === "fba";
  const wu = config.units.major;

  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Calculation Results</h2>

      <GroupLabel>Sale Summary</GroupLabel>
      <Row label="Sold Price" value={fmt(form.soldPrice)} />
      {form.shippingCharged > 0 && <Row label="+ Shipping" value={fmt(form.shippingCharged)} />}
      {form.giftWrapCharge > 0 && <Row label="+ Gift Wrap" value={fmt(form.giftWrapCharge)} />}
      <Row label="Total Sales Price" value={fmt(res.totalSalesPrice)} bold />

      <Divider />

      <GroupLabel>Amazon Fees</GroupLabel>
      <Row label="Referral Fee" value={fmt(res.referralFee)} />
      <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
        {res.referralFeeDesc}
        {res.appliedMinReferralFee && " (min fee applied)"}
      </div>
      {res.closingFee > 0 && (
        <Row label="Variable Closing Fee" value={fmt(res.closingFee)} />
      )}
      {res.perItemFee > 0 && (
        <Row label="Per-Item Fee (Individual)" value={fmt(res.perItemFee)} />
      )}
      {isFba && res.fbaFulfillmentFee > 0 && (
        <>
          <Row label="FBA Fulfillment Fee" value={fmt(res.fbaFulfillmentFee)} />
          <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            Size tier: {res.sizeTierLabel} &middot; Shipping weight: {res.shippingWeight.toFixed(2)} {wu}
          </div>
        </>
      )}
      {isFba && res.fbaStorageFee > 0 && (
        <>
          <Row label="FBA Storage Fee" value={fmt(res.fbaStorageFee)} />
          <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            {res.cubicVolume.toFixed(3)} {config.units.dimLabel === "in" ? "cu ft" : "m\u00B3"} &times; {form.storageMonths} month{form.storageMonths !== 1 ? "s" : ""}
          </div>
        </>
      )}
      <Row label="Total Amazon Fees" value={fmt(res.totalFees)} bold color="#dc2626" />

      <Divider />

      <GroupLabel>Profit</GroupLabel>
      <Row label="Revenue" value={fmt(res.revenue)} />
      <Row label={"\u2212 Item Cost"} value={fmt(form.itemCost)} />
      {!isFba && <Row label={"\u2212 Shipping Cost"} value={fmt(form.actualShippingCost)} />}
      {form.otherCosts > 0 && <Row label={"\u2212 Other Costs"} value={fmt(form.otherCosts)} />}
      <Row label={"\u2212 Amazon Fees"} value={fmt(res.totalFees)} />

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

function ShareButtons({ config }: { config: AmazonMarketConfig }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const text = encodeURIComponent(`${config.seo.h1} - Calculate Amazon fees & profit | SellerLab`);
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
  config: AmazonMarketConfig;
  form: AmazonFormState;
  res: AmazonCalcResult;
  fmt: (v: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  function buildReport() {
    return [
      `Market: ${config.name} (${config.domain})`,
      `Seller Type: ${form.sellerType}`,
      `Category: ${form.category}`,
      `Fulfillment: ${form.fulfillmentMethod.toUpperCase()}`,
      `Sold Price: ${fmt(form.soldPrice)}`,
      `Total Fees: ${fmt(res.totalFees)}`,
      `Net Profit: ${fmt(res.netProfit)}`,
      "",
      `Issue: ${message}`,
      "",
      `URL: ${typeof window !== "undefined" ? window.location.href : ""}`,
    ].join("\n");
  }

  async function handleSubmit() {
    const report = buildReport();
    await navigator.clipboard.writeText(report);
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setMessage("");
    }, 2500);
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

        {submitted ? (
          <div style={{
            textAlign: "center", padding: "24px 0",
            color: "#16a34a", fontWeight: 600, fontSize: 15,
          }}>
            Report copied to clipboard. Thank you for your feedback!
          </div>
        ) : (
          <>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. The referral fee for Jewelry seems incorrect for items above $250..."
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
              <button onClick={handleSubmit} className="btn btn-primary" disabled={!message.trim()}>
                Copy Report & Close
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
