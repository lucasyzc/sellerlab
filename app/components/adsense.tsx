"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsentState } from "./cookie-consent";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSense() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID) return;

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

  if (!ADSENSE_CLIENT_ID || !enabled) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
