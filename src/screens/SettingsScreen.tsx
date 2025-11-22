import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, Button, Divider, TextInput, Checkbox} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {UserProfile, Interest} from '../types';
import {storage} from '../utils/storage';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [saving, setSaving] = useState(false);

  const allInterests: Interest[] = ['food', 'nightlife', 'parks', 'events', 'shopping', 'culture'];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await storage.getProfile();
    if (userProfile) {
      setProfile(userProfile);
      setPostalCode(userProfile.postalCode || '');
      setInterests(userProfile.interests || []);
    }
  };

  const toggleInterest = (interest: Interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        postalCode: postalCode.trim() || undefined,
        interests: interests.length > 0 ? interests : profile.interests,
      };
      
      await storage.saveProfile(updatedProfile);
      setProfile(updatedProfile);
      
      // Show success message (you could use a Snackbar here)
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProfile = () => {
    // Reset onboarding to allow editing
    storage.setOnboardingComplete(false);
    navigation.replace('Onboarding');
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const userTypeLabels: Record<string, string> = {
    student: 'Student',
    newcomer: 'Newcomer',
    tourist: 'Tourist',
    worker: 'Worker',
  };

  const budgetLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Settings ⚙️
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Profile Information
          </Text>
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>User Type:</Text>
            <Text style={styles.value}>{userTypeLabels[profile.userType] || profile.userType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Budget Preference:</Text>
            <Text style={styles.value}>{budgetLabels[profile.budget] || profile.budget}</Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Postal Code:</Text>
            <TextInput
              label="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
              mode="outlined"
              style={styles.textInput}
              placeholder="e.g., M5H 2N2"
            />
          </View>

          {profile.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{profile.address}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Activity Preferences
          </Text>
          <Divider style={styles.divider} />
          
          <Text variant="bodyMedium" style={styles.helperText}>
            Select your preferred activities:
          </Text>
          
          <View style={styles.checkboxContainer}>
            {allInterests.map(interest => (
              <Checkbox.Item
                key={interest}
                label={interest.charAt(0).toUpperCase() + interest.slice(1)}
                status={interests.includes(interest) ? 'checked' : 'unchecked'}
                onPress={() => toggleInterest(interest)}
                style={styles.checkboxItem}
              />
            ))}
          </View>

          {interests.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text variant="bodySmall" style={styles.selectedLabel}>
                Selected ({interests.length}):
              </Text>
              <View style={styles.interestsContainer}>
                {interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>
                      {interest.charAt(0).toUpperCase() + interest.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {profile.roommatePreferences && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Roommate Preferences
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Budget:</Text>
              <Text style={styles.value}>
                {budgetLabels[profile.roommatePreferences.budget] || profile.roommatePreferences.budget}
              </Text>
            </View>

            {profile.roommatePreferences.location && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Preferred Location:</Text>
                <Text style={styles.value}>{profile.roommatePreferences.location}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.label}>Open to Pets:</Text>
              <Text style={styles.value}>
                {profile.roommatePreferences.pets ? 'Yes' : 'No'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
        loading={saving}
        disabled={saving}>
        Save Changes
      </Button>

      <Button
        mode="outlined"
        onPress={handleEditProfile}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Edit Full Profile
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  divider: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  inputRow: {
    marginBottom: 16,
  },
  textInput: {
    marginTop: 8,
  },
  helperText: {
    marginBottom: 12,
    color: '#666',
  },
  checkboxContainer: {
    marginTop: 8,
  },
  checkboxItem: {
    paddingVertical: 4,
  },
  selectedContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectedLabel: {
    marginBottom: 8,
    fontWeight: '500',
    color: '#666',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  noData: {
    color: '#999',
    fontStyle: 'italic',
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

