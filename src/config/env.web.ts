// Web-specific environment configuration
// This file is used when @env module is imported on web

// Get API key from process.env (injected by webpack DefinePlugin)
// Note: webpack DefinePlugin replaces these at build time, so they're already strings
export const getApiKey = (): string => {
  if (typeof process !== 'undefined' && process.env) {
    const key = (process.env as any).GEMINI_API_KEY || '';
    if (key) {
      console.log('✅ Gemini API key loaded, length:', key.length);
    } else {
      console.warn('⚠️ Gemini API key not found in process.env');
      // Debug: show what's actually in process.env
      if (typeof window !== 'undefined') {
        console.warn('Available process.env keys:', Object.keys(process.env || {}).filter(k => k.includes('API') || k.includes('GEMINI')));
      }
    }
    return key;
  }
  console.warn('⚠️ process.env not available');
  return '';
};

// Get Google Maps API key from process.env
export const getGoogleMapsApiKey = (): string => {
  if (typeof process !== 'undefined' && process.env) {
    const key = (process.env as any).GOOGLE_MAPS_API_KEY || '';
    if (key) {
      console.log('✅ Google Maps API key loaded, length:', key.length);
    } else {
      console.warn('⚠️ Google Maps API key not found in process.env');
      // Debug: show what's actually in process.env
      if (typeof window !== 'undefined') {
        console.warn('Available process.env keys:', Object.keys(process.env || {}).filter(k => k.includes('API') || k.includes('MAPS')));
      }
    }
    return key;
  }
  console.warn('⚠️ process.env not available');
  return '';
};

// Export as default for @env module compatibility
const env = {
  GEMINI_API_KEY: getApiKey(),
  GOOGLE_MAPS_API_KEY: getGoogleMapsApiKey(),
};

export default env;
export const GEMINI_API_KEY = env.GEMINI_API_KEY;
export const GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY;

