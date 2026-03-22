import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About SellerLab - Free Tools for Cross-border Sellers",
  description:
    "SellerLab provides free, accurate fee calculators and seller tools for eBay, Amazon, and more. Learn about our mission to help cross-border sellers succeed.",
  keywords: [
    "about sellerlab",
    "cross-border seller tools",
    "ecommerce fee calculator team",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About SellerLab - Free Tools for Cross-border Sellers",
    description:
      "Learn about SellerLab's mission to help cross-border ecommerce sellers make better pricing and profit decisions.",
    url: "/about",
    type: "article",
    siteName: "SellerLab",
  },
  twitter: {
    card: "summary",
    title: "About SellerLab",
    description: "Our mission, expertise, and commitment to accurate seller tools.",
  },
};

export default function AboutPage() {
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About SellerLab",
            url: absoluteUrl("/about"),
            description:
              "SellerLab provides free, accurate fee calculators and seller tools for cross-border ecommerce sellers.",
          }),
        }}
      />
      <article className="legal-page">
        <h1>About SellerLab</h1>

        <section>
          <h2>Our Mission</h2>
          <p>
            SellerLab was built with a simple goal: to give cross-border
            e-commerce sellers the free, accurate tools they need to make
            informed business decisions. We believe that every seller — whether
            just starting out or running a large operation — deserves access to
            reliable fee calculators and business planning tools without hidden
            costs.
          </p>
        </section>

        <section>
          <h2>What We Offer</h2>
          <p>
            We develop and maintain a suite of specialized seller tools covering
            major e-commerce platforms and marketplaces worldwide:
          </p>
          <ul>
            <li>
              <strong>
                <Link href="/ebay-fee-calculator">eBay Fee Calculator</Link>
              </strong>{" "}
              — Supporting 7 marketplaces (US, UK, Germany, Australia, Canada,
              France, Italy) with complete final value fee, payment processing,
              and profit calculations.
            </li>
            <li>
              <strong>
                <Link href="/amazon-fee-calculator">
                  Amazon FBA Fee Calculator
                </Link>
              </strong>{" "}
              — Covering 17 marketplaces worldwide with referral fees, FBA
              fulfillment fees, storage costs, and net profit analysis.
            </li>
            <li>
              <strong>More tools coming soon</strong> — Including calculators
              for TikTok Shop, Shopify, Walmart, and more.
            </li>
          </ul>
        </section>

        <section>
          <h2>Our Expertise</h2>
          <p>
            Our team has hands-on experience in cross-border e-commerce, having
            sold on multiple platforms across different markets. This
            first-hand knowledge drives the accuracy and practical design of
            our tools. We continuously update our fee data and calculation
            logic to reflect the latest platform policies and rate changes.
          </p>
        </section>

        <section>
          <h2>Accuracy &amp; Transparency</h2>
          <p>
            We take accuracy seriously. Our calculators are built by
            carefully studying official platform documentation, seller
            announcements, and real-world fee structures. Each market
            configuration is thoroughly tested against known fee scenarios.
          </p>
          <p>
            That said, platform fees can change at any time. We always recommend
            verifying final fees with the respective platform before making
            important business decisions.
          </p>
        </section>

        <section>
          <h2>Why Free?</h2>
          <p>
            We believe essential seller tools should be accessible to
            everyone. SellerLab is supported by advertising, which allows us to
            keep all tools completely free. We are committed to maintaining a
            clean, user-friendly experience while displaying relevant,
            non-intrusive ads.
          </p>
        </section>

        <section>
          <h2>Get in Touch</h2>
          <p>
            Have feedback, suggestions, or found an error in our calculations?
            We&apos;d love to hear from you.{" "}
            <Link href="/contact">Contact us</Link> and help us make SellerLab
            even better.
          </p>
        </section>
      </article>
    </div>
  );
}
