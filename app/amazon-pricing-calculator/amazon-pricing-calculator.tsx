"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type AmazonMarketConfig,
  type AmazonMarketId,
  MONTHS,
  formatCurrency,
} from "../amazon-fee-calculator/amazon-config";
import { AMAZON_MARKETS } from "../amazon-fee-calculator/markets";
import { FlagIcon } from "../components/country-flags";
import { SectionLabel } from "../components/section-label";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import {
  AMAZON_PRICING_MARKET_IDS,
  evaluateAtListingPrice,
  makeDefaultPricingForm,
  solveListingPrice,
  type AmazonPricingFormState,
  type AmazonPricingSolveResult,
  type AmazonPricingTargetMode,
} from "./pricing-config";
import {
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
  withSeoYear,
} from "@/lib/fee-seo";

const FEEDBACK_ENDPOINT =
  process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "/api/feedback";

export default function AmazonPricingCalculator({
  marketId,
}: {
  marketId: AmazonMarketId;
}) {
  const config = AMAZON_MARKETS[marketId];
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
  });

  const [form, setForm] = useState<AmazonPricingFormState>(() =>
    makeDefaultPricingForm(config),
  );

  const result = useMemo(
    () => solveListingPrice(form, config),
    [form, config],
  );
  const lowerCheck = useMemo(() => {
    if (result.status !== "ok") return null;
    const below = Math.max(0, result.listingPrice - 0.01);
    return evaluateAtListingPrice(below, form, config);
  }, [result, form, config]);

  const fmt = useCallback(
    (value: number) => formatCurrency(value, config),
    [config],
  );
  const hasTrackedToolUsed = useRef(false);
  const hasTrackedResultViewed = useRef(false);

  const trackCalculatorInteraction = useCallback(
    (interactionType: string) => {
      if (!hasTrackedToolUsed.current) {
        trackEvent("ToolUsed", {
          tool_id: "amazon_pricing",
          market: marketId,
          page_type: "calculator",
          interaction_type: interactionType,
        });
        hasTrackedToolUsed.current = true;
      }

      if (!hasTrackedResultViewed.current) {
        trackEvent("ResultViewed", {
          tool_id: "amazon_pricing",
          market: marketId,
          page_type: "calculator",
        });
        hasTrackedResultViewed.current = true;
      }
    },
    [marketId],
  );

  function applyPatch(partial: Partial<AmazonPricingFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function patch(partial: Partial<AmazonPricingFormState>) {
    trackCalculatorInteraction("form_change");
    applyPatch(partial);
  }

  function setNum(key: keyof AmazonPricingFormState, raw: string) {
    const next = Number(raw);
    trackCalculatorInteraction("numeric_input");
    applyPatch({
      [key]: Number.isFinite(next) ? next : 0,
    } as Partial<AmazonPricingFormState>);
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>
          {withSeoYear(
            `Amazon Pricing Calculator \u2013 ${config.name}`,
            seoYear,
          )}
        </h1>
        <p
          className="muted"
          style={{ marginTop: 0, marginBottom: 12 }}
        >
          Find the minimum listing price that hits your profit target after
          Amazon fees, fulfillment, and storage costs.
        </p>
        <p
          className="muted"
          style={{ marginTop: 0, marginBottom: 12, fontSize: "var(--fs-content-meta)" }}
        >
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
        />
        <ResultsPanel
          form={form}
          config={config}
          result={result}
          lowerCheck={lowerCheck}
          fmt={fmt}
        />
      </section>

      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ShareButtons config={config} />
        <FeedbackSection config={config} form={form} result={result} fmt={fmt} />
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 15 }}>
          How the pricing engine works
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li
            className="muted"
            style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}
          >
            Sold Price = Listing Price × (1 − Discount Rate).
          </li>
          <li
            className="muted"
            style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}
          >
            Total Sales Price = Sold Price + Shipping + Gift Wrap (Amazon
            calculates referral fees on this total).
          </li>
          <li
            className="muted"
            style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}
          >
            The solver uses the same fee model as our Amazon fee calculator,
            then binary-searches for the lowest listing price meeting your
            target.
          </li>
        </ul>
      </section>
    </div>
  );
}

