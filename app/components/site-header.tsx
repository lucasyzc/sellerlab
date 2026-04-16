"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";

type NavItem = { label: string; href: string };
type ToolNavItem = {
  label: string;
  href: string;
  group: "fee" | "optimization";
  description: string;
};

const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Compare", href: "/compare" },
  { label: "Blog", href: "/updates" },
  { label: "Glossary", href: "/glossary" },
  { label: "About", href: "/about" },
];

const TOOLS_NAV: ToolNavItem[] = [
  {
    label: "eBay Fee Calculator",
    href: "/ebay-fee-calculator",
    group: "fee",
    description: "Estimate fees, net profit, and margin for eBay listings.",
  },
  {
    label: "eBay Pricing Calculator",
    href: "/ebay-pricing-calculator",
    group: "fee",
    description: "Back-solve the minimum listing price from your target profit.",
  },
  {
    label: "Amazon Fee Calculator",
    href: "/amazon-fee-calculator",
    group: "fee",
    description: "Model referral, fulfillment, and storage costs by market.",
  },
  {
    label: "Amazon Pricing Calculator",
    href: "/amazon-pricing-calculator",
    group: "fee",
    description: "Back-solve Amazon listing price from your target profit and costs.",
  },
  {
    label: "TikTok Shop Fee Calculator",
    href: "/tiktok-shop-fee-calculator",
    group: "fee",
    description: "Calculate platform fees, affiliate cuts, and payout impact.",
  },
  {
    label: "TikTok Shop Pricing Calculator",
    href: "/tiktok-shop-pricing-calculator",
    group: "fee",
    description: "Back-solve listing price from target profit and TikTok Shop fees.",
  },
  {
    label: "Shopify Cost Calculator",
    href: "/shopify-fee-calculator",
    group: "fee",
    description: "Estimate plan, payment, and transaction costs for stores.",
  },
  {
    label: "Walmart Fee Calculator",
    href: "/walmart-fee-calculator",
    group: "fee",
    description: "Forecast category commissions and expected unit profit.",
  },
  {
    label: "eBay Title Optimizer",
    href: "/ebay-title-optimizer",
    group: "optimization",
    description: "Generate stronger listing titles with AI-assisted phrasing.",
  },
];

