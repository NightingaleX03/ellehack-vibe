import {getGoogleMapsApiKey} from '../config/env';
import {Recommendation} from '../types';

/**
 * Google Places API service for location-based searches
 * Uses user's postal code and preferences to find nearby places
 */
export const placesService = {
  /**
   * Search for places near a postal code using Google Places API
   * Note: This requires Places API to be enabled in Google Cloud Console
   */
  async searchNearby(
    query: string,
    postalCode: string,
    category?: string,
    radius: number = 2000 // 2km default
  ): Promise<Recommendation[]> {
    const API_KEY = getGoogleMapsApiKey();
    if (!API_KEY) {
      console.warn('Google Maps API key not found');
      return [];
    }

    try {
      // First, get coordinates from postal code
      const encodedPostalCode = encodeURIComponent(`${postalCode}, Toronto, ON, Canada`);
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPostalCode}&key=${API_KEY}`;
      
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
        console.warn('Geocoding failed for postal code:', postalCode);
        return [];
      }
      
      const location = geocodeData.results[0].geometry.location;
      const lat = location.lat;
      const lng = location.lng;
      
      // Search for places nearby using Places API Text Search
      // Note: This uses the Text Search endpoint which is simpler
      const searchQuery = category 
        ? `${query} ${category} near ${postalCode}`
        : `${query} near ${postalCode}`;
      
      const encodedQuery = encodeURIComponent(searchQuery);
      const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&location=${lat},${lng}&radius=${radius}&key=${API_KEY}`;
      
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();
      
      if (placesData.status !== 'OK' || !placesData.results) {
        console.warn('Places search failed:', placesData.status);
        return [];
      }
      
      // Convert Places API results to Recommendation format
      return placesData.results.slice(0, 7).map((place: any) => {
        // Calculate distance (simple approximation)
        const placeLat = place.geometry.location.lat;
        const placeLng = place.geometry.location.lng;
        const distance = this.calculateDistance(lat, lng, placeLat, placeLng);
        
        return {
          name: place.name,
          category: category || 'general',
          distance: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
          address: place.formatted_address || place.vicinity || '',
          description: place.types?.join(', ') || '',
        };
      });
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  },

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * Returns distance in kilometers
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },
};

