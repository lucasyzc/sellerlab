export const BRAND = {
  masterName: "Data EDE",
  masterTagline: "Ecommerce Data Engine",
  suiteName: "SellerLab",
  suiteLabel: "SellerLab Suite",
  suiteDisplay: "SellerLab by Data EDE",
  supportEmail: "support@dataede.com",
  supportMailto: "mailto:support@dataede.com",
  storageKeys: {
    returningUser: "dataede_returning_user",
    returningUserLegacy: "sellerlab_returning_user",
    cookieConsent: "dataede_cookie_consent",
    cookieConsentLegacy: "sellerlab_cookie_consent",
  },
} as const;

export function withMasterBrand(title: string): string {
  return `${title} | ${BRAND.masterName}`;
}

export function withSuiteBrand(title: string): string {
  return `${title} | ${BRAND.suiteDisplay}`;
}