function MarketSwitcher({ current }: { current: AmazonMarketId }) {
  const markets = AMAZON_PRICING_MARKET_IDS.map((id) => AMAZON_MARKETS[id]);

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {markets.map((market) => (
        <Link
          key={market.id}
          href={`/amazon-pricing-calculator/${market.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--fs-content-meta)",
            fontWeight: 600,
            background:
              market.id === current
                ? "var(--color-primary)"
                : "transparent",
            color:
              market.id === current
                ? "#fff"
                : "var(--color-text-secondary)",
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
  );
}

function CalculatorForm({
  form,
  config,
  onPatch,
  onSetNum,
}: {
  form: AmazonPricingFormState;
  config: AmazonMarketConfig;
  onPatch: (value: Partial<AmazonPricingFormState>) => void;
  onSetNum: (key: keyof AmazonPricingFormState, raw: string) => void;
}) {
  const isFba = form.fulfillmentMethod === "fba";
  const sym = config.currency.symbol;
  const u = config.units;

  return (
    <form
      className="card grid"
      style={{ gap: 14 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <SectionLabel>Target</SectionLabel>

      <Field label="Target Type">
        <select
          className="input"
          value={form.targetMode}
          onChange={(e) =>
            onPatch({
              targetMode: e.target.value as AmazonPricingTargetMode,
            })
          }
          style={{ cursor: "pointer" }}
        >
          <option value="profit_amount">Net Profit Amount</option>
          <option value="profit_margin">Profit Margin (%)</option>
        </select>
      </Field>

      <Field
        label={
          form.targetMode === "profit_amount"
            ? `Target Net Profit (${sym})`
            : "Target Profit Margin (%)"
        }
      >
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.targetValue}
          onChange={(e) => onSetNum("targetValue", e.target.value)}
        />
      </Field>

      <SectionLabel>Pricing</SectionLabel>

      <Field label="Discount Rate on Listing Price (%)">
        <input
          className="input"
          type="number"
          min="0"
          max="99.99"
          step="0.01"
          value={form.discountRate}
          onChange={(e) => onSetNum("discountRate", e.target.value)}
        />
      </Field>

      <Field label={`Shipping Charged to Buyer (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.shippingCharged}
          onChange={(e) => onSetNum("shippingCharged", e.target.value)}
        />
      </Field>

      <Field label={`Gift Wrap Charge (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.giftWrapCharge}
          onChange={(e) => onSetNum("giftWrapCharge", e.target.value)}
        />
      </Field>

      <SectionLabel>Costs</SectionLabel>

      <Field label={`Item Cost (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.itemCost}
          onChange={(e) => onSetNum("itemCost", e.target.value)}
        />
      </Field>

      {!isFba && (
        <Field label={`Actual Shipping Cost (${sym})`}>
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={form.actualShippingCost}
            onChange={(e) =>
              onSetNum("actualShippingCost", e.target.value)
            }
          />
        </Field>
      )}

      <Field label={`Other Costs (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.otherCosts}
          onChange={(e) => onSetNum("otherCosts", e.target.value)}
        />
      </Field>

      <SectionLabel>Amazon Settings</SectionLabel>

      <Field label="Seller Type">
        <select
          className="input"
          value={form.sellerType}
          onChange={(e) => onPatch({ sellerType: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.sellerTypes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Category">
        <select
          className="input"
          value={form.category}
          onChange={(e) => onPatch({ category: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Fulfillment Method">
        <select
          className="input"
          value={form.fulfillmentMethod}
          onChange={(e) =>
            onPatch({ fulfillmentMethod: e.target.value })
          }
          style={{ cursor: "pointer" }}
        >
          {config.fulfillmentMethods.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </Field>

      {isFba && (
        <>
          <SectionLabel>FBA Product Info</SectionLabel>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <Field label={`Weight (${u.major})`}>
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                value={form.weightMajor}
                onChange={(e) =>
                  onSetNum("weightMajor", e.target.value)
                }
              />
            </Field>
            <Field label={`Weight (${u.minor})`}>
              <input
                className="input"
                type="number"
                min="0"
                max={u.minorPerMajor - 1}
                step="1"
                value={form.weightMinor}
                onChange={(e) =>
                  onSetNum("weightMinor", e.target.value)
                }
              />
            </Field>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            <Field label={`Length (${u.dimLabel})`}>
              <input
                className="input"
                type="number"
                min="0"
                step="0.1"
                value={form.dimensionLength}
                onChange={(e) =>
                  onSetNum("dimensionLength", e.target.value)
                }
              />
            </Field>
            <Field label={`Width (${u.dimLabel})`}>
              <input
                className="input"
                type="number"
                min="0"
                step="0.1"
                value={form.dimensionWidth}
                onChange={(e) =>
                  onSetNum("dimensionWidth", e.target.value)
                }
              />
            </Field>
            <Field label={`Height (${u.dimLabel})`}>
              <input
                className="input"
                type="number"
                min="0"
                step="0.1"
                value={form.dimensionHeight}
                onChange={(e) =>
                  onSetNum("dimensionHeight", e.target.value)
                }
              />
            </Field>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.isApparel}
              onChange={(e) =>
                onPatch({ isApparel: e.target.checked })
              }
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: "var(--fs-content-body-sm)" }}>
              Apparel item (higher FBA fee)
            </span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.isDangerousGoods}
              onChange={(e) =>
                onPatch({ isDangerousGoods: e.target.checked })
              }
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: "var(--fs-content-body-sm)" }}>
              Dangerous goods (higher FBA fee)
            </span>
          </label>

          <SectionLabel>FBA Storage</SectionLabel>

          <Field label="Storage Duration (months)">
            <input
              className="input"
              type="number"
              min="0"
              max="24"
              step="1"
              value={form.storageMonths}
              onChange={(e) =>
                onSetNum("storageMonths", e.target.value)
              }
            />
          </Field>

          <Field label="Storage Month (for seasonal rate)">
            <select
              className="input"
              value={form.storageMonth}
              onChange={(e) =>
                onPatch({ storageMonth: Number(e.target.value) })
              }
              style={{ cursor: "pointer" }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>
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
  form: AmazonPricingFormState;
  config: AmazonMarketConfig;
  result: AmazonPricingSolveResult;
  lowerCheck: ReturnType<typeof evaluateAtListingPrice> | null;
  fmt: (value: number) => string;
}) {
  const isFba = form.fulfillmentMethod === "fba";
  const wu = config.units.major;

  const targetLabel =
    form.targetMode === "profit_amount"
      ? `Net Profit \u2265 ${fmt(form.targetValue)}`
      : `Profit Margin \u2265 ${form.targetValue.toFixed(2)}%`;

  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>
        Pricing Result
      </h2>

      {result.status !== "ok" || !result.calcResult ? (
        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            borderRadius: "var(--radius-sm)",
            padding: 12,
            color: "#b91c1c",
            fontSize: "var(--fs-content-body-sm)",
            lineHeight: 1.6,
          }}
        >
          {result.message}
        </div>
      ) : (
        <>
          <GroupLabel>Recommended Listing Price</GroupLabel>
          <Row
            label="Listing Price"
            value={fmt(result.listingPrice)}
            bold
            large
            color="#1d4ed8"
          />
          <Row
            label="Expected Sold Price"
            value={fmt(result.soldPrice)}
          />
          {form.shippingCharged > 0 && (
            <Row
              label="+ Shipping"
              value={fmt(form.shippingCharged)}
            />
          )}
          {form.giftWrapCharge > 0 && (
            <Row
              label="+ Gift Wrap"
              value={fmt(form.giftWrapCharge)}
            />
          )}
          <Row
            label="Total Sales Price"
            value={fmt(result.calcResult.totalSalesPrice)}
            bold
          />

          <Divider />

          <GroupLabel>Amazon Fees</GroupLabel>
          <Row
            label="Referral Fee"
            value={fmt(result.calcResult.referralFee)}
          />
          <div
            className="muted"
            style={{
              fontSize: "var(--fs-content-meta)",
              marginTop: -4,
              marginBottom: 6,
              paddingLeft: 4,
            }}
          >
            {result.calcResult.referralFeeDesc}
            {result.calcResult.appliedMinReferralFee &&
              " (min fee applied)"}
          </div>
          {result.calcResult.closingFee > 0 && (
            <Row
              label="Variable Closing Fee"
              value={fmt(result.calcResult.closingFee)}
            />
          )}
          {result.calcResult.perItemFee > 0 && (
            <Row
              label="Per-Item Fee (Individual)"
              value={fmt(result.calcResult.perItemFee)}
            />
          )}
          {isFba && result.calcResult.fbaFulfillmentFee > 0 && (
            <>
              <Row
                label="FBA Fulfillment Fee"
                value={fmt(result.calcResult.fbaFulfillmentFee)}
              />
              <div
                className="muted"
                style={{
                  fontSize: "var(--fs-content-meta)",
                  marginTop: -4,
                  marginBottom: 6,
                  paddingLeft: 4,
                }}
              >
                Size tier: {result.calcResult.sizeTierLabel} · Shipping
                weight:{" "}
                {result.calcResult.shippingWeight.toFixed(2)} {wu}
              </div>
            </>
          )}
          {isFba && result.calcResult.fbaStorageFee > 0 && (
            <>
              <Row
                label="FBA Storage Fee"
                value={fmt(result.calcResult.fbaStorageFee)}
              />
              <div
                className="muted"
                style={{
                  fontSize: "var(--fs-content-meta)",
                  marginTop: -4,
                  marginBottom: 6,
                  paddingLeft: 4,
                }}
              >
                {result.calcResult.cubicVolume.toFixed(3)}{" "}
                {config.units.dimLabel === "in" ? "cu ft" : "m\u00B3"}{" "}
                × {form.storageMonths} month
                {form.storageMonths !== 1 ? "s" : ""}
              </div>
            </>
          )}
          <Row
            label="Total Amazon Fees"
            value={fmt(result.calcResult.totalFees)}
            bold
            color="#dc2626"
          />

          <Divider />

          <GroupLabel>Profit Snapshot</GroupLabel>
          <Row
            label="Net Profit"
            value={fmt(result.calcResult.netProfit)}
            bold
            color={
              result.calcResult.netProfit >= 0 ? "#16a34a" : "#dc2626"
            }
          />
          <Row
            label="Profit Margin"
            value={`${result.calcResult.margin.toFixed(2)}%`}
            bold
            color={
              result.calcResult.margin >= 0 ? "#16a34a" : "#dc2626"
            }
          />

          <Divider />

          <GroupLabel>Target Rule</GroupLabel>
          <div
            className="muted"
            style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}
          >
            <div>{targetLabel}</div>
            <div>
              Sold Price = Listing Price × (1 − Discount Rate)
            </div>
            {lowerCheck ? (
              <div>
                At {fmt(Math.max(0, result.listingPrice - 0.01))},
                target reached:{" "}
                {lowerCheck.targetReached ? "Yes" : "No"}
              </div>
            ) : null}
            <div>Solver iterations: {result.iterations}</div>
          </div>
        </>
      )}
    </aside>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <div style={{ marginBottom: 6, fontSize: "var(--fs-form-label)" }}>{label}</div>
      {children}
    </label>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
        color: "var(--color-text-secondary)",
      }}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  color,
  large,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
  large?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 6,
        marginBottom: 2,
        fontSize: large ? 16 : 15,
      }}
    >
      <span
        className={bold ? undefined : "muted"}
        style={bold ? { fontWeight: 600 } : undefined}
      >
        {label}
      </span>
      <span style={{ fontWeight: bold ? 700 : 500, color }}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-border)",
        margin: "6px 0 10px",
      }}
    />
  );
}

function ShareButtons({ config }: { config: AmazonMarketConfig }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const text = encodeURIComponent(
    `Amazon Pricing Calculator \u2013 ${config.name} | ${BRAND.suiteDisplay}`,
  );
  const url = encodeURIComponent(shareUrl);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    trackEvent("CtaClicked", {
      tool_id: "amazon_pricing",
      market: config.id,
      page_type: "calculator",
      cta_id: "share_copy_link",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div
        style={{
          fontSize: "var(--fs-content-body-sm)",
          fontWeight: 600,
          marginBottom: 8,
          color: "var(--color-text-secondary)",
        }}
      >
        Share this calculator
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "amazon_pricing",
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
              tool_id: "amazon_pricing",
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
              tool_id: "amazon_pricing",
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
        <button
          onClick={copyLink}
          className="btn btn-secondary"
          style={{ fontSize: "var(--fs-content-body-sm)", gap: 6 }}
        >
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
  config: AmazonMarketConfig;
  form: AmazonPricingFormState;
  result: AmazonPricingSolveResult;
  fmt: (v: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  async function handleSubmit() {
    trackEvent("CtaClicked", {
      tool_id: "amazon_pricing",
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
          source: "amazon-pricing-calculator",
          message,
          context: {
            Market: `${config.name} (${config.domain})`,
            "Seller Type": form.sellerType,
            Category: form.category,
            Fulfillment: form.fulfillmentMethod.toUpperCase(),
            "Target Mode": form.targetMode,
            "Target Value":
              form.targetMode === "profit_amount"
                ? fmt(form.targetValue)
                : `${form.targetValue}%`,
            "Discount Rate": `${form.discountRate}%`,
            "Listing Price":
              result.status === "ok"
                ? fmt(result.listingPrice)
                : result.status,
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
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: 12,
        }}
      >
        <button
          onClick={() => {
            trackEvent("CtaClicked", {
              tool_id: "amazon_pricing",
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
            fontSize: "var(--fs-content-body-sm)",
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
        <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 18 }}>
          Report Calculation Issue
        </h3>
        <p
          className="muted"
          style={{ marginTop: 0, marginBottom: 16, fontSize: "var(--fs-content-body-sm)" }}
        >
          Describe the issue you found. Your current calculation
          parameters will be included automatically.
        </p>

        {status === "success" ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#16a34a",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Report submitted successfully. Thank you for your feedback!
          </div>
        ) : (
          <>
            {status === "error" && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: "var(--fs-content-body-sm)",
                  marginBottom: 12,
                }}
              >
                Failed to submit. Please try again later.
              </div>
            )}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. The recommended listing price seems too high for the Home & Kitchen category..."
              style={{
                width: "100%",
                minHeight: 100,
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: 10,
                fontSize: "var(--fs-form-control)",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                className="btn btn-secondary"
              >
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
