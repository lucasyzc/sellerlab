"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type WalmartCalcResult,
  type WalmartFormState,
  type WalmartMarketConfig,
  type WalmartMarketId,
  calculate,
  formatCurrency,
  makeDefaultForm,
} from "./walmart-config";
import { WALMART_MARKET_LIST, WALMART_MARKETS } from "./markets";
import { FlagIcon } from "../components/country-flags";
import {
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
  withSeoYear,
} from "@/lib/fee-seo";

export default function WalmartFeeCalculator({ marketId }: { marketId: WalmartMarketId }) {
  const config = WALMART_MARKETS[marketId];
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });
  const [form, setForm] = useState<WalmartFormState>(() => makeDefaultForm(config));

  useEffect(() => {
    setForm(makeDefaultForm(config));
  }, [config]);

  const res = useMemo(() => calculate(form, config), [form, config]);
  const fmt = (value: number) => formatCurrency(value, config);

  function patch(partial: Partial<WalmartFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function setNum(key: keyof WalmartFormState, raw: string) {
    const value = Number(raw);
    patch({ [key]: Number.isFinite(value) ? value : 0 } as Partial<WalmartFormState>);
  }

  const isWfs = form.fulfillmentMethod === "wfs";
  const isWfsUnsupported = isWfs && res.wfsTierLabel === "Outside Public WFS Card";

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{withSeoYear(config.seo.h1, seoYear)}</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
          {config.seo.subtitle}
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
          onPatch={patch}
          onSetNum={setNum}
        />
        <ResultsPanel form={form} config={config} res={res} fmt={fmt} />
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
            {doc.asOf ? ` · as of ${doc.asOf}` : ""}
          </a>
        ))}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>Model Notes</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {config.notes.map((note, i) => (
            <li key={i} className="muted" style={{ fontSize: 13, lineHeight: 1.65, marginBottom: 4 }}>
              {note}
            </li>
          ))}
        </ul>
      </section>

      {isWfsUnsupported && (
        <section className="card" style={{ borderColor: "#fecaca", background: "#fff7f7" }}>
          <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15, color: "#b91c1c" }}>
            WFS Range Warning
          </h3>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#7f1d1d" }}>
            The current dimensions/weight appear outside the public WFS rate card ranges. The calculator keeps WFS fee at {fmt(0)} in this case.
            Please verify custom WFS pricing directly in Walmart Seller Center.
          </p>
        </section>
      )}
    </div>
  );
}

