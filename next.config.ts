import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Turbopack configuration to block the SDK at the bundler level
  // This is necessary because Turbopack doesn't use webpack aliases
  turbopack: {
    resolve: {
      // Add aliases to redirect SDK imports to our stub
      aliases: {
        // Block the SDK by aliasing it to our stub
        'z-ai-web-dev-sdk': path.resolve(__dirname, 'src/lib/zai-stub.ts'),
        'zAI': path.resolve(__dirname, 'src/lib/zai-stub.ts'),
      },
    },
  },
  
  // Keep webpack config as fallback for non-Turbopack builds
  // This ensures SDK blocking works in both Turbopack and webpack builds
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
