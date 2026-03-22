"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ShopifyCalcResult,
  type ShopifyFormState,
  type ShopifyMarketConfig,
  type ShopifyMarketId,
  calculate,
  formatCurrency,
  getSelectedPlan,
  makeDefaultForm,
  SHOPIFY_MARKET_GROUPS,
  SHOPIFY_MARKETS,
} from "./shopify-config";
import { FlagIcon } from "../components/country-flags";
import { trackEvent } from "@/lib/analytics";

const FEEDBACK_ENDPOINT =
  process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "/api/feedback";

export default function ShopifyFeeCalculator({ marketId }: { marketId: ShopifyMarketId }) {
  const config = SHOPIFY_MARKETS[marketId];

  const [form, setForm] = useState<ShopifyFormState>(() => makeDefaultForm(config));
  const plan = useMemo(() => getSelectedPlan(config, form.plan), [config, form.plan]);
  const res = useMemo(() => calculate(form, config), [form, config]);
  const fmt = useCallback((v: number) => formatCurrency(v, config), [config]);
  const hasTrackedToolUsed = useRef(false);
  const hasTrackedResultViewed = useRef(false);

  useEffect(() => {
    setForm(makeDefaultForm(config));
  }, [config]);

  const trackCalculatorInteraction = useCallback((interactionType: string) => {
    if (!hasTrackedToolUsed.current) {
      trackEvent("ToolUsed", {
        tool_id: "shopify",
        market: marketId,
        page_type: "calculator",
        interaction_type: interactionType,
      });
      hasTrackedToolUsed.current = true;
    }

    if (!hasTrackedResultViewed.current) {
      trackEvent("ResultViewed", {
        tool_id: "shopify",
        market: marketId,
        page_type: "calculator",
      });
      hasTrackedResultViewed.current = true;
    }
  }, [marketId]);

  function applyPatch(partial: Partial<ShopifyFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function patch(partial: Partial<ShopifyFormState>) {
    trackCalculatorInteraction("form_change");
    applyPatch(partial);
  }

  function setNum(key: keyof ShopifyFormState, raw: string) {
    const value = Number(raw);
    trackCalculatorInteraction("numeric_input");
    applyPatch({ [key]: Number.isFinite(value) ? value : 0 } as Partial<ShopifyFormState>);
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
          planLabel={plan.label}
          onPatch={patch}
          onSetNum={setNum}
        />
        <ResultsPanel form={form} config={config} planLabel={plan.label} res={res} fmt={fmt} />
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
            style={{ color: "var(--color-primary)", fontSize: 13, textDecoration: "none" }}
          >
            {doc.title}
            {doc.scope ? ` · ${doc.scope}` : ""}
          </a>
        ))}
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