const TOOL_PATHS = TOOLS_NAV.map((item) => item.href);

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isToolsPath(pathname: string): boolean {
  return TOOL_PATHS.some((href) => isPathActive(pathname, href));
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const toolsMenuId = useId();
  const mobileToolsId = useId();
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const desktopToolsFirstLinkRef = useRef<HTMLAnchorElement>(null);
  const [isDesktopToolsOpen, setDesktopToolsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setMobileToolsOpen] = useState(false);

  const feeTools = useMemo(
    () => TOOLS_NAV.filter((item) => item.group === "fee"),
    []
  );
  const optimizationTools = useMemo(
    () => TOOLS_NAV.filter((item) => item.group === "optimization"),
    []
  );
  const toolsActive = isToolsPath(pathname);

  useEffect(() => {
    if (!isDesktopToolsOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!desktopDropdownRef.current?.contains(event.target as Node)) {
        setDesktopToolsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDesktopToolsOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopToolsOpen(false);
        setMobileMenuOpen(false);
        setMobileToolsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeAllMenus = () => {
    setDesktopToolsOpen(false);
    setMobileMenuOpen(false);
    setMobileToolsOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileToolsOpen(false);
  };

  const openDesktopToolsAndFocus = () => {
    setDesktopToolsOpen(true);
    requestAnimationFrame(() => {
      desktopToolsFirstLinkRef.current?.focus();
    });
  };

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <div className="site-brand">
            <Link href="/" className="site-brand-logo" aria-label={`${BRAND.masterName} home`}>
              <Image
                src="/logo.svg"
                alt={`${BRAND.masterName} logo`}
                width={38}
                height={38}
                priority
              />
            </Link>
            <div className="site-brand-text">
              <Link href="/" className="site-brand-name">
                {BRAND.masterName}
              </Link>
              <div className="site-brand-meta">
                <span className="site-brand-tagline">{BRAND.masterTagline}</span>
                <span className="site-brand-product">{BRAND.suiteLabel}</span>
              </div>
            </div>
          </div>

          <nav className="site-nav" aria-label="Primary">
            <Link
              href="/"
              className={`site-nav-link ${isPathActive(pathname, "/") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              Home
            </Link>

            <div className="tools-dropdown" ref={desktopDropdownRef}>
              <button
                type="button"
                className={`site-nav-link site-nav-button ${toolsActive || isDesktopToolsOpen ? "is-active" : ""}`}
                aria-expanded={isDesktopToolsOpen}
                aria-controls={toolsMenuId}
                onClick={() => setDesktopToolsOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " " ||
                    event.key === "ArrowDown"
                  ) {
                    event.preventDefault();
                    openDesktopToolsAndFocus();
                  }
                  if (event.key === "Escape") {
                    setDesktopToolsOpen(false);
                  }
                }}
              >
                Tools
                <span
                  className={`tools-trigger-icon ${isDesktopToolsOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              <div
                id={toolsMenuId}
                className={`tools-menu ${isDesktopToolsOpen ? "is-open" : ""}`}
              >
                <div className="tools-menu-intro">
                  <p className="tools-menu-kicker">{BRAND.suiteLabel}</p>
                  <p className="tools-menu-title">Choose the right tool</p>
                </div>
                <div className="tools-menu-columns">
                  <div className="tools-menu-group">
                    <p className="tools-menu-group-label">Fee &amp; Profit</p>
                    {feeTools.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="tools-menu-item"
                        onClick={closeAllMenus}
                        ref={index === 0 ? desktopToolsFirstLinkRef : undefined}
                      >
                        <span className="tools-menu-item-title">{item.label}</span>
                        <span className="tools-menu-item-description">
                          {item.description}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="tools-menu-group">
                    <p className="tools-menu-group-label">Optimization</p>
                    {optimizationTools.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="tools-menu-item"
                        onClick={closeAllMenus}
                      >
                        <span className="tools-menu-item-title">{item.label}</span>
                        <span className="tools-menu-item-description">
                          {item.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="tools-menu-footer">
                  <Link href="/#tools" className="tools-menu-all-link" onClick={closeAllMenus}>
                    View all tools
                  </Link>
                </div>
              </div>
            </div>

            {MAIN_NAV.filter((item) => item.href !== "/").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav-link ${isPathActive(pathname, item.href) ? "is-active" : ""}`}
                onClick={closeAllMenus}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header-actions">
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => {
                if (isMobileMenuOpen) {
                  closeMobileMenu();
                } else {
                  setMobileMenuOpen(true);
                }
              }}
            >
              <span className="mobile-menu-toggle-line" />
              <span className="mobile-menu-toggle-line" />
              <span className="mobile-menu-toggle-line" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-nav-backdrop ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${isMobileMenuOpen ? "is-open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button
            type="button"
            className="mobile-nav-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="mobile-nav-content">
          <div className="mobile-nav-group">
            <p className="mobile-nav-group-label">Main</p>
            <Link
              href="/"
              className={`mobile-nav-link ${isPathActive(pathname, "/") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              Home
            </Link>
            <button
              type="button"
              className={`mobile-tools-toggle ${toolsActive || isMobileToolsOpen ? "is-active" : ""}`}
              aria-expanded={isMobileToolsOpen}
              aria-controls={mobileToolsId}
              onClick={() => setMobileToolsOpen((current) => !current)}
            >
              <span>Tools</span>
              <span
                className={`mobile-tools-toggle-icon ${isMobileToolsOpen ? "is-open" : ""}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            <div id={mobileToolsId} className={`mobile-tools-list ${isMobileToolsOpen ? "is-open" : ""}`}>
              <p className="mobile-nav-group-label is-subgroup">Fee &amp; Profit</p>
              {feeTools.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-link ${isPathActive(pathname, item.href) ? "is-active" : ""}`}
                  onClick={closeAllMenus}
                >
                  {item.label}
                </Link>
              ))}

              <p className="mobile-nav-group-label is-subgroup">Optimization</p>
              {optimizationTools.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-link ${isPathActive(pathname, item.href) ? "is-active" : ""}`}
                  onClick={closeAllMenus}
                >
                  {item.label}
                </Link>
              ))}

              <Link href="/#tools" className="mobile-nav-link mobile-view-all" onClick={closeAllMenus}>
                View all tools
              </Link>
            </div>
            <Link
              href="/compare"
              className={`mobile-nav-link ${isPathActive(pathname, "/compare") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              Compare
            </Link>
            <Link
              href="/updates"
              className={`mobile-nav-link ${isPathActive(pathname, "/updates") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              Blog
            </Link>
            <Link
              href="/glossary"
              className={`mobile-nav-link ${isPathActive(pathname, "/glossary") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              Glossary
            </Link>
          </div>

          <div className="mobile-nav-group">
            <p className="mobile-nav-group-label">Company</p>
            <Link
              href="/about"
              className={`mobile-nav-link ${isPathActive(pathname, "/about") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`mobile-nav-link ${isPathActive(pathname, "/contact") ? "is-active" : ""}`}
              onClick={closeAllMenus}
            >
              Contact
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
