"use client";

import Link from "next/link";
import { useState } from "react";
import { PlatformLogo } from "./components/platform-logos";

const PLATFORMS = [
  {
    id: "ebay",
    name: "eBay",
    color: "#e53e3e",
    bg: "#fff5f5",
    description: "全球领先的拍卖及固定价格交易平台，覆盖 190+ 国家市场",
    countries: ["US", "UK", "DE", "AU", "FR", "IT", "ES", "CA"],
    toolCount: 1,
  },
  {
    id: "amazon",
    name: "Amazon",
    color: "#FF9900",
    bg: "#fffaf0",
    description: "全球最大电商平台，FBA/FBM 多模式运营，覆盖主要发达市场",
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "JP", "CA", "AU"],
    toolCount: 1,
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    color: "#010101",
    bg: "#f5f5f5",
    description: "新兴社交电商平台，短视频+直播带货，增长迅猛",
    countries: ["US", "UK", "ID", "TH", "MY", "VN", "PH"],
    toolCount: 0,
  },
  {
    id: "shopify",
    name: "Shopify",
    color: "#95BF47",
    bg: "#f0fff4",
    description: "独立站建站首选，自主品牌出海，灵活掌控流量与数据",
    countries: ["US", "UK", "DE", "FR", "CA", "AU", "JP"],
    toolCount: 0,
  },
  {
    id: "walmart",
    name: "Walmart",
    color: "#0071CE",
    bg: "#ebf8ff",
    description: "北美第二大电商平台，流量红利期，适合成熟卖家拓展",
    countries: ["US", "CA", "MX"],
    toolCount: 0,
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    color: "#FF4747",
    bg: "#fff5f5",
    description: "阿里旗下跨境零售平台，面向全球消费者，物流体系完善",
    countries: ["US", "UK", "DE", "FR", "ES", "RU", "BR"],
    toolCount: 0,
  },
  {
    id: "temu",
    name: "Temu",
    color: "#FB7701",
    bg: "#fffaf0",
    description: "拼多多旗下出海平台，全托管模式，快速起量",
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "AU", "CA"],
    toolCount: 0,
  },
  {
    id: "shein",
    name: "SHEIN",
    color: "#000000",
    bg: "#f7f7f7",
    description: "快时尚跨境巨头，小单快反模式，平台+独立站并行",
    countries: ["US", "UK", "DE", "FR", "IT", "ES", "AU"],
    toolCount: 0,
  },
];

