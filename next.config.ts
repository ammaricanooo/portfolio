import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local public/ images are served by default — no config needed.
    // Add remotePatterns here only if fetching images from external domains.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
