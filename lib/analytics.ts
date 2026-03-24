import { BRAND } from "@/lib/brand";
type AnalyticsValue = string | number | boolean;
type EventParams = Record<string, AnalyticsValue | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const RETURNING_USER_KEY = BRAND.storageKeys.returningUser;
const LEGACY_RETURNING_USER_KEY = BRAND.storageKeys.returningUserLegacy;

function normalizeHost(host: string): string {
  return host.replace(/^www\./, "").toLowerCase();
}

function getTrafficSource(): string {
  if (typeof window === "undefined") return "unknown";

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  if (utmSource) return utmSource.toLowerCase();

  if (!document.referrer) return "direct";

  try {
    const refHost = normalizeHost(new URL(document.referrer).hostname);
    const curHost = normalizeHost(window.location.hostname);
    if (refHost === curHost) return "internal";
    return refHost;
  } catch {
    return "referral";
  }
}

function getReturningUserFlag(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const existing = window.localStorage.getItem(RETURNING_USER_KEY);
    if (existing === "1") return true;

    const legacyExisting = window.localStorage.getItem(LEGACY_RETURNING_USER_KEY);
    if (legacyExisting === "1") {
      window.localStorage.setItem(RETURNING_USER_KEY, "1");
      return true;
    }

    window.localStorage.setItem(RETURNING_USER_KEY, "1");
    return false;
  } catch {
    return false;
  }
}

function sanitizeParams(params: EventParams): Record<string, AnalyticsValue> {
  const next: Record<string, AnalyticsValue> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      next[key] = value;
    }
  });
  return next;
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    traffic_source: getTrafficSource(),
    is_returning_user: getReturningUserFlag(),
    ...sanitizeParams(params),
  });
}
