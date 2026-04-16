import type { Metadata } from "next";
import BlogIndexClient from "./blog-index-client";
import { getAllBlogEntries, getFeaturedBlogEntry } from "@/lib/blog";
import { withSuiteBrand } from "@/lib/brand";

export const metadata: Metadata = {
  title: withSuiteBrand("Seller Blog"),
  description:
    "Seller-focused blog coverage for marketplace fee updates, pricing playbooks, and practical margin strategy.",
  alternates: {
    canonical: "/updates",
  },
  openGraph: {
    title: withSuiteBrand("Seller Blog"),
    description:
      "Read seller-focused insights on fee changes, pricing strategy, and operating playbooks across major marketplaces.",
    url: "/updates",
    type: "website",
  },
};

export default function UpdatesIndexPage() {
  const entries = getAllBlogEntries();
  const featuredEntry = getFeaturedBlogEntry();

  return <BlogIndexClient entries={entries} featuredEntry={featuredEntry} />;
}
