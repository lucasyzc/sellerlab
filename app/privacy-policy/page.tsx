import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, withMasterBrand } from "@/lib/brand";

export const metadata: Metadata = {
  title: withMasterBrand("Privacy Policy"),
  description:
    "Learn how Data EDE collects, uses, and protects personal information across dataede.com and the SellerLab Suite.",
  keywords: ["privacy policy", "data ede privacy", "cookie policy", "data protection"],
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: withMasterBrand("Privacy Policy"),
    description:
      "How Data EDE collects, uses, and protects personal information and cookie preferences.",
    url: "/privacy-policy",
    type: "article",
    siteName: BRAND.masterName,
  },
  twitter: {
    card: "summary",
    title: withMasterBrand("Privacy Policy"),
    description: "Read how data, cookies, and analytics are handled at Data EDE.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy - Data EDE",
            url: absoluteUrl("/privacy-policy"),
            dateModified: "2026-03-18",
          }),
        }}
      />
      <article className="legal-page">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: March 18, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Data EDE (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), including the SellerLab Suite. We are committed
            to protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, we may automatically collect certain
            information, including:
          </p>
          <ul>
            <li>
              Browser type, version, and language preferences
            </li>
            <li>Operating system and device information</li>
            <li>IP address and approximate geographic location</li>
            <li>Pages visited, time spent, and referring URLs</li>
            <li>Interaction data with our calculator tools</li>
          </ul>

          <h3>Information You Provide</h3>
          <p>
            If you contact us through our contact page, we collect the
            information you voluntarily provide, such as your name and email
            address.
          </p>
        </section>

        <section>
          <h2>3. Cookies and Tracking Technologies</h2>
          <p>We use the following types of cookies:</p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for basic site
              functionality, such as remembering your cookie consent preference.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> We use Google Analytics (GA4)
              to understand how visitors interact with our site. These cookies
              collect anonymized data about page views, session duration, and
              user behavior.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> We may use Google AdSense to
              display advertisements. AdSense may use cookies to serve ads based
              on your prior visits to this or other websites. You can opt out of
              personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </li>
          </ul>
          <p>
            You can manage your cookie preferences at any time using our cookie
            consent banner. Most web browsers also allow you to control cookies
            through their settings.
          </p>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our seller tools and calculators</li>
            <li>Analyze website usage to improve user experience</li>
            <li>Display relevant advertisements through Google AdSense</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li>
              <strong>Google Analytics:</strong> For website analytics.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google AdSense:</strong> For displaying advertisements.{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses cookies in advertising
              </a>
            </li>
            <li>
              <strong>Vercel:</strong> For website hosting and deployment.{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain automatically collected data for as long as necessary to
            fulfill the purposes outlined in this policy. Analytics data is
            retained according to Google Analytics default retention settings.
            Contact form submissions are retained for up to 12 months.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of the data we hold about
              you.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal data.
            </li>
            <li>
              <strong>Opt-Out:</strong> Opt out of analytics tracking and
              personalized advertising via our cookie consent banner.
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate
              information.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please{" "}
            <Link href="/contact">contact us</Link>.
          </p>
        </section>

        <section>
          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under the age of 13. We do
            not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date. We encourage you
            to review this page periodically.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please{" "}
            <Link href="/contact">contact us</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}