const COUNTRIES = [
  { code: "US", name: "美国", flag: "🇺🇸", platforms: ["ebay", "amazon", "tiktok", "shopify", "walmart", "aliexpress", "temu", "shein"] },
  { code: "UK", name: "英国", flag: "🇬🇧", platforms: ["ebay", "amazon", "tiktok", "shopify", "aliexpress", "temu", "shein"] },
  { code: "DE", name: "德国", flag: "🇩🇪", platforms: ["ebay", "amazon", "shopify", "aliexpress", "temu", "shein"] },
  { code: "FR", name: "法国", flag: "🇫🇷", platforms: ["ebay", "amazon", "shopify", "aliexpress", "temu", "shein"] },
  { code: "IT", name: "意大利", flag: "🇮🇹", platforms: ["ebay", "amazon", "temu", "shein"] },
  { code: "ES", name: "西班牙", flag: "🇪🇸", platforms: ["ebay", "amazon", "aliexpress", "temu", "shein"] },
  { code: "AU", name: "澳大利亚", flag: "🇦🇺", platforms: ["ebay", "amazon", "shopify", "temu", "shein"] },
  { code: "CA", name: "加拿大", flag: "🇨🇦", platforms: ["ebay", "amazon", "shopify", "walmart", "temu"] },
  { code: "JP", name: "日本", flag: "🇯🇵", platforms: ["amazon", "shopify"] },
  { code: "MX", name: "墨西哥", flag: "🇲🇽", platforms: ["walmart"] },
  { code: "ID", name: "印尼", flag: "🇮🇩", platforms: ["tiktok"] },
  { code: "TH", name: "泰国", flag: "🇹🇭", platforms: ["tiktok"] },
  { code: "MY", name: "马来西亚", flag: "🇲🇾", platforms: ["tiktok"] },
  { code: "VN", name: "越南", flag: "🇻🇳", platforms: ["tiktok"] },
  { code: "PH", name: "菲律宾", flag: "🇵🇭", platforms: ["tiktok"] },
  { code: "RU", name: "俄罗斯", flag: "🇷🇺", platforms: ["aliexpress"] },
  { code: "BR", name: "巴西", flag: "🇧🇷", platforms: ["aliexpress"] },
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
    description: "输入售价、成本与运费，即时测算 eBay 平台各站点费率、净利润与利润率",
    platform: "ebay",
    countries: ["US", "UK", "DE", "AU"],
    status: "live",
    href: "/ebay-fee-calculator",
  },
  {
    id: "amazon-fba-calc",
    name: "Amazon FBA Calculator",
    description: "估算 FBA 配送费、仓储费与佣金，快速评估产品盈利空间",
    platform: "amazon",
    countries: ["US", "UK", "DE", "JP"],
    status: "live",
    href: "/amazon-fee-calculator",
  },
  {
    id: "tiktok-profit-calc",
    name: "TikTok Shop 利润计算器",
    description: "计算 TikTok Shop 佣金、运费补贴后的实际利润，辅助选品定价",
    platform: "tiktok",
    countries: ["US", "UK"],
    status: "coming",
    href: "#",
  },
  {
    id: "shopify-cost-calc",
    name: "Shopify 成本计算器",
    description: "综合 Shopify 月费、交易费与支付网关费，测算独立站运营成本",
    platform: "shopify",
    countries: ["US", "UK", "DE", "CA"],
    status: "coming",
    href: "#",
  },
  {
    id: "walmart-fee-calc",
    name: "Walmart 费率计算器",
    description: "基于品类佣金率，测算 Walmart Marketplace 各项费用与预期利润",
    platform: "walmart",
    countries: ["US"],
    status: "coming",
    href: "#",
  },
  {
    id: "ebay-title-optimizer",
    name: "eBay 标题优化器",
    description: "基于热搜关键词，AI 生成高曝光 listing 标题，提升搜索排名",
    platform: "ebay",
    countries: ["US", "UK", "DE", "AU"],
    status: "coming",
    href: "#",
  },
  {
    id: "amazon-keyword-tool",
    name: "Amazon 关键词工具",
    description: "挖掘 Amazon 站内搜索词，分析搜索量与竞争度，优化 listing",
    platform: "amazon",
    countries: ["US", "UK", "DE"],
    status: "coming",
    href: "#",
  },
  {
    id: "temu-profit-calc",
    name: "Temu 利润计算器",
    description: "基于全托管模式费率结构，计算供货价、平台扣点后的实际收益",
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

  return (
    <div className="container">
      {/* ── Hero ── */}
      <section className="hero">
        <span className="hero-badge">Tools Hub for Cross-border Sellers</span>
        <h1>跨境电商卖家工具站</h1>
        <p>
          覆盖 eBay、Amazon、TikTok Shop、Shopify 等主流平台，
          支持美国、英国、德国等 17+ 站点市场，一站式费率测算与运营工具。
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/ebay-fee-calculator">
            立即使用 eBay Fee Calculator
          </Link>
          <Link className="btn btn-secondary" href="#tools">
            浏览全部工具
          </Link>
        </div>
        <div className="hero-stats">
        <div className="hero-stat">
            <div className="hero-stat-value">{TOOLS.length}</div>
            <div className="hero-stat-label">卖家工具</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{PLATFORMS.length}</div>
            <div className="hero-stat-label">电商平台</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{COUNTRIES.length}+</div>
            <div className="hero-stat-label">站点市场</div>
          </div>
         
        </div>
      </section>
      {/* ── Tool Matrix ── */}
      <section className="section" id="tools">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              卖家工具
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
              {filteredTools.length} 个工具
              {(platformFilter !== "all" || countryFilter !== "all") && " 匹配当前筛选"}
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
            全部
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
              {c.flag} {c.code}
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
                  {tool.status === "live" ? "已上线" : "即将上线"}
                </span>
              </div>
            </Link>
          ))}

          {filteredTools.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "var(--color-text-tertiary)" }}>
              <p style={{ fontSize: 16 }}>当前筛选条件下暂无匹配工具</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: 12 }}
                onClick={() => { setPlatformFilter("all"); setCountryFilter("all"); }}
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">按平台浏览</h2>
            <p className="section-subtitle">选择你的主营平台，查看可用工具</p>
          </div>
        </div>
        <div className="platform-grid">
          {PLATFORMS.map((platform) => (
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
                  {platform.countries.length} 个站点
                </span>
                <span className="platform-tag">
                  {platform.toolCount > 0 ? `${platform.toolCount} 个工具` : "即将上线"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Countries ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">按站点市场浏览</h2>
            <p className="section-subtitle">选择目标市场，了解支持的平台与工具</p>
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
              <span className="country-flag">{country.flag}</span>
              <h4>{country.name} ({country.code})</h4>
              <p>{country.platforms.length} 个平台</p>
            </div>
          ))}
        </div>
      </section>

      

      {/* ── CTA ── */}
      <section className="section">
        <div className="cta-banner">
          <h2>开始优化你的跨境生意</h2>
          <p>免费使用卖家工具，精准测算费率与利润，让每一单都心中有数</p>
          <Link className="btn" href="/ebay-fee-calculator">
            免费使用 eBay Fee Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
