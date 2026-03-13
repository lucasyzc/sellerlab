import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SellerLab - 跨境电商卖家工具站",
  description: "覆盖 eBay、Amazon、TikTok Shop、Shopify 等主流平台，支持 US、UK、DE 等 17+ 站点市场的一站式费率测算与运营工具。"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <header style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
          <div
            className="container"
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Link href="/" style={{ fontWeight: 700 }}>
              SellerLab
            </Link>
            <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 500 }}>
              <Link href="/">首页</Link>
              <Link href="/#tools">工具</Link>
              <Link href="/ebay-fee-calculator">eBay 费率计算</Link>
            </nav>
          </div>
        </header>
        <main style={{ padding: "24px 0 40px" }}>{children}</main>
      </body>
    </html>
  );
}
