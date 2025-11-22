import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserProfile} from '../types';

const PROFILE_KEY = '@citybuddy:profile';
const ONBOARDING_COMPLETE_KEY = '@citybuddy:onboarding_complete';

// Default postal code for Toronto downtown
const DEFAULT_POSTAL_CODE = 'M5H 2N2'; // Toronto Financial District

export const storage = {
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      if (data) {
        const profile = JSON.parse(data);
        // Ensure postal code has a default value if not set
        if (!profile.postalCode) {
          profile.postalCode = DEFAULT_POSTAL_CODE;
          // Save the updated profile with default postal code
          await this.saveProfile(profile);
        }
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  async setOnboardingComplete(complete: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, JSON.stringify(complete));
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },

  async isOnboardingComplete(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },
};

