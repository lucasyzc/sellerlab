import type { BlogCategory, BlogPlatform } from "@/lib/blog";

export function formatBlogCategoryLabel(category: BlogCategory): string {
  const labels: Record<BlogCategory, string> = {
    "fee-updates": "Fee Updates",
    "pricing-margin": "Pricing & Margin",
    "marketplace-strategy": "Marketplace Strategy",
    "tool-guides": "Tool Guides",
  };

  return labels[category];
}

export function formatBlogPlatformLabel(platform: BlogPlatform): string {
  const labels: Record<BlogPlatform, string> = {
    amazon: "Amazon",
    ebay: "eBay",
    "tiktok-shop": "TikTok Shop",
    shopify: "Shopify",
    walmart: "Walmart",
    general: "General",
  };

  return labels[platform];
}
