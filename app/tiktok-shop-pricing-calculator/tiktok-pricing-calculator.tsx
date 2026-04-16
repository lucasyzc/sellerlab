"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionLabel } from "../components/section-label";
import { FlagIcon } from "../components/country-flags";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import {
  resolveSeoYear,
  withSeoYear,
} from "@/lib/fee-seo";
import {
  evaluateAtListingPrice,
  makeDefaultPricingForm,
  solveListingPrice,
  type TikTokPricingFormState,
  type TikTokPricingSolveResult,
  type TikTokPricingTargetMode,
} from "./pricing-config";
import {
  formatCurrency,
  getTikTokMarket,
  type TikTokMarketConfig,
  type TikTokMarketId,
  TIKTOK_MARKET_LIST,
} from "../tiktok-shop-fee-calculator/tiktok-config";
import styles from "./tiktok-pricing.module.css";

const FEEDBACK_ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "/api/feedback";

export default function TikTokPricingCalculator({ marketId }: { marketId: TikTokMarketId }) {
  const config = getTikTokMarket(marketId)!;
  const seoYear = resolveSeoYear(config.seo.effectiveYear);

  const [form, setForm] = useState<TikTokPricingFormState>(() => makeDefaultPricingForm(config));
  const result = solveListingPrice(form, config);
  const lowerCheck =
    result.status === "ok"
      ? evaluateAtListingPrice(Math.max(0, result.listingPrice - 0.01), form, config)
      : null;
  const fmt = (value: number) => formatCurrency(value, config);

  const hasTrackedToolUsed = useRef(false);
  const hasTrackedResultViewed = useRef(false);

  const trackCalculatorInteraction = useCallback(
    (interactionType: string) => {
      if (!hasTrackedToolUsed.current) {
        trackEvent("ToolUsed", {
          tool_id: "tiktok_pricing",
          market: marketId,
          page_type: "calculator",
          interaction_type: interactionType,
        });
        hasTrackedToolUsed.current = true;
      }

      if (!hasTrackedResultViewed.current) {
        trackEvent("ResultViewed", {
          tool_id: "tiktok_pricing",
          market: marketId,
          page_type: "calculator",
        });
        hasTrackedResultViewed.current = true;
      }
    },
    [marketId],
  );

  function applyPatch(partial: Partial<TikTokPricingFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function patch(partial: Partial<TikTokPricingFormState>) {
    trackCalculatorInteraction("form_change");
    applyPatch(partial);
  }

  function setNum(key: keyof TikTokPricingFormState, raw: string) {
    const next = Number(raw);
    trackCalculatorInteraction("numeric_input");
    applyPatch({ [key]: Number.isFinite(next) ? next : 0 } as Partial<TikTokPricingFormState>);
  }

  return (
    <div className={styles.calculatorShell}>
      <section className={styles.calculatorHeader}>
        <h2 className={styles.calcTitle}>{withSeoYear("Calculator Workspace", seoYear)}</h2>
        <p className={styles.calcSubtitle}>
          Enter your real cost stack and target margin, then let the solver return the minimum listing price that still protects profit after TikTok Shop fees.
        </p>
        <MarketSwitcher current={marketId} />
      </section>

      <section className={styles.calcGrid}>
        <CalculatorForm form={form} config={config} onPatch={patch} onSetNum={setNum} />
        <ResultsPanel form={form} config={config} result={result} lowerCheck={lowerCheck} fmt={fmt} />
      </section>

      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ShareButtons config={config} />
        <FeedbackSection config={config} form={form} result={result} fmt={fmt} />
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 15 }}>How the pricing engine works</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li className="muted" style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            Sold Price = Listing Price − Seller Discount.
          </li>
          <li className="muted" style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            Buyer Payment = Sold Price − Platform Discount + Buyer Shipping Fee.
          </li>
          <li className="muted" style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            Net Profit = Seller Revenue Excluding Tax − Platform Fees − COGS − Shipping − Affiliate − Ads − Other Costs.
          </li>
          <li className="muted" style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            The solver uses binary search to find the minimum listing price where your selected target is still reached.
          </li>
        </ul>
      </section>
    </div>
  );
}

