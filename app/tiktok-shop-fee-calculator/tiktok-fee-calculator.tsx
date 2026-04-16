"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionLabel } from "../components/section-label";
import {
  type TikTokCalcResult,
  type TikTokFeeRule,
  type TikTokFormState,
  type TikTokFulfillmentConfig,
  type TikTokMarketConfig,
  type TikTokMarketId,
  calculate,
  formatCurrency,
  getDefaultSizeTier,
  makeDefaultForm,
  TIKTOK_MARKET_LIST,
} from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import {
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
  withSeoYear,
} from "@/lib/fee-seo";

const FEEDBACK_ENDPOINT =
  process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "/api/feedback";

export default function TikTokFeeCalculator({ marketId }: { marketId: TikTokMarketId }) {
  const config = TIKTOK_MARKET_LIST.find(m => m.id === marketId)!;
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  const [form, setForm] = useState<TikTokFormState>(() => {
    const initial = makeDefaultForm(config);
    if (!initial.packageSizeTier) initial.packageSizeTier = getDefaultSizeTier(config);
    return initial;
  });

  const res = useMemo(() => calculate(form, config), [form, config]);
  const fmt = useCallback((v: number) => formatCurrency(v, config), [config]);
  const hasTrackedToolUsed = useRef(false);
  const hasTrackedResultViewed = useRef(false);

  const trackCalculatorInteraction = useCallback((interactionType: string) => {
    if (!hasTrackedToolUsed.current) {
      trackEvent("ToolUsed", {
        tool_id: "tiktok",
        market: marketId,
        page_type: "calculator",
        interaction_type: interactionType,
      });
      hasTrackedToolUsed.current = true;
    }

    if (!hasTrackedResultViewed.current) {
      trackEvent("ResultViewed", {
        tool_id: "tiktok",
        market: marketId,
        page_type: "calculator",
      });
      hasTrackedResultViewed.current = true;
    }
  }, [marketId]);

  function applyPatch(partial: Partial<TikTokFormState>) {
    setForm((p) => ({ ...p, ...partial }));
  }

  function patch(partial: Partial<TikTokFormState>) {
    trackCalculatorInteraction("form_change");
    applyPatch(partial);
  }

  function setNum(key: keyof TikTokFormState, raw: string) {
    const n = Number(raw);
    trackCalculatorInteraction("numeric_input");
    applyPatch({ [key]: Number.isFinite(n) ? n : 0 } as Partial<TikTokFormState>);
  }

  function setManualInput(key: string, raw: string) {
    const n = Number(raw);
    trackCalculatorInteraction("manual_fee_input");
    setForm(p => ({
      ...p,
      manualInputs: {
        ...p.manualInputs,
        [key]: Number.isFinite(n) ? n : 0,
      },
    }));
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{withSeoYear(config.seo.h1, seoYear)}</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          {config.seo.subtitle}
        </p>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12, fontSize: "var(--fs-content-meta)" }}>
          {lastReviewedLabel(lastReviewed)}
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
          onSetManualInput={setManualInput}
        />
        <ResultsPanel form={form} config={config} res={res} fmt={fmt} />
      </section>

      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ShareButtons config={config} />
        <FeedbackSection config={config} form={form} res={res} fmt={fmt} />
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: 15 }}>Official Sources</h3>
        {config.docs.map((doc) => (
          <a
            key={doc.url}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-primary)", fontSize: "var(--fs-content-body-sm)", textDecoration: "none" }}
          >
            {doc.title}
            {doc.effectiveDate ? ` · ${doc.effectiveDate}` : ""}
          </a>
        ))}
      </section>

      {config.notes.length > 0 && (
        <section className="card">
          <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>Notes</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {config.notes.map((note, i) => (
              <li key={i} className="muted" style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)", marginBottom: 4 }}>
                {note}
              </li>
            ))}
          </ul>
          {config.manualRateDisclaimer && (
            <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
              {config.manualRateDisclaimer}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function MarketSwitcher({ current }: { current: TikTokMarketId }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {TIKTOK_MARKET_LIST.map(m => (
        <Link
          key={m.id}
          href={`/tiktok-shop-fee-calculator/${m.id}`}
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "tiktok",
              market: current,
              page_type: "calculator",
              cta_id: `market_switch_${m.id}`,
            });
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--fs-content-meta)",
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

function CalculatorForm({
  form,
  config,
  onPatch,
  onSetNum,
  onSetManualInput,
}: {
  form: TikTokFormState;
  config: TikTokMarketConfig;
  onPatch: (p: Partial<TikTokFormState>) => void;
  onSetNum: (key: keyof TikTokFormState, raw: string) => void;
  onSetManualInput: (key: string, raw: string) => void;
}) {
  const sym = config.currency.symbol;
  const platformMethod = config.fulfillmentMethods.find(item => item.value === "platform");
  const isPlatform = form.fulfillmentMethod === "platform" && !!platformMethod;

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

      {config.sellerProfiles?.length ? (
        <Field label="Seller Profile">
          <select
            className="input"
            value={form.sellerProfile}
            onChange={e => onPatch({ sellerProfile: e.target.value })}
            style={{ cursor: "pointer" }}
          >
            {config.sellerProfiles.map(profile => (
              <option key={profile.value} value={profile.value}>{profile.label}</option>
            ))}
          </select>
        </Field>
      ) : null}

      <Field label="Fulfillment Method">
        <select
          className="input"
          value={form.fulfillmentMethod}
          onChange={e => onPatch({ fulfillmentMethod: e.target.value as "self" | "platform" })}
          style={{ cursor: "pointer" }}
        >
          {config.fulfillmentMethods.map(method => (
            <option key={method.value} value={method.value}>{method.label}</option>
          ))}
        </select>
      </Field>

      <SectionLabel>Pricing</SectionLabel>

      <Field label={`Sold Price (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.soldPrice}
          onChange={e => onSetNum("soldPrice", e.target.value)} />
      </Field>

      <Field label={`Seller Discount (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.sellerDiscount}
          onChange={e => onSetNum("sellerDiscount", e.target.value)} />
      </Field>

      <Field label={`Platform Discount (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.platformDiscount}
          onChange={e => onSetNum("platformDiscount", e.target.value)} />
      </Field>

      <Field label={`Buyer Shipping Fee (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.buyerShippingFee}
          onChange={e => onSetNum("buyerShippingFee", e.target.value)} />
      </Field>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={form.priceIncludesTax}
          onChange={e => onPatch({ priceIncludesTax: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }} />
        <span style={{ fontSize: "var(--fs-content-body-sm)" }}>Price includes {config.tax.name}</span>
      </label>

      <Field label={`${config.tax.name} Rate (%)`}>
        <input className="input" type="number" min="0" step="0.01" value={form.taxRate}
          onChange={e => onSetNum("taxRate", e.target.value)} />
      </Field>

      <p className="muted" style={{ margin: 0, fontSize: "var(--fs-content-meta)", lineHeight: 1.6 }}>
        {config.tax.helpText}
      </p>

      <SectionLabel>Your Costs</SectionLabel>

      <Field label={`Item Cost / COGS (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.itemCost}
          onChange={e => onSetNum("itemCost", e.target.value)} />
      </Field>

      {!isPlatform && (
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
        <input className="input" type="number" min="0" max="100" step="0.01" value={form.affiliateRate}
          onChange={e => onSetNum("affiliateRate", e.target.value)} />
      </Field>

      <Field label={`Ad Spend per Unit (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.adSpendPerUnit}
          onChange={e => onSetNum("adSpendPerUnit", e.target.value)} />
      </Field>

      {config.feeRules.some(rule => rule.sellerInput) && (
        <>
          <SectionLabel>Manual Fee Inputs</SectionLabel>
          {config.feeRules.filter(rule => rule.sellerInput).map(rule => (
            <ManualFeeField
              key={rule.id}
              rule={rule}
              value={form.manualInputs[rule.id] ?? (rule.type === "flat" ? rule.defaultAmount ?? 0 : rule.defaultRate ?? 0)}
              symbol={sym}
              onChange={onSetManualInput}
            />
          ))}
          {config.manualRateDisclaimer && (
            <p className="muted" style={{ margin: 0, fontSize: "var(--fs-content-meta)", lineHeight: 1.6 }}>
              {config.manualRateDisclaimer}
            </p>
          )}
        </>
      )}

      {isPlatform && platformMethod?.kind === "weight-tier" && (
        <WeightTierFields form={form} method={platformMethod} onPatch={onPatch} onSetNum={onSetNum} />
      )}

      {isPlatform && platformMethod?.kind === "size-tier" && (
        <SizeTierFields form={form} method={platformMethod} onPatch={onPatch} onSetNum={onSetNum} />
      )}
    </form>
  );
}

function ManualFeeField({
  rule,
  value,
  symbol,
  onChange,
}: {
  rule: TikTokFeeRule;
  value: number;
  symbol: string;
  onChange: (key: string, raw: string) => void;
}) {
  const isPercent = rule.type === "percentage";
  const label = rule.inputLabel ?? rule.label;

  return (
    <Field label={isPercent ? label : `${label} (${symbol})`}>
      <input
        className="input"
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={e => onChange(rule.id, e.target.value)}
      />
    </Field>
  );
}

function WeightTierFields({
  form,
  method,
  onPatch,
  onSetNum,
}: {
  form: TikTokFormState;
  method: Extract<TikTokFulfillmentConfig, { kind: "weight-tier" }>;
  onPatch: (p: Partial<TikTokFormState>) => void;
  onSetNum: (key: keyof TikTokFormState, raw: string) => void;
}) {
  return (
    <>
      <SectionLabel>{method.label}</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label={`Weight (${method.weightUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.01" value={form.weight}
            onChange={e => onSetNum("weight", e.target.value)} />
        </Field>
        <Field label="Units per Order">
          <select
            className="input"
            value={form.unitsPerOrder}
            onChange={e => onPatch({ unitsPerOrder: Number(e.target.value) })}
            style={{ cursor: "pointer" }}
          >
            <option value={1}>1 unit</option>
            <option value={2}>2 units</option>
            <option value={3}>3 units</option>
            <option value={4}>4+ units</option>
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label={`Length (${method.dimensionUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.1" value={form.dimensionLength}
            onChange={e => onSetNum("dimensionLength", e.target.value)} />
        </Field>
        <Field label={`Width (${method.dimensionUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.1" value={form.dimensionWidth}
            onChange={e => onSetNum("dimensionWidth", e.target.value)} />
        </Field>
        <Field label={`Height (${method.dimensionUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.1" value={form.dimensionHeight}
            onChange={e => onSetNum("dimensionHeight", e.target.value)} />
        </Field>
      </div>

      {method.storageTiers?.length ? (
        <Field label="Storage Duration (days)">
          <input className="input" type="number" min="0" step="1" value={form.storageDays}
            onChange={e => onSetNum("storageDays", e.target.value)} />
        </Field>
      ) : null}
    </>
  );
}

function SizeTierFields({
  form,
  method,
  onPatch,
  onSetNum,
}: {
  form: TikTokFormState;
  method: Extract<TikTokFulfillmentConfig, { kind: "size-tier" }>;
  onPatch: (p: Partial<TikTokFormState>) => void;
  onSetNum: (key: keyof TikTokFormState, raw: string) => void;
}) {
  return (
    <>
      <SectionLabel>{method.label}</SectionLabel>
      <Field label={method.sizeTierLabel}>
        <select
          className="input"
          value={form.packageSizeTier}
          onChange={e => onPatch({ packageSizeTier: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {method.sizeTiers.map(tier => (
            <option key={tier.value} value={tier.value}>{tier.label}</option>
          ))}
        </select>
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label={`Length (${method.dimensionUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.1" value={form.dimensionLength}
            onChange={e => onSetNum("dimensionLength", e.target.value)} />
        </Field>
        <Field label={`Width (${method.dimensionUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.1" value={form.dimensionWidth}
            onChange={e => onSetNum("dimensionWidth", e.target.value)} />
        </Field>
        <Field label={`Height (${method.dimensionUnitLabel})`}>
          <input className="input" type="number" min="0" step="0.1" value={form.dimensionHeight}
            onChange={e => onSetNum("dimensionHeight", e.target.value)} />
        </Field>
      </div>

      {method.storageTiers?.length ? (
        <Field label="Storage Duration (days)">
          <input className="input" type="number" min="0" step="1" value={form.storageDays}
            onChange={e => onSetNum("storageDays", e.target.value)} />
        </Field>
      ) : null}
    </>
  );
}

function ResultsPanel({
  form,
  config,
  res,
  fmt,
}: {
  form: TikTokFormState;
  config: TikTokMarketConfig;
  res: TikTokCalcResult;
  fmt: (v: number) => string;
}) {
  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Calculation Results</h2>

      <GroupLabel>Revenue</GroupLabel>
      <Row label="Customer Payment" value={fmt(res.customerPayment)} />
      <Row label={`${config.tax.name}`} value={fmt(res.customerTax)} />
      <Row label="Customer Payment Excl. Tax" value={fmt(res.customerPaymentExclTax)} />
      <Row label="Seller Revenue" value={fmt(res.sellerRevenue)} />
      <Row label="Seller Revenue Excl. Tax" value={fmt(res.sellerRevenueExclTax)} bold />

      <Divider />

      <GroupLabel>TikTok Shop Fees</GroupLabel>
      {res.platformFees.map(item => (
        <div key={item.id} style={{ marginBottom: 8 }}>
          <Row label={item.label} value={fmt(item.amount)} />
          <div className="muted" style={{ fontSize: "var(--fs-content-meta)", marginTop: -4, paddingLeft: 4 }}>
            {item.detail}
          </div>
        </div>
      ))}
      <Row label="Total TikTok Fees" value={fmt(res.totalPlatformFees)} bold color="#dc2626" />

      <Divider />

      <GroupLabel>Seller Costs</GroupLabel>
      <Row label="Item Cost / COGS" value={fmt(form.itemCost)} />
      {form.fulfillmentMethod === "self" && <Row label="Shipping Cost" value={fmt(form.shippingCost)} />}
      {res.affiliateCommission > 0 && (
        <>
          <Row label="Affiliate Commission" value={fmt(res.affiliateCommission)} />
          <div className="muted" style={{ fontSize: "var(--fs-content-meta)", marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            {form.affiliateRate}% of item price after seller discount
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

function ShareButtons({ config }: { config: TikTokMarketConfig }) {
  const [shareUrl] = useState(() => typeof window !== "undefined" ? window.location.href : "");
  const [copied, setCopied] = useState(false);

  const text = encodeURIComponent(`${config.seo.h1} - Calculate TikTok Shop fees & profit | ${BRAND.suiteDisplay}`);
  const url = encodeURIComponent(shareUrl);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    trackEvent("CtaClicked", {
      tool_id: "tiktok",
      market: config.id,
      page_type: "calculator",
      cta_id: "share_copy_link",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{ fontSize: "var(--fs-content-body-sm)", fontWeight: 600, marginBottom: 8, color: "var(--color-text-secondary)" }}>
        Share this calculator
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "tiktok",
              market: config.id,
              page_type: "calculator",
              cta_id: "share_x",
            });
          }}
          className="btn btn-secondary"
          style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}
        >
          <XIcon /> Post on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "tiktok",
              market: config.id,
              page_type: "calculator",
              cta_id: "share_facebook",
            });
          }}
          className="btn btn-secondary"
          style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}
        >
          <FacebookIcon /> Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "tiktok",
              market: config.id,
              page_type: "calculator",
              cta_id: "share_linkedin",
            });
          }}
          className="btn btn-secondary"
          style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}
        >
          <LinkedInIcon /> Share
        </a>
        <button onClick={copyLink} className="btn btn-secondary" style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}>
          <LinkIcon /> {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

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
    trackEvent("CtaClicked", {
      tool_id: "tiktok",
      market: config.id,
      page_type: "calculator",
      cta_id: "report_issue_submit",
    });
    setStatus("sending");
    try {
      const resp = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "calculator_issue",
          source: "tiktok-shop-fee-calculator",
          message,
          context: {
            Market: `${config.name} (${config.domain})`,
            Category: form.category,
            Fulfillment: form.fulfillmentMethod,
            "Customer Payment": fmt(res.customerPayment),
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
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "tiktok",
              market: config.id,
              page_type: "calculator",
              cta_id: "report_issue_open",
            });
            setOpen(true);
          }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "var(--fs-content-body-sm)", color: "var(--color-primary)", fontWeight: 600, padding: 0,
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
        <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: "var(--fs-content-body-sm)" }}>
          Describe the issue you found. Your current calculation parameters will be included automatically.
        </p>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#16a34a", fontWeight: 600, fontSize: 15 }}>
            Report submitted successfully. Thank you for your feedback!
          </div>
        ) : (
          <>
            {status === "error" && (
              <div style={{ color: "#dc2626", fontSize: "var(--fs-content-body-sm)", marginBottom: 12 }}>
                Failed to submit. Please try again later.
              </div>
            )}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe which official rule or result looks wrong..."
              style={{
                width: "100%", minHeight: 100, border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)", padding: 10, fontSize: "var(--fs-form-control)",
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <div style={{ marginBottom: 6, fontSize: "var(--fs-form-label)" }}>{label}</div>
      {children}
    </label>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--color-text-secondary)" }}>
      {children}
    </div>
  );
}

function Row({ label, value, bold, color, large }: {
  label: string; value: string; bold?: boolean; color?: string; large?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
      <div style={{ fontSize: large ? 16 : 15, fontWeight: bold ? 700 : 500 }}>{label}</div>
      <div style={{ fontSize: large ? 16 : 15, fontWeight: bold ? 700 : 600, color }}>{value}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--color-border)", margin: "12px 0" }} />;
}

function XIcon() {
  return <span aria-hidden="true">𝕏</span>;
}

function FacebookIcon() {
  return <span aria-hidden="true">f</span>;
}

function LinkedInIcon() {
  return <span aria-hidden="true">in</span>;
}

function LinkIcon() {
  return <span aria-hidden="true">🔗</span>;
}
