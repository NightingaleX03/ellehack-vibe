import {GoogleGenerativeAI} from '@google/generative-ai';
import {UserProfile, Recommendation, CompatibilityScore, EmergencyService} from '../types';
import {getApiKey} from '../config/env';
import {postalCodeToCoordinates} from '../utils/location';

// Get API key from environment
const API_KEY = getApiKey();

if (!API_KEY) {
  console.warn('GEMINI_API_KEY not found in environment variables');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const geminiService = {
  async getRecommendations(
    category: string,
    userProfile: UserProfile,
    location?: string
  ): Promise<Recommendation[]> {
    // Use postal code from profile, or default to downtown Toronto
    const postalCode = userProfile.postalCode || 'M5H 2N2';
    const searchLocation = location || `${postalCode}, Toronto, ON, Canada`;
    
    if (!genAI) {
      return this.getMockRecommendations(category);
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      // Get coordinates for better location context
      const coordinates = await postalCodeToCoordinates(postalCode);
      const locationContext = coordinates 
        ? `coordinates ${coordinates.lat}, ${coordinates.lng} (postal code ${postalCode})`
        : `postal code ${postalCode}`;
      
      // Build comprehensive prompt with user preferences and location
      const interestsList = userProfile.interests.length > 0 
        ? userProfile.interests.join(', ') 
        : 'general city exploration';
      
      const prompt = `You are a helpful city guide AI. Generate 7-10 local ${category} recommendations near ${locationContext} in Toronto, Canada.

USER PROFILE:
- User Type: ${userProfile.userType}
- Interests: ${interestsList}
- Budget Preference: ${userProfile.budget}
- Location: ${postalCode}, Toronto, ON${coordinates ? ` (${coordinates.lat}, ${coordinates.lng})` : ''}

REQUIREMENTS:
1. Find places CLOSEST to ${postalCode} first (prioritize within 2km, then 5km)
2. Filter by user's ${userProfile.budget} budget preference
3. Match user's interests: ${interestsList}
4. Sort results by distance (closest first)
5. Include accurate distances from ${postalCode}
6. Provide real addresses in Toronto area
7. Consider user type (${userProfile.userType}) when suggesting places

Return ONLY a JSON array sorted by distance (closest first), with this exact format (no markdown, no code blocks):
[
  {
    "name": "Place Name",
    "category": "${category}",
    "distance": "0.5 km",
    "address": "123 Main St, Toronto, ON",
    "description": "Brief description matching user preferences"
  }
]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response (handle markdown code blocks if present)
      let jsonText = text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      let recommendations: Recommendation[] = JSON.parse(jsonText);
      
      // Sort by distance (convert "X km" to number for sorting)
      recommendations = this.sortByDistance(recommendations);
      
      // Filter to top 7 closest results
      return recommendations.slice(0, 7);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getMockRecommendations(category);
    }
  },

  async getEmergencyServices(location?: string, postalCode?: string): Promise<EmergencyService[]> {
    const userPostalCode = postalCode || 'M5H 2N2';
    const searchLocation = location || `${userPostalCode}, Toronto, ON, Canada`;
    
    if (!genAI) {
      return this.getMockEmergencyServices();
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      // Get coordinates for better location context
      const coordinates = await postalCodeToCoordinates(userPostalCode);
      const locationContext = coordinates 
        ? `coordinates ${coordinates.lat}, ${coordinates.lng} (postal code ${userPostalCode})`
        : `postal code ${userPostalCode}`;
      
      const prompt = `Generate a list of 7-10 emergency services (hospitals, clinics, police stations) CLOSEST to ${locationContext} in Toronto, Canada.

REQUIREMENTS:
1. Find services CLOSEST to ${userPostalCode} first (prioritize within 3km, then 10km)
2. Sort by distance (closest first)
3. Include accurate distances from ${userPostalCode}
4. Provide real addresses in Toronto area
5. Include phone numbers if available

Location: ${searchLocation}${coordinates ? ` (${coordinates.lat}, ${coordinates.lng})` : ''} 

Return ONLY a JSON array with this exact format (no markdown, no code blocks):
[
  {
    "name": "Service Name",
    "type": "hospital" or "clinic" or "police",
    "address": "123 Main St",
    "distance": "1.2 km",
    "phone": "123-456-7890"
  }
]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let jsonText = text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      let services: EmergencyService[] = JSON.parse(jsonText);
      
      // Sort by distance (closest first)
      services = this.sortEmergencyByDistance(services);
      
      // Return top 7 closest
      return services.slice(0, 7);
    } catch (error) {
      console.error('Error getting emergency services:', error);
      return this.getMockEmergencyServices();
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

  // Mock data fallbacks
  getMockRecommendations(category: string): Recommendation[] {
    const mockData: Record<string, Recommendation[]> = {
      food: [
        {name: 'Local Bistro', category: 'food', distance: '0.3 km', address: '123 Main St', description: 'Cozy local restaurant'},
        {name: 'Food Market', category: 'food', distance: '0.8 km', address: '456 Oak Ave', description: 'Fresh produce and groceries'},
        {name: 'Café Central', category: 'food', distance: '1.2 km', address: '789 Pine Rd', description: 'Great coffee and pastries'},
      ],
      nightlife: [
        {name: 'The Lounge', category: 'nightlife', distance: '0.5 km', address: '321 Elm St', description: 'Trendy bar with live music'},
        {name: 'Dance Club', category: 'nightlife', distance: '1.0 km', address: '654 Maple Dr', description: 'Late night dancing'},
      ],
      parks: [
        {name: 'Central Park', category: 'parks', distance: '0.7 km', address: 'Park Ave', description: 'Large green space'},
        {name: 'Riverside Park', category: 'parks', distance: '1.5 km', address: 'River Rd', description: 'Scenic waterfront park'},
      ],
      events: [],
    };

    return mockData[category] || [
      {name: 'Local Place', category, distance: '1.0 km', address: '123 Main St', description: 'A great local spot'},
    ];
  },

  getMockEmergencyServices(): EmergencyService[] {
    return [
      {name: 'City General Hospital', type: 'hospital', address: '100 Medical Dr', distance: '2.1 km', phone: '555-0100'},
      {name: 'Urgent Care Clinic', type: 'clinic', address: '200 Health St', distance: '1.5 km', phone: '555-0200'},
      {name: 'Downtown Police Station', type: 'police', address: '300 Safety Ave', distance: '0.8 km', phone: '555-911'},
      {name: 'Community Health Center', type: 'clinic', address: '400 Wellness Blvd', distance: '1.2 km', phone: '555-0300'},
    ];
  },

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

