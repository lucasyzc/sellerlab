#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function readFile(relPath) {
  const absPath = path.join(root, relPath);
  if (!fs.existsSync(absPath)) {
    errors.push(`[missing-file] ${relPath}`);
    return "";
  }
  return fs.readFileSync(absPath, "utf8");
}

function addError(code, message) {
  errors.push(`[${code}] ${message}`);
}

function extractPrimarySiteUrl(siteUrlFile) {
  const match = siteUrlFile.match(/const\s+FALLBACK_SITE_URL\s*=\s*"([^"]+)"/);
  if (!match) return null;
  return match[1];
}

function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s"'`)>]+/g) || [];
  return matches.map((url) => url.replace(/[),.;]+$/, ""));
}

function hasFaqUi(content) {
  return /(Frequently Asked Questions|FAQ_ITEMS|MarketFAQ|>\s*FAQ\s*<|\bFAQ\b)/i.test(content);
}

function hasDateSignal(content) {
  if (/\b\d{4}-\d{2}-\d{2}\b/.test(content)) return true;
  return /(FEE_SEO_LAST_REVIEWED|lastReviewedLabel|lastReviewed|updatedAt)/.test(content);
}

function checkDomainConsistency(primaryHost) {
  const siteLevelFiles = [
    "lib/site-url.ts",
    "app/layout.tsx",
    "app/page.tsx",
    "app/sitemap.ts",
    "app/robots.ts",
    "scripts/indexnow-submit.mjs",
  ];

  const allowedHosts = new Set([primaryHost, "api.indexnow.org", "schema.org", "www.schema.org"]);

  for (const relPath of siteLevelFiles) {
    const content = readFile(relPath);
    if (!content) continue;

    for (const url of extractUrls(content)) {
      if (url.includes("${")) continue;
      let host = "";
      try {
        host = new URL(url).host;
      } catch {
        continue;
      }

      if (!allowedHosts.has(host)) {
        addError("host-mismatch", `${relPath} contains non-primary host: ${url}`);
      }
    }
  }

  const indexNowContent = readFile("scripts/indexnow-submit.mjs");
  const hostDefaultMatch = indexNowContent.match(/process\.env\.INDEXNOW_HOST\s*\|\|\s*"([^"]+)"/);
  if (!hostDefaultMatch) {
    addError("indexnow-config", "scripts/indexnow-submit.mjs missing default INDEXNOW_HOST fallback.");
  } else if (hostDefaultMatch[1] !== primaryHost) {
    addError(
      "indexnow-host",
      `IndexNow default host is ${hostDefaultMatch[1]}, expected ${primaryHost}.`,
    );
  }
}

function checkStructuredDataContracts() {
  const calculatorHubFiles = [
    "app/amazon-fee-calculator/page.tsx",
    "app/ebay-fee-calculator/page.tsx",
    "app/ebay-pricing-calculator/page.tsx",
    "app/tiktok-shop-fee-calculator/page.tsx",
    "app/shopify-fee-calculator/page.tsx",
    "app/walmart-fee-calculator/page.tsx",
  ];

  for (const relPath of calculatorHubFiles) {
    const content = readFile(relPath);
    if (!content) continue;

    if (!/"@type"\s*:\s*"BreadcrumbList"/.test(content)) {
      addError("schema", `${relPath} missing BreadcrumbList schema.`);
    }
    if (!/"@type"\s*:\s*"SoftwareApplication"/.test(content)) {
      addError("schema", `${relPath} missing SoftwareApplication schema.`);
    }
    if (hasFaqUi(content) && !/"@type"\s*:\s*"FAQPage"/.test(content)) {
      addError("schema", `${relPath} missing FAQPage schema.`);
    }
  }

  const titleOptimizerFile = "app/ebay-title-optimizer/page.tsx";
  const titleOptimizerContent = readFile(titleOptimizerFile);
  if (titleOptimizerContent) {
    if (!/"@type"\s*:\s*"SoftwareApplication"/.test(titleOptimizerContent)) {
      addError("schema", `${titleOptimizerFile} missing SoftwareApplication schema.`);
    }
    if (!/"@type"\s*:\s*"HowTo"/.test(titleOptimizerContent)) {
      addError("schema", `${titleOptimizerFile} missing HowTo schema.`);
    }
    if (!/"@type"\s*:\s*"FAQPage"/.test(titleOptimizerContent)) {
      addError("schema", `${titleOptimizerFile} missing FAQPage schema.`);
    }
  }
}

