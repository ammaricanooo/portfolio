import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source: "/about",
        destination: "/en/about",
        permanent: false,
      },
      {
        source: "/work",
        destination: "/en/work",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
