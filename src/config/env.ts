// Environment configuration
// This file helps with TypeScript types for environment variables

// Fallback function to get Gemini API key
export const getApiKey = (): string => {
  // For web, use process.env directly (set by webpack DefinePlugin)
  if (typeof process !== 'undefined' && process.env) {
    if ((process.env as any).GEMINI_API_KEY) {
      return (process.env as any).GEMINI_API_KEY;
    }
  }

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
  return '';
};

// Get Google Maps API key
export const getGoogleMapsApiKey = (): string => {
  // For web, use process.env directly (set by webpack DefinePlugin)
  if (typeof process !== 'undefined' && process.env) {
    if ((process.env as any).GOOGLE_MAPS_API_KEY) {
      return (process.env as any).GOOGLE_MAPS_API_KEY;
    }
  }

  try {
    // Try @env first (configured in babel.config.js)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('@env');
    if (env.GOOGLE_MAPS_API_KEY) {
      return env.GOOGLE_MAPS_API_KEY;
    }
  } catch (e) {
    // Ignore
  }

  try {
    // Fallback to react-native-dotenv
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require('react-native-dotenv');
    if (env.GOOGLE_MAPS_API_KEY) {
      return env.GOOGLE_MAPS_API_KEY;
    }
  } catch (e) {
    // Ignore
  }

  // Final fallback
  return '';
};

