/**
 * Stub implementation of z-ai-web-dev-sdk to prevent build failures
 * This module provides a no-op implementation that doesn't require API keys
 * 
 * IMPORTANT: If you see an error about "Neither apiKey nor config.authenticator provided",
 * it means the REAL SDK is still being bundled somewhere. Check that webpack aliases are working.
 */

// Export all expected SDK types and functions
export interface AIConfig {
  apiKey?: string;
  authenticator?: string;
  baseUrl?: string;
  model?: string;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  timestamp?: string;
}

// Export a class that can be instantiated without arguments
export class ZAI {
  private config: AIConfig = {};
  
  constructor(config?: AIConfig) {
    // Accept config but don't require apiKey or authenticator
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }
  
  configure(config: AIConfig) {
    this.config = { ...this.config, ...config };
  }
  
  chat(message: string, context?: Record<string, any>): Promise<AIResponse> {
    return Promise.resolve({
      text: `AI Chat Response: ${message}`,
      suggestions: ['Check your code syntax', 'Review the mission requirements'],
      timestamp: new Date().toISOString()
    });
  }
  
  generateCode(prompt: string, language: string = 'javascript'): Promise<string> {
    return Promise.resolve(`// Generated code for: ${prompt}\nconsole.log("Placeholder code generation");`);
  }
  
  analyzeCode(code: string): Promise<{
    issues: string[];
    suggestions: string[];
    score: number;
  }> {
    return Promise.resolve({
      issues: [],
      suggestions: ['Code looks good!'],
      score: 100
    });
  }
}

// Export singleton instance
const zAI = new ZAI();
export default zAI;

// Named exports for compatibility
export const initZAI = (config: AIConfig) => {
  zAI.configure(config);
};

export const chat = (message: string, context?: Record<string, any>) => {
  return zAI.chat(message, context);
};
