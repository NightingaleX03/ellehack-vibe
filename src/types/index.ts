export type UserType = 'student' | 'newcomer' | 'tourist' | 'worker';

export type Interest = 'food' | 'nightlife' | 'parks' | 'events' | 'shopping' | 'culture';

export type BudgetPreference = 'low' | 'medium' | 'high';

export interface UserProfile {
  userType: UserType;
  interests: Interest[];
  budget: BudgetPreference;
  postalCode?: string;
  address?: string;
  roommatePreferences?: {
    budget: BudgetPreference;
    location?: string;
    pets?: boolean;
  };
}

export interface Recommendation {
  name: string;
  category: string;
  distance: string;
  address?: string;
  description?: string;
}

export interface RoommateProfile {
  id: string;
  name: string;
  budget: BudgetPreference;
  schedule: string;
  pets: boolean;
  location: string;
  interests: string[];
  bio: string;
}

export interface CompatibilityScore {
  score: number;
  summary: string;
}

export interface EmergencyService {
  name: string;
  type: 'hospital' | 'clinic' | 'police';
  address: string;
  distance: string;
  phone?: string;
}

