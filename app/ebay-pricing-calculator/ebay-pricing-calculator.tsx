"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlagIcon } from "../components/country-flags";
import { trackEvent } from "@/lib/analytics";
import {
  formatCurrency,
  type Cat,
  type MarketConfig,
  type MarketId,
  MARKET_LIST,
  MARKETS,
} from "../ebay-fee-calculator/market-config";
import {
  evaluateAtListingPrice,
  getDefaultSubCategory,
  makeDefaultPricingForm,
  solveListingPrice,
  type PricingFormState,
  type PricingSolveResult,
  type PricingTargetMode,
} from "./pricing-config";
import {
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
  withSeoYear,
} from "@/lib/fee-seo";

export default function EbayPricingCalculator({ marketId }: { marketId: MarketId }) {
  const config = MARKETS[marketId];
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  const [form, setForm] = useState<PricingFormState>(() => makeDefaultPricingForm(config));
  const selectedCat = config.categories.find((c: Cat) => c.value === form.category);
  const subs = selectedCat?.subs;

  const result = useMemo(() => solveListingPrice(form, config), [form, config]);
  const lowerCheck = useMemo(() => {
    if (result.status !== "ok") return null;
    const below = Math.max(0, result.listingPrice - 0.01);
    return evaluateAtListingPrice(below, form, config);
  }, [result, form, config]);

  const fmt = useCallback((value: number) => formatCurrency(value, config), [config]);
  const hasTrackedToolUsed = useRef(false);
  const hasTrackedResultViewed = useRef(false);

  const trackCalculatorInteraction = useCallback((interactionType: string) => {
    if (!hasTrackedToolUsed.current) {
      trackEvent("ToolUsed", {
        tool_id: "ebay_pricing",
        market: marketId,
        page_type: "calculator",
        interaction_type: interactionType,
      });
      hasTrackedToolUsed.current = true;
    }

    if (!hasTrackedResultViewed.current) {
      trackEvent("ResultViewed", {
        tool_id: "ebay_pricing",
        market: marketId,
        page_type: "calculator",
      });
      hasTrackedResultViewed.current = true;
    }
  }, [marketId]);

  function applyPatch(partial: Partial<PricingFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function patch(partial: Partial<PricingFormState>) {
    trackCalculatorInteraction("form_change");
    applyPatch(partial);
  }

  function setNum(key: keyof PricingFormState, raw: string) {
    const next = Number(raw);
    trackCalculatorInteraction("numeric_input");
    applyPatch({ [key]: Number.isFinite(next) ? next : 0 } as Partial<PricingFormState>);
  }

  function onCategoryChange(nextCategory: string) {
    const category = config.categories.find((item) => item.value === nextCategory);
    trackCalculatorInteraction("category_change");
    applyPatch({
      category: nextCategory,
      subCategory: getDefaultSubCategory(category),
    });
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>
          {withSeoYear(`eBay Pricing Calculator - ${config.name}`, seoYear)}
        </h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          Back-solve the minimum listing price needed to hit your target profit.
        </p>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12, fontSize: 12 }}>
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
          subs={subs}
          onPatch={patch}
          onSetNum={setNum}
          onCategoryChange={onCategoryChange}
        />
        <ResultsPanel
          form={form}
          config={config}
          result={result}
          lowerCheck={lowerCheck}
          fmt={fmt}
        />
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 15 }}>How the pricing engine works</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li className="muted" style={{ fontSize: 13, lineHeight: 1.65 }}>
            Sold Price = Listing Price × (1 - Discount Rate).
          </li>
          <li className="muted" style={{ fontSize: 13, lineHeight: 1.65 }}>
            We reuse the same eBay fee model as the fee calculator for this market.
          </li>
          <li className="muted" style={{ fontSize: 13, lineHeight: 1.65 }}>
            The solver uses upper-bound expansion + binary search, then rounds up to the nearest cent.
          </li>
        </ul>
      </section>
    </div>
  );
}

