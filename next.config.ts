import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ASTRA_DB_NAMESPACE: process.env.ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION: process.env.ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT: process.env.ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN: process.env.ASTRA_DB_APPLICATION_TOKEN,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
