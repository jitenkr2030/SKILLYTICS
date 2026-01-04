import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Explicitly configure turbopack to allow webpack config to work alongside it
  turbopack: {
    rules: {
      // Route TypeScript and JavaScript files through webpack for SDK blocking
      '*.ts': ['webpack'],
      '*.tsx': ['webpack'],
      '*.js': ['webpack'],
      '*.jsx': ['webpack'],
    },
  },
  
  // Block the problematic SDK at the webpack bundler level
  // This ensures that even if the SDK is pulled in as a transitive dependency,
  // any imports will be redirected to our stub implementation
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
