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
  webpack: (config, { isServer }) => {
    // Calculate the path to our stub file
    const stubPath = path.resolve(__dirname, 'src/lib/zai-stub.ts');
    
    // Verify stub file exists
    if (!fs.existsSync(stubPath)) {
      console.error('⚠️ ZAI Stub file not found at:', stubPath);
    } else {
      console.log('✓ ZAI Stub file found at:', stubPath);
    }

    // Create an empty stub file for backup
    const emptyStubPath = path.resolve(__dirname, 'src/lib/empty-stub.ts');
    fs.writeFileSync(emptyStubPath, '// Empty stub for SDK blocking\nmodule.exports = {};');
    console.log('✓ Created empty stub at:', emptyStubPath);

    // Layer 1: Webpack aliases - Block all possible SDK import paths
    config.resolve.alias = {
      ...config.resolve.alias,
      // Block the SDK by aliasing it to our stub
      'z-ai-web-dev-sdk': stubPath,
      'zAI': stubPath,
      '@z-ai/web-dev-sdk': stubPath,
      '@z-ai': stubPath,
    };

    // Layer 2: Ensure .ts files are resolved correctly
    if (!config.resolve.extensions) {
      config.resolve.extensions = ['.ts', '.tsx', '.js', '.mjs', '.json'];
    } else {
      if (!config.resolve.extensions.includes('.ts')) {
        config.resolve.extensions.push('.ts');
      }
    }

    // Layer 3: Force mainFields for package resolution
    config.resolve.mainFields = ['module', 'main', 'browser'];

    // Layer 4: Make SDK packages external - they won't be bundled
    // This ensures that even if the SDK is imported, it won't be included in the bundle
    if (isServer) {
      config.externals = config.externals || [];
      
      // Add SDK packages as externals with empty object
      const externalSDK = (context, request, callback) => {
        if (
          request.includes('z-ai-web-dev-sdk') ||
          request.includes('zAI') ||
          request.includes('@z-ai/web-dev-sdk') ||
          request.includes('@z-ai')
        ) {
          console.log('🎯 Intercepted SDK import:', request);
          // Return empty object instead of the real SDK
          return callback(null, `module.exports = {};`);
        }
        callback();
      };
      
      // Insert at the beginning of externals
      config.externals.unshift(externalSDK);
    }

    // Log the alias configuration for debugging
    console.log('✓ Webpack SDK alias configuration applied');
    console.log('  z-ai-web-dev-sdk ->', config.resolve.alias['z-ai-web-dev-sdk']);
    console.log('  zAI ->', config.resolve.alias['zAI']);

    return config;
  },
};

export default nextConfig;
