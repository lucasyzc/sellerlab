import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact Us - SellerLab",
  description:
    "Get in touch with the SellerLab team. Report fee errors, suggest features, or ask questions about our cross-border seller tools.",
  keywords: [
    "contact sellerlab",
    "report calculator issue",
    "seller tool support",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact SellerLab",
    description:
      "Report fee model issues, suggest new tools, or send business inquiries to SellerLab.",
    url: "/contact",
    type: "website",
    siteName: "SellerLab",
  },
  twitter: {
    card: "summary",
    title: "Contact SellerLab",
    description: "Get support or share feedback about SellerLab tools.",
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
    name: "Contact SellerLab",
    url: absoluteUrl("/contact"),
    description:
      "Contact page for SellerLab. Reach out for support, feedback, and partnership inquiries.",
    mainEntity: {
      "@type": "Organization",
      name: "SellerLab",
      url: absoluteUrl("/"),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@sellerlab.tools",
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
