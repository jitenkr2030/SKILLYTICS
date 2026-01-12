import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Empty turbopack config to silence warning about webpack config without turbopack
  // This allows webpack config to work alongside Turbopack for SDK blocking
  turbopack: {},
  
  // Webpack configuration for SDK blocking (if webpack is used)
  // Note: Turbopack is the default in Next.js 16, but webpack config is kept for compatibility
  webpack: (config, { isServer }) => {
    // Add webpack aliases to redirect SDK imports to stub
    config.resolve.alias = {
      ...config.resolve.alias,
      // Block the SDK by aliasing it to our stub
      'z-ai-web-dev-sdk': path.resolve(__dirname, 'src/lib/zai-stub.ts'),
      'zAI': path.resolve(__dirname, 'src/lib/zai-stub.ts'),
    };

    // Add a fallback for the SDK in case it's resolved through node_modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'z-ai-web-dev-sdk': false,
      'zAI': false,
    };

    return config;
  },
};

export default nextConfig;
