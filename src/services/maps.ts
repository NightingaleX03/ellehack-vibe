/**
 * Maps service for location-based features
 * Works WITHOUT requiring a billing account or API key!
 * Uses free Google Maps search URLs and OpenStreetMap
 */
export const mapsService = {
  /**
   * Get OpenStreetMap URL (FREE - no API key needed)
   * Opens in a new tab with the location
   */
  getOpenStreetMapUrl(postalCode: string): string {
    const encodedLocation = encodeURIComponent(postalCode);
    return `https://www.openstreetmap.org/search?query=${encodedLocation}`;
  },

  /**
   * Get OpenStreetMap embed URL (FREE - no API key needed)
   * For use in iframe - uses Leaflet/OpenStreetMap
   */
  getOpenStreetMapEmbedUrl(lat: number, lng: number, zoom: number = 13): string {
    // Using Leaflet with OpenStreetMap - completely free
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
  },

  /**
   * Get Google Maps search URL (FREE - no API key needed for basic search)
   * Opens Google Maps in browser/app - works without billing account
   */
  getGoogleMapsSearchUrl(query: string, postalCode: string): string {
    const encodedQuery = encodeURIComponent(`${query} near ${postalCode}`);
    // This works without API key - just opens Google Maps
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  },

  /**
   * Get Google Maps search URL (FREE - no API key needed)
   * Alias for getGoogleMapsSearchUrl for backward compatibility
   */
  getSearchUrl(query: string, postalCode: string): string {
    return this.getGoogleMapsSearchUrl(query, postalCode);
  },

  /**
   * Get Google Maps directions URL (FREE - no API key needed)
   * Opens directions in Google Maps
   */
  getDirectionsUrl(from: string, to: string): string {
    const encodedFrom = encodeURIComponent(from);
    const encodedTo = encodeURIComponent(to);
    // This works without API key - just opens Google Maps
    return `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedTo}`;
  },

  /**
   * Get Google Maps place URL (FREE - no API key needed)
   * Opens a place in Google Maps
   */
  getPlaceUrl(placeName: string, postalCode: string): string {
    return this.getGoogleMapsSearchUrl(placeName, postalCode);
  },

  /**
   * Get Google Maps embed URL (REQUIRES API KEY)
   * Uses the Google Maps API key from environment
   */
  getEmbedUrl(postalCode: string, zoom: number = 13): string {
    // Import here to avoid circular dependency
    const {getGoogleMapsApiKey} = require('../config/env');
    const apiKey = getGoogleMapsApiKey();
    
    if (!apiKey) {
      // Fallback to OpenStreetMap if no API key
      console.log('No Google Maps API key found. Using OpenStreetMap instead.');
      return this.getOpenStreetMapUrl(postalCode);
    }
    
    const encodedLocation = encodeURIComponent(postalCode);
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedLocation}&zoom=${zoom}`;
  },
};
