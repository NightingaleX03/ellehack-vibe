// Environment configuration
// This file helps with TypeScript types for environment variables

// Fallback function to get API key
export const getApiKey = (): string => {
  try {
    // Try @env first (configured in babel.config.js)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('@env');
    if (env.GEMINI_API_KEY) {
      return env.GEMINI_API_KEY;
    }
  } catch (e) {
    // Ignore
  }

  try {
    // Fallback to react-native-dotenv
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('react-native-dotenv');
    if (env.GEMINI_API_KEY) {
      return env.GEMINI_API_KEY;
    }
  } catch (e) {
    // Ignore
  }

  // Final fallback
  return (process.env as any).GEMINI_API_KEY || '';
};

