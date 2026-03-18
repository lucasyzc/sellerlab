import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tools/ebay-fee-calculator",
        destination: "/ebay-fee-calculator",
        permanent: true,
      },
      {
        source: "/tools/ebay-fee-calculator/:market",
        destination: "/ebay-fee-calculator/:market",
        permanent: true,
      },
      {
        source: "/tools/amazon-fee-calculator",
        destination: "/amazon-fee-calculator",
        permanent: true,
      },
      {
        source: "/tools/amazon-fee-calculator/:market",
        destination: "/amazon-fee-calculator/:market",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
