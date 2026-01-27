import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.htailors.shop",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
