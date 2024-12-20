import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

module.exports = {
  env: {
    API_HOST: 'http://localhost:3200',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/account123/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3200',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
