import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  reactStrictMode: false,
  images: {
    domains: [
      'scontent.fhan2-3.fna.fbcdn.net',
      'external.fhan2-4.fna.fbcdn.net',
      'scontent.fhan14-4.fna.fbcdn.net',
      'scontent.fhan14-5.fna.fbcdn.net',
      'www.facebook.com'
    ],
  },
};

export default nextConfig;