function MarketSwitcher({ current }: { current: TikTokMarketId }) {
  return (
    <div className={styles.switcher}>
      {TIKTOK_MARKET_LIST.map((market) => (
        <Link
          key={market.id}
          href={`/tiktok-shop-pricing-calculator/${market.id}`}
          className={`${styles.switchPill} ${market.id === current ? styles.switchPillActive : ""}`}
        >
          <FlagIcon code={market.id} />
          {market.name}
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
}: {
  form: TikTokPricingFormState;
  config: TikTokMarketConfig;
  onPatch: (value: Partial<TikTokPricingFormState>) => void;
  onSetNum: (key: keyof TikTokPricingFormState, raw: string) => void;
}) {
  const isPlatform = form.fulfillmentMethod === "platform";
  const sym = config.currency.symbol;
  const platformMethod = config.fulfillmentMethods.find((m) => m.value === "platform");

  return (
    <form className={styles.formCard} onSubmit={(e) => e.preventDefault()}>
      <SectionLabel>Target</SectionLabel>

      <Field label="Target Type">
        <select
          className="input"
          value={form.targetMode}
          onChange={(e) => onPatch({ targetMode: e.target.value as TikTokPricingTargetMode })}
        >
          <option value="profit_amount">Profit amount</option>
          <option value="profit_margin">Profit margin (%)</option>
        </select>
      </Field>

      <Field label={form.targetMode === "profit_amount" ? `Target Net Profit (${sym})` : "Target Profit Margin (%)"}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.targetValue}
          onChange={(e) => onSetNum("targetValue", e.target.value)}
        />
      </Field>

      <SectionLabel>Cost Assumptions</SectionLabel>

      <Field label={`Seller Discount (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.sellerDiscount} onChange={(e) => onSetNum("sellerDiscount", e.target.value)} />
      </Field>
      <Field label={`Platform Discount (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.platformDiscount} onChange={(e) => onSetNum("platformDiscount", e.target.value)} />
      </Field>
      <Field label={`Buyer Shipping Fee (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.buyerShippingFee} onChange={(e) => onSetNum("buyerShippingFee", e.target.value)} />
      </Field>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.priceIncludesTax}
          onChange={(e) => onPatch({ priceIncludesTax: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }}
        />
        <span style={{ fontSize: "var(--fs-content-body-sm)" }}>Price includes {config.tax.name}</span>
      </label>
      <Field label={`${config.tax.name} Rate (%)`}>
        <input className="input" type="number" min="0" step="0.01" value={form.taxRate} onChange={(e) => onSetNum("taxRate", e.target.value)} />
      </Field>
      <p className="muted" style={{ margin: 0, fontSize: "var(--fs-content-meta)", lineHeight: 1.6 }}>{config.tax.helpText}</p>

      <Field label={`Item Cost / COGS (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.itemCost} onChange={(e) => onSetNum("itemCost", e.target.value)} />
      </Field>

      {!isPlatform && (
        <Field label={`Shipping Cost (${sym})`}>
          <input className="input" type="number" min="0" step="0.01" value={form.shippingCost} onChange={(e) => onSetNum("shippingCost", e.target.value)} />
        </Field>
      )}

      <Field label={`Other Costs (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.otherCosts} onChange={(e) => onSetNum("otherCosts", e.target.value)} />
      </Field>

      <SectionLabel>Marketing</SectionLabel>
      <Field label="Affiliate Commission Rate (%)">
        <input className="input" type="number" min="0" max="100" step="0.01" value={form.affiliateRate} onChange={(e) => onSetNum("affiliateRate", e.target.value)} />
      </Field>
      <Field label={`Ad Spend per Unit (${sym})`}>
        <input className="input" type="number" min="0" step="0.01" value={form.adSpendPerUnit} onChange={(e) => onSetNum("adSpendPerUnit", e.target.value)} />
      </Field>

      <SectionLabel>Fulfillment</SectionLabel>
      <Field label="Fulfillment Method">
        <select className="input" value={form.fulfillmentMethod} onChange={(e) => onPatch({ fulfillmentMethod: e.target.value as "self" | "platform" })}>
          {config.fulfillmentMethods.map((method) => (
            <option key={method.value} value={method.value}>{method.label}</option>
          ))}
        </select>
      </Field>

      {isPlatform && config.fulfillmentMethods.find((m) => m.value === "platform")?.kind === "weight-tier" && (
        <>
          <Field label="Package Weight (lb)">
            <input className="input" type="number" min="0" step="0.01" value={form.weight} onChange={(e) => onSetNum("weight", e.target.value)} />
          </Field>
          <Field label="Package Length (in)">
            <input className="input" type="number" min="0" step="0.01" value={form.dimensionLength} onChange={(e) => onSetNum("dimensionLength", e.target.value)} />
          </Field>
          <Field label="Package Width (in)">
            <input className="input" type="number" min="0" step="0.01" value={form.dimensionWidth} onChange={(e) => onSetNum("dimensionWidth", e.target.value)} />
          </Field>
          <Field label="Package Height (in)">
            <input className="input" type="number" min="0" step="0.01" value={form.dimensionHeight} onChange={(e) => onSetNum("dimensionHeight", e.target.value)} />
          </Field>
          <Field label="Units per Order">
            <input className="input" type="number" min="1" step="1" value={form.unitsPerOrder} onChange={(e) => onSetNum("unitsPerOrder", e.target.value)} />
          </Field>
          {platformMethod?.storageTiers?.length ? (
            <Field label="Storage Duration (days)">
              <input className="input" type="number" min="0" step="1" value={form.storageDays} onChange={(e) => onSetNum("storageDays", e.target.value)} />
            </Field>
          ) : null}
        </>
      )}

      {isPlatform && platformMethod?.kind === "size-tier" && (
        <>
          <Field label="Package Size Tier">
            <select className="input" value={form.packageSizeTier} onChange={(e) => onPatch({ packageSizeTier: e.target.value })}>
              {platformMethod.sizeTiers.map((tier) => (
                <option key={tier.value} value={tier.value}>{tier.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Package Length (cm)">
            <input className="input" type="number" min="0" step="0.01" value={form.dimensionLength} onChange={(e) => onSetNum("dimensionLength", e.target.value)} />
          </Field>
          <Field label="Package Width (cm)">
            <input className="input" type="number" min="0" step="0.01" value={form.dimensionWidth} onChange={(e) => onSetNum("dimensionWidth", e.target.value)} />
          </Field>
          <Field label="Package Height (cm)">
            <input className="input" type="number" min="0" step="0.01" value={form.dimensionHeight} onChange={(e) => onSetNum("dimensionHeight", e.target.value)} />
          </Field>
          {platformMethod.storageTiers?.length ? (
            <Field label="Storage Duration (days)">
              <input className="input" type="number" min="0" step="1" value={form.storageDays} onChange={(e) => onSetNum("storageDays", e.target.value)} />
            </Field>
          ) : null}
        </>
      )}
    </form>
  );
}

function ResultsPanel({
  form,
  config,
  result,
  lowerCheck,
  fmt,
}: {
  form: TikTokPricingFormState;
  config: TikTokMarketConfig;
  result: TikTokPricingSolveResult;
  lowerCheck: ReturnType<typeof evaluateAtListingPrice> | null;
  fmt: (value: number) => string;
}) {
  const targetLabel =
    form.targetMode === "profit_amount"
      ? `Net Profit >= ${fmt(form.targetValue)}`
      : `Profit Margin >= ${form.targetValue.toFixed(2)}%`;

  return (
    <aside className={styles.resultCard}>
      <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 20 }}>Pricing Results</h3>

      {result.status !== "ok" ? (
        <div style={{ border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 8, padding: 10, color: "#b91c1c", fontSize: "var(--fs-content-body-sm)", lineHeight: 1.6 }}>
          {result.message}
        </div>
      ) : null}

      <div className={styles.groupLabel}>Recommended Price</div>
      <Row label="Listing Price" value={fmt(result.listingPrice)} bold large color="#0f4cbc" />
      <Row label="Effective Sold Price" value={fmt(result.soldPrice)} />
      <Row label={`${config.tax.name}`} value={fmt(result.calcResult?.customerTax ?? 0)} />
      <Row label="Seller Revenue Excl. Tax" value={fmt(result.calcResult?.sellerRevenueExclTax ?? 0)} bold />

      <div className={styles.divider} />

      <div className={styles.groupLabel}>Platform Fees</div>
      {result.calcResult?.platformFees.map((item) => (
        <div key={item.id} style={{ marginBottom: 8 }}>
          <Row label={item.label} value={fmt(item.amount)} />
          <div className="muted" style={{ fontSize: "var(--fs-content-meta)", marginTop: -4, paddingLeft: 4 }}>{item.detail}</div>
        </div>
      ))}
      <Row label="Total TikTok Fees" value={fmt(result.calcResult?.totalPlatformFees ?? 0)} bold color="#dc2626" />

      <div className={styles.divider} />

      <div className={styles.groupLabel}>Cost Stack</div>
      <Row label="Item Cost / COGS" value={fmt(form.itemCost)} />
      {form.fulfillmentMethod === "self" && <Row label="Shipping Cost" value={fmt(form.shippingCost)} />}
      <Row label="Affiliate Commission" value={fmt(result.calcResult?.affiliateCommission ?? 0)} />
      <Row label="Ad Spend" value={fmt(result.calcResult?.adSpend ?? 0)} />
      <Row label="Other Costs" value={fmt(form.otherCosts)} />

      <div className={styles.divider} />

      <div className={styles.groupLabel}>Profit Snapshot</div>
      <Row
        label="Net Profit"
        value={fmt(result.calcResult?.netProfit ?? 0)}
        bold
        large
        color={(result.calcResult?.netProfit ?? 0) >= 0 ? "#16a34a" : "#dc2626"}
      />
      <Row
        label="Profit Margin"
        value={`${result.calcResult?.margin.toFixed(2) ?? 0}%`}
        bold
        large
        color={(result.calcResult?.margin ?? 0) >= 0 ? "#16a34a" : "#dc2626"}
      />
      <Row
        label="ROI"
        value={`${result.calcResult?.roi.toFixed(1) ?? 0}%`}
        color={(result.calcResult?.roi ?? 0) >= 0 ? "#16a34a" : "#dc2626"}
      />

      <div className={styles.divider} />

      <div className={styles.groupLabel}>Solver Rule</div>
      <div className="muted" style={{ marginTop: 6, fontSize: "var(--fs-content-body-sm)", lineHeight: 1.6 }}>
        <div>{targetLabel}</div>
        <div>Iterations: {result.iterations}</div>
        {lowerCheck ? (
          <div>
            At {fmt(lowerCheck.listingPrice)}, target reached: {lowerCheck.targetReached ? "Yes" : "No"}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function ShareButtons({ config }: { config: TikTokMarketConfig }) {
  const [shareUrl] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));
  const [copied, setCopied] = useState(false);

  const text = encodeURIComponent(`${config.seo.h1} | ${BRAND.suiteDisplay}`);
  const url = encodeURIComponent(shareUrl);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    trackEvent("CtaClicked", {
      tool_id: "tiktok_pricing",
      market: config.id,
      page_type: "calculator",
      cta_id: "share_copy_link",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{ fontSize: "var(--fs-content-body-sm)", fontWeight: 600, marginBottom: 8, color: "var(--color-text-secondary)" }}>Share this calculator</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("CtaClicked", { tool_id: "tiktok_pricing", market: config.id, page_type: "calculator", cta_id: "share_x" })}
          className="btn btn-secondary"
          style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}
        >
          <XIcon /> Post on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("CtaClicked", { tool_id: "tiktok_pricing", market: config.id, page_type: "calculator", cta_id: "share_facebook" })}
          className="btn btn-secondary"
          style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}
        >
          <FacebookIcon /> Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("CtaClicked", { tool_id: "tiktok_pricing", market: config.id, page_type: "calculator", cta_id: "share_linkedin" })}
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
  config,
  form,
  result,
  fmt,
}: {
  config: TikTokMarketConfig;
  form: TikTokPricingFormState;
  result: TikTokPricingSolveResult;
  fmt: (value: number) => string;
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
      tool_id: "tiktok_pricing",
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
          source: "tiktok-shop-pricing-calculator",
          message,
          context: {
            Market: `${config.name} (${config.domain})`,
            Category: form.category,
            Fulfillment: form.fulfillmentMethod,
            "Target Mode": form.targetMode,
            "Target Value": form.targetValue,
            "Customer Payment": fmt(result.calcResult?.customerPayment ?? 0),
            "Total Fees": fmt(result.calcResult?.totalPlatformFees ?? 0),
            "Net Profit": fmt(result.calcResult?.netProfit ?? 0),
            URL: typeof window !== "undefined" ? window.location.href : "",
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
            trackEvent("CtaClicked", { tool_id: "tiktok_pricing", market: config.id, page_type: "calculator", cta_id: "report_issue_open" });
            setOpen(true);
          }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--fs-content-body-sm)", color: "var(--color-primary)", fontWeight: 600, padding: 0 }}
        >
          Calculation not correct? Report an issue
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius)", padding: 24, maxWidth: 480, width: "90vw", boxShadow: "var(--shadow-lg)" }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 18 }}>Report Calculation Issue</h3>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: "var(--fs-content-body-sm)" }}>
          Describe the issue you found. Your current pricing assumptions will be included automatically.
        </p>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#16a34a", fontWeight: 600, fontSize: 15 }}>
            Report submitted successfully. Thank you for your feedback!
          </div>
        ) : (
          <>
            {status === "error" && <div style={{ color: "#dc2626", fontSize: "var(--fs-content-body-sm)", marginBottom: 12 }}>Failed to submit. Please try again later.</div>}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe which official rule or result looks wrong..."
              style={{ width: "100%", minHeight: 100, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: 10, fontSize: "var(--fs-form-control)", resize: "vertical", fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-primary" disabled={!message.trim() || status === "sending"}>
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
      <div className={styles.fieldLabel}>{label}</div>
      {children}
    </label>
  );
}

function Row({ label, value, bold, color, large }: { label: string; value: string; bold?: boolean; color?: string; large?: boolean }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel} style={{ fontWeight: bold ? 700 : 500, fontSize: large ? 16 : 15 }}>{label}</div>
      <div className={styles.rowValue} style={{ color, fontWeight: bold ? 700 : 600, fontSize: large ? 16 : 15 }}>{value}</div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
