"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentState = "pending" | "accepted" | "rejected";

const STORAGE_KEY = "sellerlab_cookie_consent";

export function getConsentState(): ConsentState {
  if (typeof window === "undefined") return "pending";
  return (localStorage.getItem(STORAGE_KEY) as ConsentState) || "pending";
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const state = getConsentState();
    if (state === "pending") {
      setVisible(true);
    }
    if (state === "accepted") {
      window.dispatchEvent(new Event("cookie-consent-accepted"));
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="container">
        <div className="cookie-inner">
          <p className="cookie-text">
            We use cookies for analytics and advertising to improve your
            experience. By clicking &quot;Accept All,&quot; you consent to the
            use of cookies including Google Analytics and Google AdSense. Read
            our <Link href="/privacy-policy">Privacy Policy</Link> for details.
          </p>
          <div className="cookie-actions">
            <button className="btn btn-secondary" onClick={reject}>
              Reject
            </button>
            <button className="btn btn-primary" onClick={accept}>
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
