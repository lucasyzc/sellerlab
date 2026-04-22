import type { CSSProperties, ReactNode } from "react";
import { FlagIcon } from "@/app/components/country-flags";
import { PlatformLogo } from "@/app/components/platform-logos";
import type { BlogCategory, BlogPlatform } from "@/lib/blog";
import { formatBlogCategoryLabel, formatBlogPlatformLabel } from "@/lib/blog-ui";

type BlogCoverProps = {
  slug: string;
  category: BlogCategory;
  platform: BlogPlatform;
  featured?: boolean;
  evergreen?: boolean;
  title: string;
};

type CoverPalette = {
  bg: string;
  surface: string;
  ink: string;
  line: string;
  accent: string;
  accentSoft: string;
};

const PLATFORM_PALETTES: Record<BlogPlatform, CoverPalette> = {
  amazon: {
    bg: "#fff6e7",
    surface: "rgba(255, 255, 255, 0.92)",
    ink: "#17355f",
    line: "#ff9900",
    accent: "#264f88",
    accentSoft: "#ffe1aa",
  },
  ebay: {
    bg: "#f8f7ff",
    surface: "rgba(255, 255, 255, 0.93)",
    ink: "#19335f",
    line: "#2563eb",
    accent: "#e53238",
    accentSoft: "#dce8ff",
  },
  "tiktok-shop": {
    bg: "#effbf9",
    surface: "rgba(255, 255, 255, 0.92)",
    ink: "#101828",
    line: "#0f766e",
    accent: "#f43f5e",
    accentSoft: "#c9f7f1",
  },
  shopify: {
    bg: "#effaf2",
    surface: "rgba(255, 255, 255, 0.92)",
    ink: "#163428",
    line: "#2f855a",
    accent: "#245740",
    accentSoft: "#ccefd4",
  },
  walmart: {
    bg: "#eef7ff",
    surface: "rgba(255, 255, 255, 0.92)",
    ink: "#173a63",
    line: "#0071ce",
    accent: "#ffc220",
    accentSoft: "#d8ebff",
  },
  general: {
    bg: "#f7f9fc",
    surface: "rgba(255, 255, 255, 0.92)",
    ink: "#0f172a",
    line: "#475569",
    accent: "#0ea5e9",
    accentSoft: "#e2eef9",
  },
};

function coverStyle(palette: CoverPalette): CSSProperties {
  return {
    "--blog-cover-bg": palette.bg,
    "--blog-cover-surface": palette.surface,
    "--blog-cover-ink": palette.ink,
    "--blog-cover-line": palette.line,
    "--blog-cover-accent": palette.accent,
    "--blog-cover-accent-soft": palette.accentSoft,
  } as CSSProperties;
}

function CoverChip({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "accent" | "soft" }) {
  return <span className={`blog-cover-chip blog-cover-chip-${tone}`}>{children}</span>;
}

function CoverFlagRow({ codes }: { codes: string[] }) {
  return (
    <div className="blog-cover-flag-row">
      {codes.map((code) => (
        <span key={code} className="blog-cover-flag-pill">
          <FlagIcon code={code} size={18} />
          <span>{code}</span>
        </span>
      ))}
    </div>
  );
}

function CoverMetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="blog-cover-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TikTokMultiMarketScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId="tiktok" size={44} />
          <div>
            <strong>TikTok Shop</strong>
            <span>Market fee comparison</span>
          </div>
        </div>
        <CoverFlagRow codes={["US", "UK", "VN", "TH"]} />
      </div>

      <div className="blog-cover-market-grid">
        <div className="blog-cover-market-card">
          <FlagIcon code="US" size={26} />
          <span>US</span>
        </div>
        <div className="blog-cover-market-card">
          <FlagIcon code="UK" size={26} />
          <span>UK</span>
        </div>
        <div className="blog-cover-market-card">
          <FlagIcon code="VN" size={26} />
          <span>VN</span>
        </div>
        <div className="blog-cover-market-card">
          <FlagIcon code="TH" size={26} />
          <span>TH</span>
        </div>
      </div>

      <div className="blog-cover-tag-cluster">
        <CoverChip tone="accent">Commission</CoverChip>
        <CoverChip tone="soft">Tax</CoverChip>
        <CoverChip tone="light">Fulfillment</CoverChip>
        <CoverChip tone="light">Margin</CoverChip>
      </div>
    </div>
  );
}

function AmazonBreakEvenScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId="amazon" size={48} />
          <div>
            <strong>Break-even stack</strong>
            <span>Three pricing thresholds</span>
          </div>
        </div>
      </div>

      <div className="blog-cover-price-stack">
        <div className="blog-cover-price-tag">
          <span>Floor</span>
          <strong>Protect margin</strong>
        </div>
        <div className="blog-cover-price-tag is-accent">
          <span>Target</span>
          <strong>Run default price</strong>
        </div>
        <div className="blog-cover-price-tag">
          <span>Promo</span>
          <strong>Discount safely</strong>
        </div>
      </div>

      <div className="blog-cover-tag-cluster">
        <CoverChip tone="accent">COGS</CoverChip>
        <CoverChip tone="soft">FBA Fees</CoverChip>
        <CoverChip tone="light">Ads</CoverChip>
      </div>
    </div>
  );
}

function AmazonFbaVsFbmScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-split">
      <div className="blog-cover-compare-card">
        <span className="blog-cover-compare-label">FBA</span>
        <div className="blog-cover-box-icon" />
        <small>Prime reach</small>
      </div>
      <div className="blog-cover-versus">VS</div>
      <div className="blog-cover-compare-card">
        <span className="blog-cover-compare-label">FBM</span>
        <div className="blog-cover-truck">
          <span />
          <span />
        </div>
        <small>Control cost</small>
      </div>
    </div>
  );
}

function AmazonFeeChangeScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId="amazon" size={48} />
          <div>
            <strong>Fee change briefing</strong>
            <span>Q2 2026 review</span>
          </div>
        </div>
        <CoverChip tone="accent">Q2 2026</CoverChip>
      </div>

      <div className="blog-cover-ledger">
        <CoverMetricCard label="Referral" value="Review" />
        <CoverMetricCard label="FBA" value="Update" />
        <CoverMetricCard label="Ads" value="Re-baseline" />
      </div>
    </div>
  );
}

function EbayFeeChangeScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId="ebay" size={54} />
          <div>
            <strong>Fee categories</strong>
            <span>Rate changes by vertical</span>
          </div>
        </div>
      </div>

      <div className="blog-cover-ledger">
        <CoverMetricCard label="Category mix" value="Recheck" />
        <CoverMetricCard label="Ad safe rate" value="Reset" />
        <CoverMetricCard label="Net margin" value="Protect" />
      </div>
    </div>
  );
}

function EbayPromotedScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId="ebay" size={54} />
          <div>
            <strong>Promoted Listings</strong>
            <span>Contribution margin cap</span>
          </div>
        </div>
      </div>

      <div className="blog-cover-ad-meter">
        <div className="blog-cover-ad-ring">
          <span>Ad cap</span>
        </div>
        <div className="blog-cover-tag-cluster">
          <CoverChip tone="accent">ROAS</CoverChip>
          <CoverChip tone="soft">Contribution</CoverChip>
          <CoverChip tone="light">Bid guardrail</CoverChip>
        </div>
      </div>
    </div>
  );
}

function EbayStoreSubscriptionScene() {
  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId="ebay" size={54} />
          <div>
            <strong>Store plan break-even</strong>
            <span>Upgrade only when math works</span>
          </div>
        </div>
      </div>

      <div className="blog-cover-plan-stack">
        <div className="blog-cover-plan-card">
          <span>Starter</span>
          <strong>Baseline</strong>
        </div>
        <div className="blog-cover-plan-card is-active">
          <span>Basic</span>
          <strong>Break-even</strong>
        </div>
        <div className="blog-cover-plan-card">
          <span>Premium</span>
          <strong>Scale</strong>
        </div>
      </div>
    </div>
  );
}

function GenericScene({
  platform,
  categoryLabel,
}: {
  platform: BlogPlatform;
  categoryLabel: string;
}) {
  const platformId = platform === "tiktok-shop" ? "tiktok" : platform;

  return (
    <div className="blog-cover-scene blog-cover-scene-grid">
      <div className="blog-cover-brand-panel">
        <div className="blog-cover-brand-lockup">
          <PlatformLogo platformId={platformId} size={46} />
          <div>
            <strong>{formatBlogPlatformLabel(platform)}</strong>
            <span>{categoryLabel}</span>
          </div>
        </div>
      </div>
      <div className="blog-cover-tag-cluster">
        <CoverChip tone="accent">{categoryLabel}</CoverChip>
        <CoverChip tone="soft">{formatBlogPlatformLabel(platform)}</CoverChip>
      </div>
    </div>
  );
}

function renderScene(slug: string, platform: BlogPlatform, categoryLabel: string) {
  switch (slug) {
    case "tiktok-shop-fees-by-market-2026":
      return <TikTokMultiMarketScene />;
    case "amazon-break-even-price-playbook-2026":
      return <AmazonBreakEvenScene />;
    case "amazon-fba-vs-fbm-margin-update-2026":
      return <AmazonFbaVsFbmScene />;
    case "amazon-fee-changes-2026-q2":
      return <AmazonFeeChangeScene />;
    case "ebay-fee-changes-2026-q2":
      return <EbayFeeChangeScene />;
    case "ebay-promoted-listing-margin-update-2026":
      return <EbayPromotedScene />;
    case "ebay-store-subscription-break-even-2026":
      return <EbayStoreSubscriptionScene />;
    default:
      return <GenericScene platform={platform} categoryLabel={categoryLabel} />;
  }
}

export function BlogCover({
  slug,
  category,
  platform,
  featured = false,
  evergreen = false,
  title,
}: BlogCoverProps) {
  const palette = PLATFORM_PALETTES[platform];
  const categoryLabel = formatBlogCategoryLabel(category);
  const platformLabel = formatBlogPlatformLabel(platform);

  return (
    <div
      className={`blog-cover ${featured ? "blog-cover-featured" : ""}`}
      style={coverStyle(palette)}
      aria-label={`${platformLabel} ${categoryLabel}: ${title}`}
    >
      <div className="blog-cover-chrome">
        <span className="blog-cover-platform">{platformLabel}</span>
        <span className="blog-cover-code">{evergreen ? "Evergreen" : "Update"}</span>
      </div>

      <div className="blog-cover-frame">
        <div className="blog-cover-grid" />
        <div className="blog-cover-glow blog-cover-glow-left" />
        <div className="blog-cover-glow blog-cover-glow-right" />
        {renderScene(slug, platform, categoryLabel)}
      </div>

      <div className="blog-cover-footer">
        <span className="blog-cover-category">{categoryLabel}</span>
        <span className="blog-cover-status">{featured ? "Featured" : evergreen ? "Evergreen" : "Fresh review"}</span>
      </div>
    </div>
  );
}
