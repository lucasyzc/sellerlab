import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";
import { EbayTitleOptimizerClient } from "./optimizer-client";
import { FEE_SEO_LAST_REVIEWED } from "@/lib/fee-seo";

const TOOL_TITLE = withSuiteBrand("eBay Title Optimizer");
const LAST_REVIEWED = FEE_SEO_LAST_REVIEWED;

export const metadata: Metadata = {
  title: TOOL_TITLE,
  description:
    "AI eBay Title Optimizer for sellers. Generate SEO-focused eBay listing titles, compare scored variants, and improve discoverability across US, UK, DE, AU, CA, FR, and IT marketplaces.",
  keywords: [
    "ai ebay title generator",
    "ai title optimizer",
    "ebay title optimizer",
    "ebay title generator",
    "ebay listing title ai",
    "ebay listing title tool",
    "ebay seo title",
    "ebay keyword title builder",
    "ebay seo optimization",
    "marketplace ai writing tool",
  ],
  alternates: {
    canonical: "/ebay-title-optimizer",
  },
  openGraph: {
    title: TOOL_TITLE,
    description:
      "AI-powered eBay title generation with SEO scoring, marketplace-aware language output, and seller-ready title variants.",
    type: "website",
    siteName: "Data EDE",
    url: "/ebay-title-optimizer",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: TOOL_TITLE,
    description:
      "Generate eBay titles with AI, score keyword coverage, and pick high-performing SEO variants faster.",
  },
};

function StructuredData() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "eBay Title Optimizer",
        item: absoluteUrl("/ebay-title-optimizer"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "eBay Title Optimizer",
    url: absoluteUrl("/ebay-title-optimizer"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: LAST_REVIEWED,
    description:
      "Free AI eBay title optimization tool with SEO-focused prompt logic, market-aware output, and scored title variants.",
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to generate SEO-friendly eBay titles with AI",
    description:
      "Step-by-step workflow for creating optimized eBay listing titles using SellerLab AI Title Optimizer.",
    step: [
      {
        "@type": "HowToStep",
        name: "Paste listing input",
        text: "Paste your current eBay title, product name, or listing URL.",
      },
      {
        "@type": "HowToStep",
        name: "Choose optimization options",
        text: "Select marketplace, goal, and title length. Optional advanced settings can refine output.",
      },
      {
        "@type": "HowToStep",
        name: "Generate AI title variants",
        text: "Click Generate AI Titles to get scored variants with keyword coverage and readability signals.",
      },
      {
        "@type": "HowToStep",
        name: "Select and test",
        text: "Use the best variant, monitor CTR and conversion, and iterate with new variants.",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What can I paste into the optimizer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can paste a current title, product name, or eBay listing URL. The tool auto-detects URL input and generates scored title variants.",
        },
      },
      {
        "@type": "Question",
        name: "Can I still customize advanced options?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Advanced settings are available for brand, material, color, size, blocked terms, competitor mode, and field ordering presets.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if the API is unavailable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The page falls back to local title generation so you can keep working without interruption.",
        },
      },
      {
        "@type": "Question",
        name: "Does this AI title generator support SEO-first optimization?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The default mode is SEO-first, emphasizing keyword coverage, relevance, readability, and compliance checks.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use generated titles for A/B testing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The tool provides multiple variants and scoring signals so sellers can test titles and improve click-through and conversion performance.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([breadcrumb, webApp, howTo, faq]),
      }}
    />
  );
}

export default function EbayTitleOptimizerPage() {
  return (
    <div className="container">
      <StructuredData />
      <section className="card" style={{ marginBottom: 12 }}>
        <p className="muted" style={{ margin: 0, fontSize: "var(--fs-content-meta)", lineHeight: 1.6 }}>
          Last reviewed: {LAST_REVIEWED}. Use this tool with current marketplace policies before publishing title changes at scale.
        </p>
      </section>
      <EbayTitleOptimizerClient />
    </div>
  );
}
