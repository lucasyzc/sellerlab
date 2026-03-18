import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - SellerLab",
  description:
    "Get in touch with the SellerLab team. Report fee errors, suggest features, or ask questions about our cross-border seller tools.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
