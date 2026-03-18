"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsentState } from "./cookie-consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    if (getConsentState() === "accepted") {
      setEnabled(true);
    }

    function onConsent() {
      setEnabled(true);
    }

    window.addEventListener("cookie-consent-accepted", onConsent);
    return () =>
      window.removeEventListener("cookie-consent-accepted", onConsent);
  }, []);

  if (!GA_MEASUREMENT_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
