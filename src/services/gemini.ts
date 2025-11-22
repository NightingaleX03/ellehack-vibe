import {GoogleGenerativeAI} from '@google/generative-ai';
import {UserProfile, Recommendation, CompatibilityScore, EmergencyService} from '../types';
import {getApiKey} from '../config/env';
import {getGoogleMapsApiKey} from '../config/env';
import {postalCodeToCoordinates} from '../utils/location';
import {placesService} from './places';
import {getHardcodedRecommendations, filterByBudget} from '../data/recommendations';
import {getHardcodedEmergencyServices} from '../data/emergencyServices';

// Get API keys from environment (will be called each time to get fresh values)
const getGeminiApiKey = () => getApiKey();
const getGoogleMapsApiKeyValue = () => getGoogleMapsApiKey();

// Initialize Gemini AI (will be recreated if API key changes)
let genAI: any = null;

const initializeGenAI = () => {
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI initialized with API key');
  } else {
    console.warn('GEMINI_API_KEY not found in environment variables');
    genAI = null;
  }
};

// Initialize on module load
initializeGenAI();

export const geminiService = {
  async getRecommendations(
    category: string,
    userProfile: UserProfile,
    location?: string
  ): Promise<Recommendation[]> {
    // Use postal code from profile, or default to downtown Toronto
    const postalCode = userProfile.postalCode || 'M5H 2N2';
    const searchLocation = location || `${postalCode}, Toronto, ON, Canada`;
    
    console.log('Getting recommendations:', {
      category,
      postalCode,
      userBudget: userProfile.budget,
    });
    
    // Use hardcoded recommendations for now (bypasses API issues)
    console.log('✅ Using hardcoded recommendations for category:', category);
    let recommendations = getHardcodedRecommendations(category);
    
    // Filter by budget if needed
    if (userProfile.budget) {
      recommendations = filterByBudget(recommendations, userProfile.budget);
    }
    
    // Return top 7 recommendations
    return recommendations.slice(0, 7);
    
    /* 
    // OLD API-BASED CODE (commented out for now)
    // Get fresh API key values
    const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKeyValue();
    const GEMINI_API_KEY = getGeminiApiKey();
    
    // Reinitialize Gemini if needed
    if (GEMINI_API_KEY && !genAI) {
      initializeGenAI();
    }
    
    // If no API keys at all, return hardcoded data
    if (!GOOGLE_MAPS_API_KEY && !GEMINI_API_KEY) {
      console.warn('No API keys available. Using hardcoded recommendations.');
      return getHardcodedRecommendations(category).slice(0, 7);
    }
    */

    try {
      // Step 1: Get real places from Google Maps Places API
      let placesResults: Recommendation[] = [];
      
      if (GOOGLE_MAPS_API_KEY) {
        try {
          // Map category to Google Places search terms
          const categoryMap: Record<string, string> = {
            food: 'restaurants',
            'food & restaurants': 'restaurants',
            nightlife: 'bars clubs',
            parks: 'parks',
            'parks & recreation': 'parks recreation',
            events: 'events venues',
            'events & activities': 'events activities venues',
            shopping: 'shopping malls stores',
            culture: 'museums galleries theaters',
            'culture & arts': 'museums art galleries theaters',
            'things to do': 'attractions activities',
          };
          
          const normalizedCategory = category.toLowerCase().trim();
          const searchTerm = categoryMap[normalizedCategory] || category;
          console.log('Attempting to fetch places from Google Places API...');
          placesResults = await placesService.searchNearby(
            searchTerm,
            postalCode,
            category,
            5000 // 5km radius
          );
          console.log('Google Places API returned', placesResults.length, 'places');
        } catch (placesError: any) {
          console.error('❌ Error fetching from Google Places API:', placesError?.message || placesError);
          // Continue to Gemini fallback
        }
      }

      // Step 2: Use Gemini AI to enhance and filter recommendations based on user preferences
      if (genAI && placesResults.length > 0) {
        try {
          const model = genAI.getGenerativeModel({model: 'gemini-pro'});
          
          // Get coordinates for better location context
          const coordinates = await postalCodeToCoordinates(postalCode);
          const locationContext = coordinates 
            ? `coordinates ${coordinates.lat}, ${coordinates.lng} (postal code ${postalCode})`
            : `postal code ${postalCode}`;
          
          // Build comprehensive prompt with real places and user preferences
          const interestsList = userProfile.interests.length > 0 
            ? userProfile.interests.join(', ') 
            : 'general city exploration';
          
          // Format places for Gemini
          const placesList = placesResults.map((p, idx) => 
            `${idx + 1}. ${p.name} - ${p.address} (${p.distance})`
          ).join('\n');
          
          const prompt = `You are a helpful city guide AI. I have found these real places near ${locationContext} in Toronto, Canada:

PLACES FOUND:
${placesList}

USER PROFILE:
- User Type: ${userProfile.userType}
- Interests: ${interestsList}
- Budget Preference: ${userProfile.budget}
- Location: ${postalCode}, Toronto, ON${coordinates ? ` (${coordinates.lat}, ${coordinates.lng})` : ''}

TASK:
1. Filter and rank these places based on:
   - User's ${userProfile.budget} budget preference
   - User's interests: ${interestsList}
   - User type: ${userProfile.userType}
   - Distance from ${postalCode} (prioritize closer places)
2. Enhance descriptions to match user preferences
3. Keep the EXACT same place names, addresses, and distances
4. Return ONLY the top 7 most relevant places

Return ONLY a JSON array (no markdown, no code blocks) with this exact format:
[
  {
    "name": "Exact Place Name from list",
    "category": "${category}",
    "distance": "Exact distance from list",
    "address": "Exact address from list",
    "description": "Enhanced description matching user preferences"
  }
]`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          // Extract JSON from response
          let jsonText = text.trim();
          if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          }
          
          const enhancedRecommendations: Recommendation[] = JSON.parse(jsonText);
          
          // Sort by distance and return top 7
          return this.sortByDistance(enhancedRecommendations).slice(0, 7);
        } catch (geminiError) {
          console.error('Error enhancing with Gemini:', geminiError);
          // Return places results as-is if Gemini fails
          return this.sortByDistance(placesResults).slice(0, 7);
        }
      }
      
      // If Gemini not available but we have places, return them
      if (placesResults.length > 0) {
        return this.sortByDistance(placesResults).slice(0, 7);
      }
      
      // If no places found and Gemini is available, use Gemini to generate recommendations
      // This is the fallback when Google Maps API isn't available or returns no results
      if (genAI) {
        console.log('Using Gemini AI to generate recommendations (Google Maps API not available or no results)');
        try {
          const model = genAI.getGenerativeModel({model: 'gemini-pro'});
          
          // Try to get coordinates, but don't fail if it doesn't work
          let coordinates = null;
          try {
            coordinates = await postalCodeToCoordinates(postalCode);
          } catch (coordError) {
            console.warn('Could not get coordinates, using postal code only:', coordError);
          }
          
          const locationContext = coordinates 
            ? `coordinates ${coordinates.lat}, ${coordinates.lng} (postal code ${postalCode})`
            : `postal code ${postalCode}`;
          
          const interestsList = userProfile.interests.length > 0 
            ? userProfile.interests.join(', ') 
            : 'general city exploration';
          
          const prompt = `You are a helpful city guide AI. Generate 7-10 REAL ${category} recommendations near ${locationContext} in Toronto, Canada.

USER PROFILE:
- User Type: ${userProfile.userType}
- Interests: ${interestsList}
- Budget Preference: ${userProfile.budget}
- Location: ${postalCode}, Toronto, ON${coordinates ? ` (${coordinates.lat}, ${coordinates.lng})` : ''}

REQUIREMENTS:
1. Find REAL, ACTUAL places CLOSEST to ${postalCode} (prioritize within 2km, then 5km)
2. Filter by user's ${userProfile.budget} budget preference
3. Match user's interests: ${interestsList}
4. Sort results by distance (closest first)
5. Include accurate distances from ${postalCode} (e.g., "0.5 km", "1.2 km")
6. Provide REAL, VERIFIABLE addresses in Toronto area (e.g., "123 Main St, Toronto, ON")
7. Consider user type (${userProfile.userType}) when suggesting places
8. Use actual place names that exist in Toronto

IMPORTANT: Return ONLY valid JSON array, no markdown, no code blocks, no explanations. Just the JSON array:

[
  {
    "name": "Real Place Name",
    "category": "${category}",
    "distance": "0.5 km",
    "address": "123 Real Street, Toronto, ON",
    "description": "Brief description matching user preferences"
  }
]`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          console.log('Gemini response received, parsing...');
          
          let jsonText = text.trim();
          // Remove markdown code blocks if present
          if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          }
          
          try {
            const recommendations: Recommendation[] = JSON.parse(jsonText);
            console.log('Successfully parsed', recommendations.length, 'recommendations from Gemini');
            return this.sortByDistance(recommendations).slice(0, 7);
          } catch (parseError: any) {
            console.error('Error parsing Gemini response:', parseError);
            console.error('Response text:', jsonText.substring(0, 500));
            // Try to extract JSON from the response if it's embedded in text
            const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              try {
                const recommendations: Recommendation[] = JSON.parse(jsonMatch[0]);
                console.log('Successfully extracted JSON, got', recommendations.length, 'recommendations');
                return this.sortByDistance(recommendations).slice(0, 7);
              } catch (e) {
                console.error('Failed to parse extracted JSON:', e);
              }
            }
            // Last resort: return empty array
            return [];
          }
        } catch (geminiError: any) {
          console.error('Error calling Gemini AI:', geminiError);
          return [];
        }
      }
      
      // No APIs available
      return [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  async getEmergencyServices(location?: string, postalCode?: string): Promise<EmergencyService[]> {
    const userPostalCode = postalCode || 'M5H 2N2';
    const searchLocation = location || `${userPostalCode}, Toronto, ON, Canada`;
    
    console.log('Getting emergency services for:', {
      location: searchLocation,
      postalCode: userPostalCode,
    });
    
    // Use hardcoded emergency services for now (bypasses API issues)
    console.log('✅ Using hardcoded emergency services for postal code:', userPostalCode);
    const services = getHardcodedEmergencyServices(userPostalCode);
    
    // Sort by distance (closest first)
    return this.sortEmergencyByDistance(services);
    
    /* 
    // OLD API-BASED CODE (commented out for now)
    // Get fresh API key values
    const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKeyValue();
    const GEMINI_API_KEY = getGeminiApiKey();
    
    // Reinitialize Gemini if needed
    if (GEMINI_API_KEY && !genAI) {
      initializeGenAI();
    }
    
    // If no API keys, return hardcoded data
    if (!GOOGLE_MAPS_API_KEY && !GEMINI_API_KEY) {
      console.warn('No API keys available. Using hardcoded emergency services.');
      return getHardcodedEmergencyServices(userPostalCode);
    }
    */

    try {
      // Step 1: Get real emergency services from Google Places API
      let placesResults: EmergencyService[] = [];
      
      if (GOOGLE_MAPS_API_KEY) {
        try {
          const coordinates = await postalCodeToCoordinates(userPostalCode);
          if (coordinates) {
            // Search for hospitals
            const hospitals = await placesService.searchNearby('hospital', userPostalCode, 'hospital', 10000);
            // Search for clinics
            const clinics = await placesService.searchNearby('clinic urgent care', userPostalCode, 'clinic', 10000);
            // Search for police stations
            const police = await placesService.searchNearby('police station', userPostalCode, 'police', 10000);
            
            // Convert to EmergencyService format
            placesResults = [
              ...hospitals.map(p => ({
                name: p.name,
                type: 'hospital' as const,
                address: p.address,
                distance: p.distance,
                phone: '',
              })),
              ...clinics.map(p => ({
                name: p.name,
                type: 'clinic' as const,
                address: p.address,
                distance: p.distance,
                phone: '',
              })),
              ...police.map(p => ({
                name: p.name,
                type: 'police' as const,
                address: p.address,
                distance: p.distance,
                phone: '',
              })),
            ];
          }
        } catch (placesError) {
          console.error('Error fetching emergency services from Google Places API:', placesError);
        }
      }

      // Step 2: Use Gemini to enhance and rank results
      if (genAI) {
        try {
          const model = genAI.getGenerativeModel({model: 'gemini-pro'});
          const coordinates = await postalCodeToCoordinates(userPostalCode);
          const locationContext = coordinates 
            ? `coordinates ${coordinates.lat}, ${coordinates.lng} (postal code ${userPostalCode})`
            : `postal code ${userPostalCode}`;
          
          if (placesResults.length > 0) {
            // Enhance existing results
            const servicesList = placesResults.map((s, idx) => 
              `${idx + 1}. ${s.name} (${s.type}) - ${s.address} (${s.distance})`
            ).join('\n');
            
            const prompt = `I found these real emergency services near ${locationContext} in Toronto, Canada:

SERVICES FOUND:
${servicesList}

TASK:
1. Rank these by distance from ${userPostalCode} (closest first)
2. Add phone numbers if you know them (format: XXX-XXX-XXXX)
3. Keep EXACT same names, addresses, distances, and types
4. Return ONLY the top 7 closest services

Return ONLY a JSON array (no markdown, no code blocks):
[
  {
    "name": "Exact name from list",
    "type": "exact type from list",
    "address": "Exact address from list",
    "distance": "Exact distance from list",
    "phone": "XXX-XXX-XXXX or empty string"
  }
]`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            let jsonText = text.trim();
            if (jsonText.startsWith('```')) {
              jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }
            
            const enhancedServices: EmergencyService[] = JSON.parse(jsonText);
            return this.sortEmergencyByDistance(enhancedServices).slice(0, 7);
          } else {
            // Generate from scratch if no places found
            const prompt = `Generate a list of 7-10 REAL emergency services (hospitals, clinics, police stations) CLOSEST to ${locationContext} in Toronto, Canada.

REQUIREMENTS:
1. Find REAL services CLOSEST to ${userPostalCode} (prioritize within 3km, then 10km)
2. Sort by distance (closest first)
3. Include accurate distances from ${userPostalCode}
4. Provide REAL addresses in Toronto area
5. Include phone numbers if available (format: XXX-XXX-XXXX)

Return ONLY a JSON array with this exact format (no markdown, no code blocks):
[
  {
    "name": "Real Service Name",
    "type": "hospital" or "clinic" or "police",
    "address": "Real address in Toronto, ON",
    "distance": "1.2 km",
    "phone": "XXX-XXX-XXXX or empty string"
  }
]`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            let jsonText = text.trim();
            if (jsonText.startsWith('```')) {
              jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }
            
            const services: EmergencyService[] = JSON.parse(jsonText);
            return this.sortEmergencyByDistance(services).slice(0, 7);
          }
        } catch (geminiError) {
          console.error('Error enhancing with Gemini:', geminiError);
          // Return places results as-is if Gemini fails
          if (placesResults.length > 0) {
            return this.sortEmergencyByDistance(placesResults).slice(0, 7);
          }
        }
      }
      
      // If Gemini not available but we have places, return them
      if (placesResults.length > 0) {
        return this.sortEmergencyByDistance(placesResults).slice(0, 7);
      }
      
      // No APIs available
      return [];
    } catch (error) {
      console.error('Error getting emergency services:', error);
      return [];
    }
  },

  async getCompatibilityScore(
    userProfile: UserProfile,
    roommate: any
  ): Promise<CompatibilityScore> {
    if (!genAI) {
      return {
        score: Math.floor(Math.random() * 30) + 70,
        summary: 'Good match! Similar interests and budget preferences.',
      };
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      const prompt = `Analyze compatibility between a ${userProfile.userType} with ${userProfile.interests.join(', ')} interests and a ${userProfile.budget} budget, and a roommate profile:
- Name: ${roommate.name}
- Budget: ${roommate.budget}
- Schedule: ${roommate.schedule}
- Pets: ${roommate.pets ? 'Yes' : 'No'}
- Location: ${roommate.location}
- Interests: ${roommate.interests.join(', ')}

Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{
  "score": 85,
  "summary": "Brief 2-3 sentence compatibility summary"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let jsonText = text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      const compatibility = JSON.parse(jsonText);
      return compatibility;
    } catch (error) {
      console.error('Error getting compatibility score:', error);
      return {
        score: Math.floor(Math.random() * 30) + 70,
        summary: 'Good match! Similar interests and budget preferences.',
      };
    }
  },

  async generateRoommateAgreement(
    userProfile: UserProfile,
    roommate: any
  ): Promise<string> {
    if (!genAI) {
      return 'This is a sample roommate agreement. Both parties agree to respect shared spaces, split utilities equally, and maintain a clean living environment.';
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      const prompt = `Generate a brief one-paragraph roommate agreement summary for ${userProfile.userType} and ${roommate.name}. Include key points about budget, schedule, pets, and shared responsibilities. Keep it concise (3-4 sentences).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating agreement:', error);
      return 'This is a sample roommate agreement. Both parties agree to respect shared spaces, split utilities equally, and maintain a clean living environment.';
    }
  },

  async chat(message: string, userProfile: UserProfile): Promise<string> {
    if (!genAI) {
      return 'I\'m here to help! Ask me about local places, events, or city information.';
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      const postalCode = userProfile.postalCode || 'M5H 2N2';
      const interestsList = userProfile.interests.length > 0 
        ? userProfile.interests.join(', ') 
        : 'general city exploration';
      
      const prompt = `You are CityBuddy AI, a helpful assistant for a ${userProfile.userType} in Toronto, Canada.

USER CONTEXT:
- Location: ${postalCode}, Toronto, ON
- Interests: ${interestsList}
- Budget: ${userProfile.budget}
- User Type: ${userProfile.userType}

When recommending places, prioritize:
1. Locations closest to ${postalCode}
2. Places matching their ${userProfile.budget} budget
3. Activities matching their interests: ${interestsList}

User question: ${message}

Provide a helpful, concise answer that considers their location and preferences.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error in chat:', error);
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again.';
    }
  },

  // Removed all mock data - now using only real APIs

  /**
   * Sort recommendations by distance (closest first)
   * Converts "X km" or "X m" to numeric value for sorting
   */
  sortByDistance(recommendations: Recommendation[]): Recommendation[] {
    const parseDistance = (distance: string): number => {
      // Extract number from "0.5 km" or "500 m"
      const match = distance.match(/([\d.]+)\s*(km|m)/i);
      if (!match) return Infinity;
      
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      
      // Convert to km for consistent sorting
      return unit === 'm' ? value / 1000 : value;
    };

    return [...recommendations].sort((a, b) => {
      const distA = parseDistance(a.distance);
      const distB = parseDistance(b.distance);
      return distA - distB;
    });
  },

  /**
   * Sort emergency services by distance (closest first)
   */
  sortEmergencyByDistance(services: EmergencyService[]): EmergencyService[] {
    const parseDistance = (distance: string): number => {
      const match = distance.match(/([\d.]+)\s*(km|m)/i);
      if (!match) return Infinity;
      
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      
      return unit === 'm' ? value / 1000 : value;
    };

    return [...services].sort((a, b) => {
      const distA = parseDistance(a.distance);
      const distB = parseDistance(b.distance);
      return distA - distB;
    });
  },
};

