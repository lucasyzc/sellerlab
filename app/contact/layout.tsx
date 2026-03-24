import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, withMasterBrand } from "@/lib/brand";

export const metadata: Metadata = {
  title: withMasterBrand("Contact Us"),
  description:
    "Contact Data EDE for support, feedback, or partnership. SellerLab Suite users can report fee model issues and request features.",
  keywords: [
    "contact data ede",
    "report calculator issue",
    "seller tool support",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: withMasterBrand("Contact Us"),
    description:
      "Report fee model issues, suggest new tools, or send business inquiries to Data EDE.",
    url: "/contact",
    type: "website",
    siteName: BRAND.masterName,
  },
  twitter: {
    card: "summary",
    title: withMasterBrand("Contact Us"),
    description: "Get support or share feedback about SellerLab Suite tools.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Data EDE",
    url: absoluteUrl("/contact"),
    description:
      "Contact page for Data EDE. Reach out for support, feedback, and partnership inquiries.",
    mainEntity: {
      "@type": "Organization",
      name: BRAND.masterName,
      hasPart: {
        "@type": "Product",
        name: BRAND.suiteName,
        alternateName: BRAND.suiteDisplay,
      },
      url: absoluteUrl("/"),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BRAND.supportEmail,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}


