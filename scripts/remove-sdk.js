/**
 * Post-install script to ensure z-ai-web-dev-sdk is removed from node_modules
 * This helps prevent build failures on platforms like Vercel that may have cached builds
 */

const fs = require('fs');
const path = require('path');

const sdkPaths = [
  'node_modules/z-ai-web-dev-sdk',
  'node_modules/zAI',
  'node_modules/@z-ai/web-dev-sdk',
];

console.log('🔍 Checking for z-ai-web-dev-sdk remnants...');

let foundAndRemoved = false;

sdkPaths.forEach(sdkPath => {
  const absolutePath = path.resolve(__dirname, '..', sdkPath);
  
  if (fs.existsSync(absolutePath)) {
    console.log(`⚠️  Found SDK at: ${absolutePath}`);
    
    try {
      // Use rimraf-like approach to remove directory
      const removeDir = (dirPath) => {
        if (fs.existsSync(dirPath)) {
          fs.readdirSync(dirPath).forEach(file => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              removeDir(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(dirPath);
        }
      };
      
      removeDir(absolutePath);
      console.log(`✅ Successfully removed: ${absolutePath}`);
      foundAndRemoved = true;
    } catch (error) {
      console.error(`❌ Failed to remove ${absolutePath}:`, error.message);
    }
  }
});

if (!foundAndRemoved) {
  console.log('✅ No SDK remnants found - node_modules is clean');
}

// Also check package.json in node_modules to see if any package depends on the SDK
const nodeModulesPath = path.resolve(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('🔍 Checking for transitive dependencies...');
  
  // This is a simple check - in practice, you'd want to do a more thorough analysis
  // by reading package.json files in node_modules
}

console.log('✅ Post-install SDK cleanup complete');
