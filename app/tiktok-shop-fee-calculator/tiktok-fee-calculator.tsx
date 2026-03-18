"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type TikTokCalcResult,
  type TikTokFormState,
  type TikTokMarketConfig,
  type TikTokMarketId,
  calculate,
  formatCurrency,
  TIKTOK_MARKET_LIST,
} from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";

export default function TikTokFeeCalculator({ marketId }: { marketId: TikTokMarketId }) {
  const config = TIKTOK_MARKET_LIST.find(m => m.id === marketId)!;

  const [form, setForm] = useState<TikTokFormState>(() => ({
    category: config.categories[0].value,
    fulfillmentMethod: "fbt",
    isNewSeller: false,
    soldPrice: config.defaults.soldPrice,
    itemCost: config.defaults.itemCost,
    shippingCost: config.defaults.shippingCost,
    affiliateRate: config.defaults.affiliateRate,
    adSpendPerUnit: config.defaults.adSpendPerUnit,
    otherCosts: 0,
    weightLb: config.defaults.weightLb,
    weightOz: config.defaults.weightOz,
    dimensionLength: config.defaults.dimensionLength,
    dimensionWidth: config.defaults.dimensionWidth,
    dimensionHeight: config.defaults.dimensionHeight,
    unitsPerOrder: config.defaults.unitsPerOrder,
    storageDays: config.defaults.storageDays,
  }));

  const res = useMemo(() => calculate(form, config), [form, config]);
  const fmt = useCallback((v: number) => formatCurrency(v, config), [config]);

  function patch(partial: Partial<TikTokFormState>) {
    setForm(p => ({ ...p, ...partial }));
  }

  function setNum(key: keyof TikTokFormState, raw: string) {
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

function MarketSwitcher({ current }: { current: TikTokMarketId }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {TIKTOK_MARKET_LIST.map(m => (
        <Link
          key={m.id}
          href={`/tiktok-shop-fee-calculator/${m.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
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
  form, config,
  onPatch, onSetNum,
}: {
  form: TikTokFormState;
  config: TikTokMarketConfig;
  onPatch: (p: Partial<TikTokFormState>) => void;
  onSetNum: (key: keyof TikTokFormState, raw: string) => void;
}) {
  const isFbt = form.fulfillmentMethod === "fbt";
  const sym = config.currency.symbol;

  return (
    <form className="card grid" style={{ gap: 14 }} onSubmit={e => e.preventDefault()}>
      <SectionLabel>Sale Configuration</SectionLabel>

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
          <option value="fbt">FBT (Fulfilled by TikTok)</option>
          <option value="self">Self-Fulfilled</option>
        </select>
      </Field>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={form.isNewSeller}
          onChange={e => onPatch({ isNewSeller: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }} />
        <span style={{ fontSize: 14 }}>New seller promotion (3% for first 30 days)</span>
      </label>

      <SectionLabel>Pricing</SectionLabel>

      <Field label={`Sold Price (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.soldPrice}
          onChange={e => onSetNum("soldPrice", e.target.value)} />
      </Field>

      <SectionLabel>Your Costs</SectionLabel>

      <Field label={`Item Cost / COGS (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.itemCost}
          onChange={e => onSetNum("itemCost", e.target.value)} />
      </Field>

      {!isFbt && (
        <Field label={`Shipping Cost (${sym})`}>
          <input className="input" type="number" min="0" step="0.01" value={form.shippingCost}
            onChange={e => onSetNum("shippingCost", e.target.value)} />
        </Field>
      )}

      <Field label={`Other Costs (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.otherCosts}
          onChange={e => onSetNum("otherCosts", e.target.value)} />
      </Field>

      <SectionLabel>Marketing</SectionLabel>

      <Field label="Affiliate Commission Rate (%)">
        <input className="input" type="number" min="0" max="100" step="1" value={form.affiliateRate}
          onChange={e => onSetNum("affiliateRate", e.target.value)} />
      </Field>

      <Field label={`Ad Spend per Unit (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.adSpendPerUnit}
          onChange={e => onSetNum("adSpendPerUnit", e.target.value)} />
      </Field>

      {isFbt && (
        <>
          <SectionLabel>FBT Product Info</SectionLabel>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Weight (lb)">
              <input className="input" type="number" min="0" max="50" step="1" value={form.weightLb}
                onChange={e => onSetNum("weightLb", e.target.value)} />
            </Field>
            <Field label="Weight (oz)">
              <input className="input" type="number" min="0" max="15" step="1" value={form.weightOz}
                onChange={e => onSetNum("weightOz", e.target.value)} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Length (in)">
              <input className="input" type="number" min="0" max="26" step="0.1" value={form.dimensionLength}
                onChange={e => onSetNum("dimensionLength", e.target.value)} />
            </Field>
            <Field label="Width (in)">
              <input className="input" type="number" min="0" max="26" step="0.1" value={form.dimensionWidth}
                onChange={e => onSetNum("dimensionWidth", e.target.value)} />
            </Field>
            <Field label="Height (in)">
              <input className="input" type="number" min="0" max="26" step="0.1" value={form.dimensionHeight}
                onChange={e => onSetNum("dimensionHeight", e.target.value)} />
            </Field>
          </div>

          <Field label="Units per Order">
            <select
              className="input"
              value={form.unitsPerOrder}
              onChange={e => onPatch({ unitsPerOrder: Number(e.target.value) })}
              style={{ cursor: "pointer" }}
            >
              <option value={1}>1 unit (single)</option>
              <option value={2}>2 units</option>
              <option value={3}>3 units</option>
              <option value={4}>4+ units</option>
            </select>
          </Field>

          <SectionLabel>FBT Storage</SectionLabel>

          <Field label="Storage Duration (days)">
            <input className="input" type="number" min="0" max="365" step="1" value={form.storageDays}
              onChange={e => onSetNum("storageDays", e.target.value)} />
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
  form: TikTokFormState;
  config: TikTokMarketConfig;
  res: TikTokCalcResult;
  fmt: (v: number) => string;
}) {
  const isFbt = form.fulfillmentMethod === "fbt";

  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Calculation Results</h2>

      <GroupLabel>Sale Summary</GroupLabel>
      <Row label="Sold Price" value={fmt(form.soldPrice)} />
      <Row label="Total Revenue" value={fmt(res.totalRevenue)} bold />

      <Divider />

      <GroupLabel>TikTok Shop Fees</GroupLabel>
      <Row label="Referral Fee" value={fmt(res.referralFee)} />
      <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
        {res.referralFeeDesc} (incl. payment processing)
      </div>
      {isFbt && res.fbtFulfillmentFee > 0 && (
        <>
          <Row label="FBT Fulfillment Fee" value={fmt(res.fbtFulfillmentFee)} />
          <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            Weight tier: {res.weightTierLabel} &middot; Chargeable: {res.chargeableWeight.toFixed(2)} lb
            {form.unitsPerOrder > 1 && ` \u00b7 ${form.unitsPerOrder} units/order pricing`}
          </div>
        </>
      )}
      {isFbt && res.fbtStorageFee > 0 && (
        <>
          <Row label="FBT Storage Fee" value={fmt(res.fbtStorageFee)} />
          <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            {form.storageDays} day{form.storageDays !== 1 ? "s" : ""}
            {form.storageDays <= 60 && " (free period)"}
          </div>
        </>
      )}
      <Row label="Total TikTok Fees" value={fmt(res.totalPlatformFees)} bold color="#dc2626" />

      <Divider />

      <GroupLabel>Seller Costs</GroupLabel>
      <Row label="Item Cost / COGS" value={fmt(form.itemCost)} />
      {!isFbt && <Row label="Shipping Cost" value={fmt(form.shippingCost)} />}
      {res.affiliateCommission > 0 && (
        <>
          <Row label="Affiliate Commission" value={fmt(res.affiliateCommission)} />
          <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            {form.affiliateRate}% of sold price
          </div>
        </>
      )}
      {res.adSpend > 0 && <Row label="Ad Spend" value={fmt(res.adSpend)} />}
      {form.otherCosts > 0 && <Row label="Other Costs" value={fmt(form.otherCosts)} />}

      <Divider />

      <Row
        label="Net Profit" value={fmt(res.netProfit)} bold large
        color={res.netProfit >= 0 ? "#16a34a" : "#dc2626"}
      />
      <Row
        label="Profit Margin" value={`${res.margin.toFixed(2)}%`} bold large
        color={res.margin >= 0 ? "#16a34a" : "#dc2626"}
      />
      <Row
        label="ROI" value={`${res.roi.toFixed(1)}%`}
        color={res.roi >= 0 ? "#16a34a" : "#dc2626"}
      />
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════
// Share Buttons
// ═══════════════════════════════════════════════════════════════

function ShareButtons({ config }: { config: TikTokMarketConfig }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const text = encodeURIComponent(`${config.seo.h1} - Calculate TikTok Shop fees & profit | SellerLab`);
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
  config: TikTokMarketConfig;
  form: TikTokFormState;
  res: TikTokCalcResult;
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
          source: "tiktok-shop-fee-calculator",
          message,
          context: {
            Market: `${config.name} (${config.domain})`,
            Category: form.category,
            Fulfillment: form.fulfillmentMethod.toUpperCase(),
            "Sold Price": fmt(form.soldPrice),
            "Total Fees": fmt(res.totalPlatformFees),
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
              placeholder="e.g. The referral fee for Pre-Owned items seems incorrect for items above $10,000..."
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