function MarketSwitcher({ current }: { current: ShopifyMarketId }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {SHOPIFY_MARKET_GROUPS.map((group) => (
        <div key={group.region} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.04em",
              minWidth: 106,
            }}
          >
            {group.label}
          </span>
          {group.markets.map((market) => (
            <Link
              key={market.id}
              href={`/shopify-fee-calculator/${market.id}`}
              onClick={() => {
                trackEvent("CtaClicked", {
                  tool_id: "shopify",
                  market: current,
                  page_type: "calculator",
                  cta_id: `market_switch_${market.id}`,
                });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: 13,
                fontWeight: 600,
                background: market.id === current ? "var(--color-primary)" : "transparent",
                color: market.id === current ? "#fff" : "var(--color-text-secondary)",
                border: `1px solid ${market.id === current ? "var(--color-primary)" : "var(--color-border)"}`,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <FlagIcon code={market.id} />
              {market.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function CalculatorForm({
  form,
  config,
  planLabel,
  onPatch,
  onSetNum,
}: {
  form: ShopifyFormState;
  config: ShopifyMarketConfig;
  planLabel: string;
  onPatch: (partial: Partial<ShopifyFormState>) => void;
  onSetNum: (key: keyof ShopifyFormState, raw: string) => void;
}) {
  const sym = config.currency.symbol;
  const moneyStep = config.currency.decimals === 0 ? "1" : "0.01";
  const selectedPlan = getSelectedPlan(config, form.plan);

  return (
    <form className="card grid" style={{ gap: 14 }} onSubmit={(event) => event.preventDefault()}>
      <SectionLabel>Store Setup</SectionLabel>

      <Field label="Subscription Plan">
        <select
          className="input"
          value={form.plan}
          onChange={(event) => onPatch({ plan: event.target.value as ShopifyFormState["plan"] })}
          style={{ cursor: "pointer" }}
        >
          {config.plans.map((plan) => (
            <option key={plan.value} value={plan.value}>
              {plan.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Billing Cycle">
        <select
          className="input"
          value={form.billingCycle}
          onChange={(event) => onPatch({ billingCycle: event.target.value as ShopifyFormState["billingCycle"] })}
          style={{ cursor: "pointer" }}
        >
          <option value="monthly">Monthly billing</option>
          <option value="yearly">Yearly billing (monthly equivalent)</option>
        </select>
      </Field>

      <Field label="Orders per Month">
        <input
          className="input"
          type="number"
          min="1"
          step="1"
          value={form.ordersPerMonth}
          onChange={(event) => onSetNum("ordersPerMonth", event.target.value)}
        />
      </Field>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.usesShopifyPayments}
          onChange={(event) => onPatch({ usesShopifyPayments: event.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }}
        />
        <span style={{ fontSize: 14 }}>Use Shopify Payments</span>
      </label>

      <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
        {form.usesShopifyPayments
          ? `${planLabel}: ${selectedPlan.shopifyPaymentsRate.toFixed(2)}% + ${sym}${selectedPlan.shopifyPaymentsFixedFee.toFixed(config.currency.decimals)} per order.`
          : `${planLabel}: Shopify transaction fee ${selectedPlan.thirdPartyTransactionRate.toFixed(2)}% when using a third-party processor.`}
      </p>

      <SectionLabel>Revenue Inputs</SectionLabel>

      <Field label={`Product Price (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.soldPrice}
          onChange={(event) => onSetNum("soldPrice", event.target.value)} />
      </Field>

      <Field label={`Shipping Charged to Customer (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.shippingCharged}
          onChange={(event) => onSetNum("shippingCharged", event.target.value)} />
      </Field>

      <SectionLabel>Tax Handling</SectionLabel>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.priceIncludesTax}
          onChange={(event) => onPatch({ priceIncludesTax: event.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }}
        />
        <span style={{ fontSize: 14 }}>Price includes {config.tax.name}</span>
      </label>

      <Field label={`${config.tax.name} Rate (%)`}>
        <input className="input" type="number" min="0" step="0.01" value={form.taxRate}
          onChange={(event) => onSetNum("taxRate", event.target.value)} />
      </Field>

      <Field label={`${config.tax.name} Remitted Adjustment (Manual, ${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.salesTaxPerOrder}
          onChange={(event) => onSetNum("salesTaxPerOrder", event.target.value)} />
      </Field>

      <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
        {config.tax.helpText}
      </p>

      <SectionLabel>Product and Operating Costs</SectionLabel>

      <Field label={`Item Cost / COGS (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.itemCost}
          onChange={(event) => onSetNum("itemCost", event.target.value)} />
      </Field>

      <Field label={`Fulfillment Shipping Cost (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.shippingCost}
          onChange={(event) => onSetNum("shippingCost", event.target.value)} />
      </Field>

      <Field label={`Marketing Cost per Order (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.marketingCost}
          onChange={(event) => onSetNum("marketingCost", event.target.value)} />
      </Field>

      <Field label={`Other Cost per Order (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.otherCostsPerOrder}
          onChange={(event) => onSetNum("otherCostsPerOrder", event.target.value)} />
      </Field>

      <SectionLabel>Monthly Overhead Allocation</SectionLabel>

      <Field label={`Monthly App Costs (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.monthlyAppCost}
          onChange={(event) => onSetNum("monthlyAppCost", event.target.value)} />
      </Field>

      <Field label={`Monthly Operational Costs (${sym})`}>
        <input className="input" type="number" min="0" step={moneyStep} value={form.monthlyOperationalCost}
          onChange={(event) => onSetNum("monthlyOperationalCost", event.target.value)} />
      </Field>

      {!form.usesShopifyPayments && (
        <>
          <SectionLabel>Third-party Processor Fees</SectionLabel>

          <Field label="Third-party Processing Rate (%)">
            <input className="input" type="number" min="0" step="0.01" value={form.thirdPartyProcessorRate}
              onChange={(event) => onSetNum("thirdPartyProcessorRate", event.target.value)} />
          </Field>

          <Field label={`Third-party Fixed Fee per Order (${sym})`}>
            <input className="input" type="number" min="0" step={moneyStep} value={form.thirdPartyProcessorFixedFee}
              onChange={(event) => onSetNum("thirdPartyProcessorFixedFee", event.target.value)} />
          </Field>

          <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
            Enter your provider rates (for example PayPal or Stripe). Shopify transaction fee is still applied separately.
          </p>
        </>
      )}
    </form>
  );
}

function ResultsPanel({
  form,
  config,
  planLabel,
  res,
  fmt,
}: {
  form: ShopifyFormState;
  config: ShopifyMarketConfig;
  planLabel: string;
  res: ShopifyCalcResult;
  fmt: (value: number) => string;
}) {
  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Calculation Results</h2>

      <GroupLabel>Revenue</GroupLabel>
      <Row label="Product Price" value={fmt(form.soldPrice)} />
      {form.shippingCharged > 0 && <Row label="+ Shipping Charged" value={fmt(form.shippingCharged)} />}
      <Row label="Gross Revenue Charged" value={fmt(res.grossRevenue)} />
      {form.priceIncludesTax && res.customerTax > 0 && (
        <Row label={`Included ${config.tax.name}`} value={fmt(res.customerTax)} />
      )}
      {res.revenueExcludingTax !== res.grossRevenue && (
        <Row label={`Revenue Excluding ${config.tax.name}`} value={fmt(res.revenueExcludingTax)} />
      )}
      <Row label="Net Revenue Basis" value={fmt(res.revenueExcludingTax)} bold />

      <Divider />

      <GroupLabel>Platform Fees</GroupLabel>
      {form.usesShopifyPayments ? (
        <Row label="Shopify Payments Fee" value={fmt(res.paymentProcessingFee)} />
      ) : (
        <>
          <Row label="Third-party Processor Fee" value={fmt(res.thirdPartyProcessorFee)} />
          <Row label="Shopify Transaction Fee" value={fmt(res.shopifyTransactionFee)} />
        </>
      )}
      <Row label={`${planLabel} Subscription (monthly)`} value={fmt(res.monthlySubscriptionCost)} />
      <Row label="Subscription Allocated per Order" value={fmt(res.subscriptionPerOrder)} />
      {res.appCostPerOrder > 0 && <Row label="App Cost per Order" value={fmt(res.appCostPerOrder)} />}
      {res.operationalCostPerOrder > 0 && <Row label="Operational Cost per Order" value={fmt(res.operationalCostPerOrder)} />}
      {res.shopifyFeeTax > 0 && <Row label={`${config.tax.name} on Shopify Fees`} value={fmt(res.shopifyFeeTax)} />}
      <Row label="Total Platform Costs" value={fmt(res.platformCosts)} bold color="#dc2626" />

      <Divider />

      <GroupLabel>Direct Costs</GroupLabel>
      <Row label="Item Cost / COGS" value={fmt(form.itemCost)} />
      <Row label="Fulfillment Shipping Cost" value={fmt(form.shippingCost)} />
      {form.marketingCost > 0 && <Row label="Marketing Cost" value={fmt(form.marketingCost)} />}
      {form.otherCostsPerOrder > 0 && <Row label="Other Cost" value={fmt(form.otherCostsPerOrder)} />}
      {res.salesTaxRemitted > 0 && <Row label={`${config.tax.name} Remitted`} value={fmt(res.salesTaxRemitted)} />}
      <Row label="Total Costs" value={fmt(res.totalCosts)} bold color="#dc2626" />

      <Divider />

      <Row
        label="Net Profit"
        value={fmt(res.netProfit)}
        bold
        large
        color={res.netProfit >= 0 ? "#16a34a" : "#dc2626"}
      />
      <Row
        label="Profit Margin"
        value={`${res.margin.toFixed(2)}%`}
        bold
        large
        color={res.margin >= 0 ? "#16a34a" : "#dc2626"}
      />
    </aside>
  );
}

function ShareButtons({ config }: { config: ShopifyMarketConfig }) {
  const [shareUrl] = useState(() => typeof window !== "undefined" ? window.location.href : "");
  const [copied, setCopied] = useState(false);

  const text = encodeURIComponent(`${config.seo.h1} - Calculate Shopify costs & profit | SellerLab`);
  const url = encodeURIComponent(shareUrl);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    trackEvent("CtaClicked", {
      tool_id: "shopify",
      market: config.id,
      page_type: "calculator",
      cta_id: "share_copy_link",
    });
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
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "shopify",
              market: config.id,
              page_type: "calculator",
              cta_id: "share_x",
            });
          }}
          className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}
        >
          <XIcon /> Post on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank" rel="noopener noreferrer"
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "shopify",
              market: config.id,
              page_type: "calculator",
              cta_id: "share_facebook",
            });
          }}
          className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}
        >
          <FacebookIcon /> Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank" rel="noopener noreferrer"
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "shopify",
              market: config.id,
              page_type: "calculator",
              cta_id: "share_linkedin",
            });
          }}
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

function FeedbackSection({
  config,
  form,
  res,
  fmt,
}: {
  config: ShopifyMarketConfig;
  form: ShopifyFormState;
  res: ShopifyCalcResult;
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
      tool_id: "shopify",
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
          source: "shopify-fee-calculator",
          message,
          context: {
            Market: `${config.name} (${config.domain})`,
            Plan: form.plan,
            "Shopify Payments": form.usesShopifyPayments ? "yes" : "no",
            "Price Includes Tax": form.priceIncludesTax ? "yes" : "no",
            "Tax Rate (%)": String(form.taxRate),
            "Orders/Month": String(form.ordersPerMonth),
            "Gross Revenue": fmt(res.grossRevenue),
            "Revenue Excl Tax": fmt(res.revenueExcludingTax),
            "Total Costs": fmt(res.totalCosts),
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
              tool_id: "shopify",
              market: config.id,
              page_type: "calculator",
              cta_id: "report_issue_open",
            });
            setOpen(true);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--color-primary)",
            fontWeight: 600,
            padding: 0,
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
          padding: 24,
          maxWidth: 480,
          width: "90vw",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 18 }}>Report Calculation Issue</h3>
        <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 13 }}>
          Describe the issue you found. Your current calculation parameters will be included automatically.
        </p>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#16a34a", fontWeight: 600, fontSize: 15 }}>
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
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe which fee or formula result looks incorrect..."
              style={{
                width: "100%",
                minHeight: 100,
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: 10,
                fontSize: 14,
                resize: "vertical",
                fontFamily: "inherit",
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
      <div style={{ marginBottom: 6, fontSize: 14 }}>{label}</div>
      {children}
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--color-text-tertiary)",
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: 6,
        marginTop: 4,
      }}
    >
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
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
  large?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 6,
      marginBottom: 2,
      fontSize: large ? 16 : 14,
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
