"use client";

import Link from "next/link";
import { useState } from "react";
import { PlatformLogo } from "./components/platform-logos";
import { FlagIcon } from "./components/country-flags";
import { BRAND } from "@/lib/brand";

const PLATFORMS = [
  {
    id: "ebay",
    name: "eBay",
    color: "#e53e3e",
    bg: "#fff5f5",
    description: "The world's leading auction and fixed-price marketplace, available in 190+ countries",
    countries: ["US", "UK", "DE", "AU", "FR", "IT", "ES", "CA"],
    toolCount: 1,
  },
  {
    id: "amazon",
    name: "Amazon",
    color: "#FF9900",
    bg: "#fffaf0",
    description: "The world's largest e-commerce platform with FBA/FBM fulfillment across major markets",
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "JP", "CA", "AU"],
    toolCount: 2,
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    color: "#010101",
    bg: "#f5f5f5",
    description: "Fast-growing social commerce platform powered by short videos and livestream shopping",
    countries: ["US", "UK", "ID", "TH", "MY", "VN", "PH"],
    toolCount: 1,
  },
  {
    id: "shopify",
    name: "Shopify",
    color: "#95BF47",
    bg: "#f0fff4",
    description: "The go-to platform for building your own online store with full control over branding and data",
    countries: ["US", "CA", "AU", "SG", "JP", "EU", "UK", "CH"],
    toolCount: 2,
  },
  {
    id: "walmart",
    name: "Walmart",
    color: "#0071CE",
    bg: "#ebf8ff",
    description: "North America's second-largest e-commerce platform, ideal for established sellers to expand",
    countries: ["US", "CA", "MX", "CL"],
    toolCount: 1,
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    color: "#FF4747",
    bg: "#fff5f5",
    description: "Alibaba's global retail marketplace for consumers worldwide with robust logistics",
    countries: ["US", "UK", "DE", "FR", "ES", "RU", "BR"],
    toolCount: 0,
  },
  {
    id: "temu",
    name: "Temu",
    color: "#FB7701",
    bg: "#fffaf0",
    description: "PDD's global marketplace with a fully-managed model for rapid scaling",
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "AU", "CA"],
    toolCount: 0,
  },
  {
    id: "shein",
    name: "SHEIN",
    color: "#000000",
    bg: "#f7f7f7",
    description: "Fast-fashion giant with an agile small-batch model, combining marketplace and DTC channels",
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "AU"],
    toolCount: 0,
  },
];

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", platforms: ["ebay", "amazon", "tiktok", "shopify", "walmart", "aliexpress", "temu", "shein"] },
  { code: "EU", name: "European Union", flag: "🇪🇺", platforms: ["shopify"] },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", platforms: ["ebay", "amazon", "tiktok", "shopify", "aliexpress", "temu", "shein"] },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", platforms: ["shopify"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", platforms: ["ebay", "amazon", "shopify", "aliexpress", "temu", "shein"] },
  { code: "FR", name: "France", flag: "🇫🇷", platforms: ["ebay", "amazon", "shopify", "aliexpress", "temu", "shein"] },
  { code: "IT", name: "Italy", flag: "🇮🇹", platforms: ["ebay", "amazon", "temu", "shein"] },
  { code: "ES", name: "Spain", flag: "🇪🇸", platforms: ["ebay", "amazon", "aliexpress", "temu", "shein"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", platforms: ["ebay", "amazon", "shopify", "temu", "shein"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", platforms: ["ebay", "amazon", "shopify", "walmart", "temu"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", platforms: ["shopify"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", platforms: ["amazon", "shopify"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", platforms: ["walmart"] },
  { code: "CL", name: "Chile", flag: "🇨🇱", platforms: ["walmart"] },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", platforms: ["tiktok"] },
  { code: "TH", name: "Thailand", flag: "🇹🇭", platforms: ["tiktok"] },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", platforms: ["tiktok"] },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", platforms: ["tiktok"] },
  { code: "PH", name: "Philippines", flag: "🇵🇭", platforms: ["tiktok"] },
  { code: "RU", name: "Russia", flag: "🇷🇺", platforms: ["aliexpress"] },
  { code: "BR", name: "Brazil", flag: "🇧🇷", platforms: ["aliexpress"] },
];

interface Tool {
  id: string;
  name: string;
  description: string;
  platform: string;
  countries: string[];
  status: "live" | "coming";
  href: string;
}

const TOOLS: Tool[] = [
  {
    id: "ebay-fee-calc",
    name: "eBay Fee Calculator",
    description: "Enter sale price, cost, and shipping to instantly calculate eBay fees, net profit, and margins",
    platform: "ebay",
    countries: ["US", "UK", "DE", "AU", "CA", "FR", "IT"],
    status: "live",
    href: "/ebay-fee-calculator",
  },
  {
    id: "ebay-pricing-calc",
    name: "eBay Pricing Calculator",
    description: "Back-solve the minimum listing price from cost, discount rate, and target profit or margin",
    platform: "ebay",
    countries: ["US", "UK", "DE", "AU", "CA", "FR", "IT"],
    status: "live",
    href: "/ebay-pricing-calculator",
  },
  {
    id: "amazon-fba-calc",
    name: "Amazon FBA Calculator",
    description: "Estimate FBA fulfillment fees, storage costs, and referral fees to quickly assess product profitability",
    platform: "amazon",
    countries: ["US", "UK", "DE", "JP", "CA", "IT", "ES", "AU", "AE", "BR", "SG", "MX", "NL", "BE", "SE", "PL", "TR"],
    status: "live",
    href: "/amazon-fee-calculator",
  },
  {
    id: "amazon-pricing-calc",
    name: "Amazon Pricing Calculator",
    description: "Back-solve the minimum listing price from cost, target profit, and FBA fees including referral, fulfillment, and storage",
    platform: "amazon",
    countries: ["US"],
    status: "live",
    href: "/amazon-pricing-calculator",
  },
  {
    id: "tiktok-profit-calc",
    name: "TikTok Shop Fee Calculator",
    description: "Calculate referral fees, FBT fulfillment costs, affiliate commissions, and net profit for TikTok Shop sellers",
    platform: "tiktok",
    countries: ["US", "UK", "VN", "TH", "SG", "MY", "ID", "PH"],
    status: "live",
    href: "/tiktok-shop-fee-calculator",
  },
  {
    id: "shopify-cost-calc",
    name: "Shopify Cost Calculator",
    description: "Factor in Shopify subscription, transaction fees, and payment gateway costs to estimate total store expenses",
    platform: "shopify",
    countries: ["US", "CA", "AU", "SG", "JP", "EU", "UK", "CH"],
    status: "live",
    href: "/shopify-fee-calculator",
  },
  {
    id: "walmart-fee-calc",
    name: "Walmart Fee Calculator",
    description: "Calculate Walmart Marketplace fees by category commission rate and estimate expected profit",
    platform: "walmart",
    countries: ["US", "CA", "MX", "CL"],
    status: "live",
    href: "/walmart-fee-calculator",
  },
  {
    id: "ebay-title-optimizer",
    name: "eBay Title Optimizer",
    description: "AI-powered listing title generator based on trending keywords to boost search visibility",
    platform: "ebay",
    countries: ["US", "UK", "DE", "AU", "CA", "FR", "IT"],
    status: "live",
    href: "/ebay-title-optimizer",
  },
  {
    id: "amazon-keyword-tool",
    name: "Amazon Keyword Tool",
    description: "Discover Amazon search terms, analyze search volume and competition to optimize your listings",
    platform: "amazon",
    countries: ["US", "UK", "DE"],
    status: "coming",
    href: "#",
  },
  {
    id: "temu-profit-calc",
    name: "Temu Profit Calculator",
    description: "Calculate actual earnings after platform deductions under Temu's fully-managed model",
    platform: "temu",
    countries: ["US", "UK", "DE"],
    status: "coming",
    href: "#",
  },
];

export default function LandingPage() {
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const filteredTools = TOOLS.filter((tool) => {
    const matchPlatform = platformFilter === "all" || tool.platform === platformFilter;
    const matchCountry = countryFilter === "all" || tool.countries.includes(countryFilter);
    return matchPlatform && matchCountry;
  });

  const platformNames: Record<string, string> = {};
  PLATFORMS.forEach((p) => { platformNames[p.id] = p.name; });

  const getLiveToolCount = (platformId: string) =>
    TOOLS.filter((tool) => tool.platform === platformId && tool.status === "live").length;

  return (
    <div className="container">
      {/* ── Hero ── */}
      <section className="hero">
        <span className="hero-badge">{`${BRAND.masterName} · ${BRAND.masterTagline}`}</span>
        <h1>Make Better Ecommerce Decisions With Data</h1>
        <p>
          Data EDE helps cross-border teams model fees, margin, and channel performance. Use{" "}
          {BRAND.suiteDisplay} to run practical calculations across eBay, Amazon, TikTok Shop, and Shopify.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="#tools">
            Enter {BRAND.suiteLabel}
          </Link>
          <Link className="btn btn-secondary" href="/compare">
            View Comparison Guides
          </Link>
        </div>
        <div className="hero-stats">
        <div className="hero-stat">
            <div className="hero-stat-value">{TOOLS.length}</div>
            <div className="hero-stat-label">SellerLab Tools</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{PLATFORMS.length}</div>
            <div className="hero-stat-label">Platforms</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{COUNTRIES.length}+</div>
            <div className="hero-stat-label">Marketplaces</div>
          </div>
         
        </div>
      </section>
      {/* ── Tool Matrix ── */}
      <section className="section" id="tools">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {BRAND.suiteLabel} Tools
              {platformFilter !== "all" && (
                <span style={{ fontSize: 16, fontWeight: 400, color: "var(--color-text-secondary)", marginLeft: 8 }}>
                  · {platformNames[platformFilter]}
                </span>
              )}
              {countryFilter !== "all" && (
                <span style={{ fontSize: 16, fontWeight: 400, color: "var(--color-text-secondary)", marginLeft: 8 }}>
                  · {countryFilter}
                </span>
              )}
            </h2>
            <p className="section-subtitle">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
              {(platformFilter !== "all" || countryFilter !== "all") && " matching current filters"}
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <button
            className="filter-tab"
            data-active={platformFilter === "all" && countryFilter === "all" ? "true" : undefined}
            onClick={() => { setPlatformFilter("all"); setCountryFilter("all"); }}
          >
            All
          </button>
          {PLATFORMS.slice(0, 5).map((p) => (
            <button
              key={p.id}
              className="filter-tab"
              data-active={platformFilter === p.id ? "true" : undefined}
              onClick={() => { setPlatformFilter(p.id === platformFilter ? "all" : p.id); setCountryFilter("all"); }}
            >
              <PlatformLogo platformId={p.id} size={18} /> {p.name}
            </button>
          ))}
          <span style={{ width: 1, background: "var(--color-border)", margin: "0 4px" }} />
          {COUNTRIES.slice(0, 6).map((c) => (
            <button
              key={c.code}
              className="filter-tab"
              data-active={countryFilter === c.code ? "true" : undefined}
              onClick={() => { setCountryFilter(c.code === countryFilter ? "all" : c.code); setPlatformFilter("all"); }}
            >
              <FlagIcon code={c.code} size={16} /> {c.code}
            </button>
          ))}
        </div>

        {/* Tool cards */}
        <div className="tool-matrix">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card"
              style={tool.status === "coming" ? { opacity: 0.75 } : undefined}
            >
              <div className="tool-card-header">
                <PlatformLogo platformId={tool.platform} size={22} />
                <h4>{tool.name}</h4>
              </div>
              <p>{tool.description}</p>
              <div className="tool-badges">
                <span className="badge badge-platform">
                  {platformNames[tool.platform] || tool.platform}
                </span>
                {tool.countries.map((c) => (
                  <span key={c} className="badge badge-country">{c}</span>
                ))}
                <span className={`badge ${tool.status === "live" ? "badge-live" : "badge-status"}`}>
                  {tool.status === "live" ? "Live" : "Coming Soon"}
                </span>
              </div>
            </Link>
          ))}

          {filteredTools.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "var(--color-text-tertiary)" }}>
              <p style={{ fontSize: 16 }}>No tools match the current filters</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: 12 }}
                onClick={() => { setPlatformFilter("all"); setCountryFilter("all"); }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse by Platform</h2>
            <p className="section-subtitle">Select your primary platform to view available tools</p>
          </div>
        </div>
        <div className="platform-grid">
          {PLATFORMS.map((platform) => {
            const liveToolCount = getLiveToolCount(platform.id);
            return (
            <div
              key={platform.id}
              className="platform-card"
              onClick={() => {
                setPlatformFilter(platform.id === platformFilter ? "all" : platform.id);
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={platformFilter === platform.id ? { borderColor: "var(--color-primary)", boxShadow: "var(--shadow-md)" } : undefined}
            >
              <div className="platform-icon" style={{ background: platform.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlatformLogo platformId={platform.id} size={36} />
              </div>
              <h3>{platform.name}</h3>
              <p>{platform.description}</p>
              <div className="platform-meta">
                <span className="platform-tag">
                  {platform.countries.length} {platform.countries.length === 1 ? "market" : "markets"}
                </span>
                <span className="platform-tag">
                  {liveToolCount > 0 ? `${liveToolCount} ${liveToolCount === 1 ? "tool" : "tools"}` : "Coming Soon"}
                </span>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* ── Countries ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse by Marketplace</h2>
            <p className="section-subtitle">Select a target market to see supported platforms and tools</p>
          </div>
        </div>
        <div className="country-grid">
          {COUNTRIES.map((country) => (
            <div
              key={country.code}
              className="country-card"
              onClick={() => {
                setCountryFilter(country.code === countryFilter ? "all" : country.code);
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={countryFilter === country.code ? { borderColor: "var(--color-primary)", boxShadow: "var(--shadow-md)" } : undefined}
            >
              <FlagIcon code={country.code} size={36} style={{ borderRadius: 4 }} />
              <h4>{country.name} ({country.code})</h4>
              <p>{country.platforms.length} {country.platforms.length === 1 ? "platform" : "platforms"}</p>
            </div>
          ))}
        </div>
      </section>

      

      {/* ── CTA ── */}
      <section className="section">
        <div className="cta-banner">
          <h2>Start With {BRAND.suiteLabel}</h2>
          <p>
            Use Data EDE&apos;s free calculators to model fees and protect profit before you scale into new marketplaces.
          </p>
          <Link className="btn" href="#tools">
            Open {BRAND.suiteLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
