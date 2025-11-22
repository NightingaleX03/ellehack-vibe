// Web-specific environment configuration
// This file is used when @env module is imported on web

// Get API key from process.env (injected by webpack DefinePlugin)
export const getApiKey = (): string => {
  if (typeof process !== 'undefined' && process.env) {
    return (process.env as any).GEMINI_API_KEY || '';
  }
  return '';
};

// Export as default for @env module compatibility
const env = {
  GEMINI_API_KEY: getApiKey(),
};

export default env;
export const GEMINI_API_KEY = env.GEMINI_API_KEY;

