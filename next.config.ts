import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  images: {
    domains: ['*.googleusercontent.com'],
  },
  // Increase the API response timeout for Gemini API calls
  // api: {
  //   responseLimit: '8mb',
  //   bodyParser: {
  //     sizeLimit: '8mb',
  //   },
  // },
};

export default nextConfig;
