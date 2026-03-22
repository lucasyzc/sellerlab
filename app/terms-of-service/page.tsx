import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Terms of Service - SellerLab",
  description:
    "Read the terms and conditions governing your use of SellerLab's seller tools, fee calculators, and website services.",
  keywords: ["terms of service", "sellerlab terms", "calculator disclaimer"],
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service - SellerLab",
    description:
      "Terms and conditions for using SellerLab tools and website services.",
    url: "/terms-of-service",
    type: "article",
    siteName: "SellerLab",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - SellerLab",
    description: "Understand usage terms and service limitations for SellerLab.",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service - SellerLab",
            url: absoluteUrl("/terms-of-service"),
            dateModified: "2026-03-18",
          }),
        }}
      />
      <article className="legal-page">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: March 18, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using SellerLab (&quot;the Website&quot;), you agree
            to be bound by these Terms of Service. If you do not agree to all of
            these terms, you must not use the Website.
          </p>
        </section>

        <section>
          <h2>2. Description of Services</h2>
          <p>
            SellerLab provides free online tools for cross-border e-commerce
            sellers, including but not limited to:
          </p>
          <ul>
            <li>eBay Fee Calculator for multiple marketplaces</li>
            <li>Amazon FBA Fee Calculator for multiple marketplaces</li>
            <li>Other seller tools as they become available</li>
          </ul>
          <p>
            These tools are provided for informational and estimation purposes
            only.
          </p>
        </section>

        <section>
          <h2>3. Disclaimer of Accuracy</h2>
          <p>
            While we strive to keep our fee data and calculation logic as
            accurate and up-to-date as possible, we make no guarantees regarding
            the accuracy, completeness, or timeliness of the information
            provided. Fee structures on platforms such as eBay, Amazon, and
            others may change at any time without notice.
          </p>
          <p>
            <strong>
              You should always verify fees directly with the respective
              platform before making business decisions.
            </strong>{" "}
            SellerLab is not liable for any financial losses arising from
            reliance on our calculations.
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this Website, including text, code, design, logos, and
            tool interfaces, is the property of SellerLab and is protected by
            applicable intellectual property laws. You may not reproduce,
            distribute, or create derivative works without prior written consent.
          </p>
          <p>
            Platform names and logos (eBay, Amazon, etc.) are trademarks of their
            respective owners. SellerLab is not affiliated with or endorsed by
            any of these platforms.
          </p>
        </section>

        <section>
          <h2>5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use automated systems (bots, scrapers) to access the Website in a
              manner that degrades service for other users
            </li>
            <li>
              Attempt to interfere with or compromise the integrity of the
              Website
            </li>
            <li>Use the Website for any unlawful purpose</li>
            <li>
              Reproduce or redistribute our tools or content without permission
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Advertising</h2>
          <p>
            The Website may display third-party advertisements, including
            through Google AdSense. We are not responsible for the content of
            third-party advertisements or the products and services they
            promote. Clicking on advertisements is at your own discretion and
            risk.
          </p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SellerLab and its operators
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Website or tools, including but not limited to errors in fee
            calculations, lost profits, or business interruption.
          </p>
        </section>

        <section>
          <h2>8. Third-Party Links</h2>
          <p>
            The Website may contain links to third-party websites. We are not
            responsible for the content, privacy practices, or availability of
            these external sites.
          </p>
        </section>

        <section>
          <h2>9. Modifications</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued
            use of the Website after changes constitutes acceptance of the
            updated Terms. We encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            applicable laws, without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            If you have questions about these Terms, please{" "}
            <Link href="/contact">contact us</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
