import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lead Captured | SellerLab",
  description: "Lead form was submitted successfully.",
  robots: {
    index: false,
    follow: false
  }
};

export default function LeadSuccessPage() {
  return (
    <div className="container">
      <section className="card" style={{ padding: 28 }}>
        <p style={{ marginTop: 0, marginBottom: 10, color: "#0f766e", fontWeight: 600 }}>
          Email submitted successfully
        </p>
        <h1 style={{ marginTop: 0, marginBottom: 12 }}>感谢提交，我们会尽快联系你</h1>
        <p className="muted" style={{ marginTop: 0, lineHeight: 1.65 }}>
          你已经进入 SellerLab 工具站的优先体验名单。下一步可以先继续使用 eBay Fee Calculator，
          或者返回首页查看后续将上线的高意图工具。
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/ebay-fee-calculator">
            返回工具继续测算
          </Link>
          <Link className="btn btn-secondary" href="/">
            回到 Landing
          </Link>
        </div>
      </section>
    </div>
  );
}
