import {GoogleGenerativeAI} from '@google/generative-ai';
import {UserProfile, Recommendation, CompatibilityScore, EmergencyService} from '../types';
import {getApiKey} from '../config/env';

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
    location: string = 'downtown'
  ): Promise<Recommendation[]> {
    if (!genAI) {
      return this.getMockRecommendations(category);
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      const prompt = `You are a helpful city guide. Generate 5-7 local ${category} recommendations for a ${userProfile.userType} with interests in ${userProfile.interests.join(', ')} and a ${userProfile.budget} budget preference. Location: ${location}.

Return ONLY a JSON array with this exact format (no markdown, no code blocks):
[
  {
    "name": "Place Name",
    "category": "${category}",
    "distance": "0.5 km",
    "address": "123 Main St",
    "description": "Brief description"
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
      
      const recommendations = JSON.parse(jsonText);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getMockRecommendations(category);
    }
  },

  async getEmergencyServices(location: string = 'downtown'): Promise<EmergencyService[]> {
    if (!genAI) {
      return this.getMockEmergencyServices();
    }

    try {
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      
      const prompt = `Generate a list of 5-7 emergency services (hospitals, clinics, police stations) near ${location}. 

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
      
      const services = JSON.parse(jsonText);
      return services;
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
      
      const prompt = `You are CityBuddy AI, a helpful assistant for a ${userProfile.userType} in a new city. Their interests are: ${userProfile.interests.join(', ')}. Budget preference: ${userProfile.budget}.

User question: ${message}

Provide a helpful, concise answer.`;

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
};

