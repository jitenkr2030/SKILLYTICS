import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Webpack configuration for SDK blocking
  // Note: Turbopack doesn't use webpack aliases, so this may not work in Turbopack builds
  // For Turbopack, we'll need to find an alternative solution
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
