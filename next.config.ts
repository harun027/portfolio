import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Temporary imagery only. Replaced by real screenshots in stage 2.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
