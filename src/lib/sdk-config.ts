// Global SDK configuration
// This file ensures that the z-ai-web-dev-sdk stub is loaded early in the application lifecycle
// to prevent build failures caused by the real SDK requiring API keys during module evaluation

// Import the stub to ensure it's loaded and takes precedence over any accidental imports
import '@/lib/zai-stub'

// Log a warning to help with debugging
if (typeof window !== 'undefined') {
  console.warn('⚠️ AI SDK stub loaded - using local mentor logic instead of remote AI')
}
