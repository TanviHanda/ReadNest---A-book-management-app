import type { NextConfig } from "next";
import "@/lib/env"
const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      }
    ]
  }
};

export default nextConfig;
