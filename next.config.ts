import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Empty turbopack config to silence warning about webpack config without turbopack
  turbopack: {},
  
  // Enhanced webpack configuration for SDK blocking with multiple layers of protection
  webpack: (config, { isServer, nextRuntime, nextVersion }) => {
    // Calculate the path to our stub file
    const stubPath = path.resolve(__dirname, 'src/lib/zai-stub.ts');
    
    // Verify stub file exists
    if (!fs.existsSync(stubPath)) {
      console.error('⚠️ ZAI Stub file not found at:', stubPath);
    } else {
      console.log('✓ ZAI Stub file found at:', stubPath);
    }

    // Layer 1: Webpack aliases to redirect SDK imports to stub
    config.resolve.alias = {
      ...config.resolve.alias,
      // Block the SDK by aliasing it to our stub
      'z-ai-web-dev-sdk': stubPath,
      'zAI': stubPath,
      '@z-ai/web-dev-sdk': stubPath,
      '@z-ai': stubPath,
    };

    // Layer 2: Fallback resolution for when aliases don't work
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'z-ai-web-dev-sdk': false,
      'zAI': false,
      '@z-ai/web-dev-sdk': false,
      '@z-ai': false,
    };

    // Layer 3: External configuration - exclude SDK from bundling
    if (!config.externals) {
      config.externals = [];
    }
    
    // Note: IgnorePlugin requires direct webpack access which is not available in Next.js 16
    // The alias and fallback configurations above should be sufficient to block the SDK

    // Log the alias configuration for debugging
    console.log('✓ Webpack SDK alias configuration applied');
    console.log('  z-ai-web-dev-sdk ->', config.resolve.alias['z-ai-web-dev-sdk']);
    console.log('  zAI ->', config.resolve.alias['zAI']);

    return config;
  },
};

export default nextConfig;
