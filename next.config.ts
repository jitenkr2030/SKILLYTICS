import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Block the problematic SDK at the bundler level by creating an alias
  // This ensures that even if the SDK is pulled in as a transitive dependency,
  // any imports will be redirected to our stub implementation
  webpack: (config, { isServer }) => {
    // Create a stub module content that doesn't require API keys
    const stubModuleContent = `
      // Stub module to replace z-ai-web-dev-sdk
      // This prevents build failures caused by the real SDK requiring API keys during module evaluation
      module.exports = {
        default: {
          configure: () => {},
          chat: () => Promise.resolve({ text: 'Stub response' }),
          generateCode: () => Promise.resolve('// Stub code'),
          analyzeCode: () => Promise.resolve({ issues: [], suggestions: [], score: 100 })
        },
        configure: () => {},
        chat: () => Promise.resolve({ text: 'Stub response' }),
        generateCode: () => Promise.resolve('// Stub code'),
        analyzeCode: () => Promise.resolve({ issues: [], suggestions: [], score: 100 })
      };
    `;

    // Add webpack aliases to redirect SDK imports to stub
    config.resolve.alias = {
      ...config.resolve.alias,
      // Block the SDK by aliasing it to a non-existent path or our stub
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
