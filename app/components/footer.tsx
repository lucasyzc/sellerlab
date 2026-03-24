import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" style={{ fontWeight: 700, fontSize: 18 }}>
              {BRAND.masterName}
            </Link>
            <p>
              {BRAND.masterTagline}. {BRAND.suiteLabel} provides free fee calculators and
              seller tools for cross-border e-commerce.
            </p>
          </div>

          <div className="footer-col">
            <h4>{BRAND.suiteLabel}</h4>
            <ul>
              <li>
                <Link href="/ebay-fee-calculator">eBay Fee Calculator</Link>
              </li>
              <li>
                <Link href="/amazon-fee-calculator">Amazon Fee Calculator</Link>
              </li>
              <li>
                <Link href="/tiktok-shop-fee-calculator">TikTok Shop Fee Calculator</Link>
              </li>
              <li>
                <Link href="/shopify-fee-calculator">Shopify Cost Calculator</Link>
              </li>
              <li>
                <Link href="/ebay-title-optimizer">eBay Title Optimizer</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} {BRAND.masterName}. All rights reserved.</p>
          <p>
            {BRAND.suiteName} is a product suite by {BRAND.masterName}.{" "}
            Not affiliated with eBay, Amazon, or any other marketplace.
            Fee data is for estimation purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