function MarketSwitcher({ current }: { current: MarketId }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {MARKET_LIST.map((market) => (
        <Link
          key={market.id}
          href={`/ebay-pricing-calculator/${market.id}`}
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
  );
}

function CalculatorForm({
  form,
  config,
  subs,
  onPatch,
  onSetNum,
  onCategoryChange,
}: {
  form: PricingFormState;
  config: MarketConfig;
  subs: Cat["subs"];
  onPatch: (value: Partial<PricingFormState>) => void;
  onSetNum: (key: keyof PricingFormState, raw: string) => void;
  onCategoryChange: (value: string) => void;
}) {
  const sym = config.currency.symbol;

  return (
    <form className="card grid" style={{ gap: 14 }} onSubmit={(e) => e.preventDefault()}>
      <SectionLabel>Target</SectionLabel>

      <Field label="Target Type">
        <select
          className="input"
          value={form.targetMode}
          onChange={(e) => onPatch({ targetMode: e.target.value as PricingTargetMode })}
          style={{ cursor: "pointer" }}
        >
          <option value="profit_amount">Net Profit Amount</option>
          <option value="profit_margin">Profit Margin (%)</option>
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

      <Field label={`Actual Shipping Cost (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.actualShippingCost}
          onChange={(e) => onSetNum("actualShippingCost", e.target.value)}
        />
      </Field>

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

      <SectionLabel>eBay Settings</SectionLabel>

      <Field label={config.storeLabel}>
        <select
          className="input"
          value={form.storeType}
          onChange={(e) => onPatch({ storeType: e.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.storeTypes.map((store) => (
            <option key={store.value} value={store.value}>
              {store.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Category">
        <select
          className="input"
          value={form.category}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          {config.categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </Field>

      {subs && (
        <Field label="Sub Category">
          <select
            className="input"
            value={form.subCategory}
            onChange={(e) => onPatch({ subCategory: e.target.value })}
            style={{ cursor: "pointer" }}
          >
            {subs.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </Field>
      )}

      <SectionLabel>Advanced</SectionLabel>

      <Field label={config.taxLabel}>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.taxRate}
          onChange={(e) => onSetNum("taxRate", e.target.value)}
        />
      </Field>

      <Field label="Promoted Listing Ad Rate (%)">
        <input
          className="input"
          type="number"
          min="0"
          max="20"
          step="0.1"
          value={form.adRate}
          onChange={(e) => onSetNum("adRate", e.target.value)}
        />
      </Field>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.isTopRated}
          onChange={(e) => onPatch({ isTopRated: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }}
        />
        <span style={{ fontSize: 14 }}>{config.topRatedLabel}</span>
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.isInternational}
          onChange={(e) => onPatch({ isInternational: e.target.checked })}
          style={{ width: 16, height: 16, cursor: "pointer" }}
        />
        <span style={{ fontSize: 14 }}>{config.internationalLabel}</span>
      </label>

      {form.isInternational &&
      config.internationalDestinations &&
      config.internationalFeeOverride?.(form.storeType) == null ? (
        <Field label="Destination">
          <select
            className="input"
            value={form.internationalDestination}
            onChange={(e) => onPatch({ internationalDestination: e.target.value })}
            style={{ cursor: "pointer" }}
          >
            {config.internationalDestinations.map((dest) => (
              <option key={dest.value} value={dest.value}>
                {dest.label}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
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
  form: PricingFormState;
  config: MarketConfig;
  result: PricingSolveResult;
  lowerCheck: ReturnType<typeof evaluateAtListingPrice> | null;
  fmt: (value: number) => string;
}) {
  const targetLabel =
    form.targetMode === "profit_amount"
      ? `Net Profit >= ${fmt(form.targetValue)}`
      : `Profit Margin >= ${form.targetValue.toFixed(2)}%`;

  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Pricing Result</h2>

      {result.status !== "ok" || !result.calcResult ? (
        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            borderRadius: "var(--radius-sm)",
            padding: 12,
            color: "#b91c1c",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {result.message}
        </div>
      ) : (
        <>
          <GroupLabel>Recommended Listing Price</GroupLabel>
          <Row label="Listing Price" value={fmt(result.listingPrice)} bold large color="#1d4ed8" />
          <Row label="Expected Sold Price" value={fmt(result.soldPrice)} />
          <Row label="Shipping Charged" value={fmt(form.shippingCharged)} />
          {form.taxRate > 0 ? (
            <Row
              label={config.taxLabel.replace(" (%)", "")}
              value={fmt(result.calcResult.tax)}
            />
          ) : null}
          <Row label="Buyer Payment (incl. tax)" value={fmt(result.calcResult.totalWithTax)} bold />

          <Divider />

          <GroupLabel>Profit Snapshot</GroupLabel>
          <Row label="Total eBay Fees" value={fmt(result.calcResult.totalFees)} color="#dc2626" />
          <Row
            label="Net Profit"
            value={fmt(result.calcResult.netProfit)}
            bold
            color={result.calcResult.netProfit >= 0 ? "#16a34a" : "#dc2626"}
          />
          <Row
            label="Profit Margin"
            value={`${result.calcResult.margin.toFixed(2)}%`}
            bold
            color={result.calcResult.margin >= 0 ? "#16a34a" : "#dc2626"}
          />

          <Divider />

          <GroupLabel>Target Rule</GroupLabel>
          <div className="muted" style={{ fontSize: 13, lineHeight: 1.65 }}>
            <div>{targetLabel}</div>
            <div>Sold Price = Listing Price × (1 - Discount Rate)</div>
            {lowerCheck ? (
              <div>
                At {fmt(Math.max(0, result.listingPrice - 0.01))}, target reached: {lowerCheck.targetReached ? "Yes" : "No"}
              </div>
            ) : null}
            <div>Solver iterations: {result.iterations}</div>
          </div>
        </>
      )}
    </aside>
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
        fontSize: large ? 16 : 14,
      }}
    >
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