function MarketSwitcher({ current }: { current: WalmartMarketId }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {WALMART_MARKET_LIST.map((market) => (
        <Link
          key={market.id}
          href={`/walmart-fee-calculator/${market.id}`}
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
  form: WalmartFormState;
  config: WalmartMarketConfig;
  onPatch: (partial: Partial<WalmartFormState>) => void;
  onSetNum: (key: keyof WalmartFormState, raw: string) => void;
}) {
  const sym = config.currency.symbol;
  const currencyStep = config.currency.decimals === 0 ? "1" : "0.01";
  const isWfs = form.fulfillmentMethod === "wfs";
  const isManualWfs = config.wfs.mode === "manual";
  const showUsSurchargeFields = config.wfs.mode === "us_official";
  const showStorageSeason = config.wfs.mode === "us_official" || config.wfs.mode === "ca_official";
  const weightFieldLabel = config.wfs.mode === "cl_official"
    ? `Chargeable Weight (${config.units.weightLabel})`
    : `Unit Weight (${config.units.weightLabel})`;

  return (
    <form className="card grid" style={{ gap: 14 }} onSubmit={(event) => event.preventDefault()}>
      <SectionLabel>Sale Setup</SectionLabel>

      <Field label="Product Category">
        <select
          className="input"
          value={form.category}
          onChange={(event) => onPatch({ category: event.target.value })}
          style={{ cursor: "pointer" }}
        >
          {config.categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </Field>

      {config.premiumReferralRules && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.usePremiumReferralRate}
            onChange={(event) => onPatch({ usePremiumReferralRate: event.target.checked })}
            style={{ width: 16, height: 16, cursor: "pointer" }}
          />
          <span style={{ fontSize: 14 }}>{config.premiumReferralLabel ?? "Use premium referral mode"}</span>
        </label>
      )}

      <Field label="Fulfillment Method">
        <select
          className="input"
          value={form.fulfillmentMethod}
          onChange={(event) => onPatch({ fulfillmentMethod: event.target.value as WalmartFormState["fulfillmentMethod"] })}
          style={{ cursor: "pointer" }}
        >
          <option value="wfs">WFS (Walmart Fulfillment Services)</option>
          <option value="seller">Seller Fulfilled</option>
        </select>
      </Field>

      <SectionLabel>Revenue Inputs</SectionLabel>

      <Field label={`Product Selling Price (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step={currencyStep}
          value={form.soldPrice}
          onChange={(event) => onSetNum("soldPrice", event.target.value)}
        />
      </Field>

      <Field label={`Shipping Charged to Buyer (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step={currencyStep}
          value={form.shippingCharged}
          onChange={(event) => onSetNum("shippingCharged", event.target.value)}
        />
      </Field>

      <SectionLabel>Cost Inputs</SectionLabel>

      <Field label={`Product Cost (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step={currencyStep}
          value={form.itemCost}
          onChange={(event) => onSetNum("itemCost", event.target.value)}
        />
      </Field>

      {!isWfs && (
        <Field label={`Seller Shipping Cost (${sym})`}>
          <input
            className="input"
            type="number"
            min="0"
            step={currencyStep}
            value={form.shippingCost}
            onChange={(event) => onSetNum("shippingCost", event.target.value)}
          />
        </Field>
      )}

      <Field label={`Other Costs (${sym})`}>
        <input
          className="input"
          type="number"
          min="0"
          step={currencyStep}
          value={form.otherCosts}
          onChange={(event) => onSetNum("otherCosts", event.target.value)}
        />
      </Field>

      <Field label="External Payment Processing Fee (%)">
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={form.paymentProcessingRate}
          onChange={(event) => onSetNum("paymentProcessingRate", event.target.value)}
        />
      </Field>

      <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
        {config.summary.paymentSummary}
      </p>

      {isWfs && (
        <>
          <SectionLabel>{config.wfs.label}</SectionLabel>

          <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
            {config.wfs.helpText}
          </p>

          {isManualWfs ? (
            <>
              <Field label={`Manual WFS Fulfillment Fee (${sym})`}>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step={currencyStep}
                  value={form.manualWfsFulfillmentFee}
                  onChange={(event) => onSetNum("manualWfsFulfillmentFee", event.target.value)}
                />
              </Field>

              <Field label={`Manual WFS Shipping Recovery Fee (${sym})`}>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step={currencyStep}
                  value={form.manualWfsShippingRecoveryFee}
                  onChange={(event) => onSetNum("manualWfsShippingRecoveryFee", event.target.value)}
                />
              </Field>

              <Field label={`Manual WFS Storage Fee (${sym})`}>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step={currencyStep}
                  value={form.manualWfsStorageFee}
                  onChange={(event) => onSetNum("manualWfsStorageFee", event.target.value)}
                />
              </Field>
            </>
          ) : (
            <>
              <Field label={weightFieldLabel}>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitWeight}
                  onChange={(event) => onSetNum("unitWeight", event.target.value)}
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <Field label={`Length (${config.units.dimensionLabel})`}>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.dimensionLength}
                    onChange={(event) => onSetNum("dimensionLength", event.target.value)}
                  />
                </Field>
                <Field label={`Width (${config.units.dimensionLabel})`}>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.dimensionWidth}
                    onChange={(event) => onSetNum("dimensionWidth", event.target.value)}
                  />
                </Field>
                <Field label={`Height (${config.units.dimensionLabel})`}>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.dimensionHeight}
                    onChange={(event) => onSetNum("dimensionHeight", event.target.value)}
                  />
                </Field>
              </div>

              {showUsSurchargeFields && (
                <>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.isApparel}
                      onChange={(event) => onPatch({ isApparel: event.target.checked })}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14 }}>Apparel surcharge (+{sym}0.50 for standard WFS)</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.isHazmat}
                      onChange={(event) => onPatch({ isHazmat: event.target.checked })}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14 }}>Hazmat surcharge (+{sym}0.75 for standard WFS)</span>
                  </label>
                </>
              )}

              <SectionLabel>WFS Storage (Optional)</SectionLabel>

              <Field label="Storage Duration (months)">
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  value={form.storageMonths}
                  onChange={(event) => onSetNum("storageMonths", event.target.value)}
                />
              </Field>

              {showStorageSeason && (
                <Field label="Storage Season">
                  <select
                    className="input"
                    value={form.storageSeason}
                    onChange={(event) => onPatch({ storageSeason: event.target.value as WalmartFormState["storageSeason"] })}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="jan_sep">January to September</option>
                    <option value="oct_dec">October to December</option>
                  </select>
                </Field>
              )}
            </>
          )}
        </>
      )}
    </form>
  );
}

function ResultsPanel({
  form,
  config,
  res,
  fmt,
}: {
  form: WalmartFormState;
  config: WalmartMarketConfig;
  res: WalmartCalcResult;
  fmt: (value: number) => string;
}) {
  const isWfs = form.fulfillmentMethod === "wfs";
  const showWeightBreakdown = isWfs && config.wfs.mode !== "manual";

  const weightParts = [
    `${res.wfsTierLabel}`,
    `chargeable ${res.chargeableWeight.toFixed(2)} ${config.units.weightLabel}`,
    `shipping ${res.shippingWeight.toFixed(2)} ${config.units.weightLabel}`,
  ];

  if (res.dimensionalWeight > 0) {
    weightParts.push(`dimensional ${res.dimensionalWeight.toFixed(2)} ${config.units.weightLabel}`);
  }

  return (
    <aside className="card" style={{ position: "sticky", top: 20 }}>
      <h2 style={{ marginTop: 0, fontSize: 20, marginBottom: 16 }}>Calculation Results</h2>

      <GroupLabel>Revenue</GroupLabel>
      <Row label="Product Price" value={fmt(form.soldPrice)} />
      {form.shippingCharged > 0 && <Row label="+ Shipping Charged" value={fmt(form.shippingCharged)} />}
      <Row label="Total Sales Price" value={fmt(res.totalSalesPrice)} bold />

      <Divider />

      <GroupLabel>Marketplace Fees</GroupLabel>
      <Row label="Referral Fee" value={fmt(res.referralFee)} />
      <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
        Rule applied: {res.referralRuleDesc} ({res.referralRateModeLabel})
      </div>

      {isWfs && (
        <>
          <Row label="WFS Fulfillment Fee" value={fmt(res.wfsFulfillmentFee)} />
          {res.wfsShippingRecoveryFee > 0 && <Row label="WFS Shipping Recovery Fee" value={fmt(res.wfsShippingRecoveryFee)} />}
          {res.wfsStorageFee > 0 && <Row label="WFS Storage Fee" value={fmt(res.wfsStorageFee)} />}
          <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6, paddingLeft: 4 }}>
            {showWeightBreakdown ? weightParts.join(" · ") : res.wfsTierLabel} · {res.wfsDetail}
          </div>
        </>
      )}

      {res.paymentProcessingFee > 0 && (
        <Row label="Payment Processing Fee" value={fmt(res.paymentProcessingFee)} />
      )}
      <Row label="Total Fees" value={fmt(res.totalFees)} bold color="#dc2626" />

      <Divider />

      <GroupLabel>Costs & Profit</GroupLabel>
      <Row label="Revenue" value={fmt(res.revenue)} />
      <Row label="− Product Cost" value={fmt(form.itemCost)} />
      {!isWfs && <Row label="− Seller Shipping Cost" value={fmt(form.shippingCost)} />}
      {form.otherCosts > 0 && <Row label="− Other Costs" value={fmt(form.otherCosts)} />}
      <Row label="− Platform Fees" value={fmt(res.totalFees)} />

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

      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          marginTop: 12,
          paddingTop: 10,
          fontSize: 12,
          color: "var(--color-text-tertiary)",
          lineHeight: 1.6,
        }}
      >
        Profit formula: Revenue - Platform Fees - Product Cost - Seller Shipping (if self-fulfilled) - Other Costs.
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <div style={{ marginBottom: 6, fontSize: 14 }}>{label}</div>
      {children}
    </label>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
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

function GroupLabel({ children }: { children: ReactNode }) {
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
