import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://election-guide-ai-backend-bmb4e3v2mq-uc.a.run.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
