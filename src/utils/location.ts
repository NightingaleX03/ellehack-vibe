import {storage} from './storage';
import {getGoogleMapsApiKey} from '../config/env';

// Default location: Downtown Toronto
const DEFAULT_POSTAL_CODE = 'M5H 2N2'; // Toronto Financial District
const DEFAULT_LOCATION = 'Downtown Toronto, ON';

export interface LocationInfo {
  postalCode: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Get user's location from profile, with fallback to default Toronto location
 * Also fetches coordinates using Google Geocoding API
 */
export const getLocation = async (): Promise<LocationInfo> => {
  try {
    const profile = await storage.getProfile();
    const postalCode = profile?.postalCode || DEFAULT_POSTAL_CODE;
    const location = profile?.address || DEFAULT_LOCATION;
    
    // Get coordinates from postal code using Google Geocoding API
    const coordinates = await postalCodeToCoordinates(postalCode);
    
    return {
      postalCode,
      location,
      coordinates: coordinates || undefined,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      postalCode: DEFAULT_POSTAL_CODE,
      location: DEFAULT_LOCATION,
    };
  }
};

/**
 * Convert postal code to coordinates using Google Geocoding API
 */
export const postalCodeToCoordinates = async (postalCode: string): Promise<{lat: number; lng: number} | null> => {
  const apiKey = getGoogleMapsApiKey();
  const codeToGeocode = postalCode || DEFAULT_POSTAL_CODE;
  
  // Default coordinates for downtown Toronto
  const defaultCoords = {
    lat: 43.6532,
    lng: -79.3832,
  };
  
  // If no API key, return default coordinates
  if (!apiKey) {
    console.warn('Google Maps API key not found. Using default coordinates.');
    return defaultCoords;
  }
  
  try {
    // Use Google Geocoding API to convert postal code to coordinates
    const encodedPostalCode = encodeURIComponent(`${codeToGeocode}, Toronto, ON, Canada`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPostalCode}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error('Geocoding failed:', data.status, data.error_message || '');
      if (data.status === 'REQUEST_DENIED') {
        console.error('Geocoding API not enabled or API key invalid. Enable Geocoding API in Google Cloud Console.');
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        console.error('Geocoding API quota exceeded. Check usage in Google Cloud Console.');
      }
      return defaultCoords;
    }
  } catch (error) {
    console.error('Error geocoding postal code:', error);
    return defaultCoords;
  }
};