function checkFaqSync() {
  const faqFiles = [
    "app/amazon-fee-calculator/page.tsx",
    "app/ebay-fee-calculator/page.tsx",
    "app/ebay-pricing-calculator/page.tsx",
    "app/tiktok-shop-fee-calculator/page.tsx",
    "app/shopify-fee-calculator/page.tsx",
    "app/walmart-fee-calculator/page.tsx",
    "app/ebay-title-optimizer/page.tsx",
    "app/compare/[slug]/page.tsx",
    "app/updates/[slug]/page.tsx",
  ];

  for (const relPath of faqFiles) {
    const content = readFile(relPath);
    if (!content) continue;

    const faqSchema = /"@type"\s*:\s*"FAQPage"/.test(content);
    const faqUi = hasFaqUi(content);

    if (faqSchema && !faqUi) {
      addError("faq-sync", `${relPath} has FAQPage schema but no visible FAQ signal.`);
    }
    if (faqUi && !faqSchema) {
      addError("faq-sync", `${relPath} has visible FAQ signal but no FAQPage schema.`);
    }
  }
}

function checkLastReviewedSignals() {
  const requiredFiles = [
    "app/amazon-fee-calculator/page.tsx",
    "app/ebay-fee-calculator/page.tsx",
    "app/ebay-pricing-calculator/page.tsx",
    "app/tiktok-shop-fee-calculator/page.tsx",
    "app/shopify-fee-calculator/page.tsx",
    "app/walmart-fee-calculator/page.tsx",
    "app/compare/[slug]/page.tsx",
    "app/updates/[slug]/page.tsx",
  ];

  for (const relPath of requiredFiles) {
    const content = readFile(relPath);
    if (!content) continue;

    if (!/(Last reviewed|lastReviewedLabel|updatedAt)/i.test(content)) {
      addError("freshness", `${relPath} missing Last reviewed freshness signal.`);
      continue;
    }

    if (!hasDateSignal(content)) {
      addError("freshness", `${relPath} missing YYYY-MM-DD date signal.`);
    }
  }
}

function checkGeoAssets() {
  const llms = readFile("public/llms.txt");
  const llmsFull = readFile("public/llms-full.txt");
  const glossaryPage = readFile("app/glossary/page.tsx");
  const sitemap = readFile("app/sitemap.ts");

  if (!llms.includes("https://dataede.com")) {
    addError("geo-asset", "public/llms.txt should reference primary domain URLs.");
  }
  if (!llmsFull.includes("https://dataede.com")) {
    addError("geo-asset", "public/llms-full.txt should reference primary domain URLs.");
  }
  if (!/Last reviewed:\s*\d{4}-\d{2}-\d{2}/.test(llms)) {
    addError("geo-asset", "public/llms.txt missing Last reviewed date in YYYY-MM-DD format.");
  }
  if (!/Last reviewed:\s*\d{4}-\d{2}-\d{2}/.test(llmsFull)) {
    addError("geo-asset", "public/llms-full.txt missing Last reviewed date in YYYY-MM-DD format.");
  }

  if (!/"@type"\s*:\s*"DefinedTermSet"/.test(glossaryPage)) {
    addError("geo-asset", "app/glossary/page.tsx missing DefinedTermSet schema.");
  }
  if (!/\/glossary/.test(sitemap)) {
    addError("geo-asset", "app/sitemap.ts missing /glossary route.");
  }
}

function checkFactAnchors() {
  const calculatorHubFiles = [
    "app/amazon-fee-calculator/page.tsx",
    "app/ebay-fee-calculator/page.tsx",
    "app/ebay-pricing-calculator/page.tsx",
    "app/tiktok-shop-fee-calculator/page.tsx",
    "app/shopify-fee-calculator/page.tsx",
    "app/walmart-fee-calculator/page.tsx",
  ];

  for (const relPath of calculatorHubFiles) {
    const content = readFile(relPath);
    if (!content) continue;

    if (!/Calculation Logic/i.test(content)) {
      addError("fact-anchor", `${relPath} missing Calculation Logic section.`);
    }
    if (!/Primary Sources/i.test(content)) {
      addError("fact-anchor", `${relPath} missing Primary Sources section.`);
    }
  }
}

function run() {
  const siteUrlContent = readFile("lib/site-url.ts");
  const primarySiteUrl = extractPrimarySiteUrl(siteUrlContent);
  if (!primarySiteUrl) {
    addError("site-url", "Unable to resolve FALLBACK_SITE_URL from lib/site-url.ts.");
  }

  let primaryHost = "";
  if (primarySiteUrl) {
    try {
      primaryHost = new URL(primarySiteUrl).host;
    } catch {
      addError("site-url", `Invalid FALLBACK_SITE_URL: ${primarySiteUrl}`);
    }
  }

  if (primaryHost) {
    checkDomainConsistency(primaryHost);
  }

  checkStructuredDataContracts();
  checkFaqSync();
  checkLastReviewedSignals();
  checkFactAnchors();
  checkGeoAssets();

  if (errors.length > 0) {
    console.error("[guardrails:seo-geo] FAILED");
    errors.forEach((error, index) => {
      console.error(`${index + 1}. ${error}`);
    });
    process.exit(1);
  }

  console.log("[guardrails:seo-geo] PASS - SEO/GEO guardrails satisfied.");
}

run();
