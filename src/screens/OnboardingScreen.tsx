import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {
  Button,
  Card,
  Text,
  RadioButton,
  Checkbox,
  TextInput,
  Divider,
} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {UserType, Interest, BudgetPreference, UserProfile} from '../types';
import {storage} from '../utils/storage';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
  onComplete?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
  onComplete,
}) => {
  console.log('OnboardingScreen: Rendering');
  
  // Check if onboarding is already complete and redirect
  useEffect(() => {
    const checkOnboarding = async () => {
      const isComplete = await storage.isOnboardingComplete();
      if (isComplete) {
        console.log('OnboardingScreen: Already complete, redirecting to Home');
        navigation.replace('Home');
      }
    };
    checkOnboarding();
  }, [navigation]);

  const [userType, setUserType] = useState<UserType>('newcomer');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [budget, setBudget] = useState<BudgetPreference>('medium');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [showRoommatePrefs, setShowRoommatePrefs] = useState(false);
  const [roommateBudget, setRoommateBudget] = useState<BudgetPreference>('medium');
  const [roommateLocation, setRoommateLocation] = useState('');
  const [roommatePets, setRoommatePets] = useState(false);

  const allInterests: Interest[] = ['food', 'nightlife', 'parks', 'events', 'shopping', 'culture'];

  const toggleInterest = (interest: Interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    const profile: UserProfile = {
      userType,
      interests: interests.length > 0 ? interests : ['food', 'parks'],
      budget,
      // Use provided postal code or default to downtown Toronto
      postalCode: postalCode.trim() || 'M5H 2N2',
      address: address.trim() || undefined,
      roommatePreferences: showRoommatePrefs
        ? {
            budget: roommateBudget,
            location: roommateLocation || undefined,
            pets: roommatePets,
          }
        : undefined,
    };

    await storage.saveProfile(profile);
    await storage.setOnboardingComplete(true);
    if (onComplete) {
      onComplete();
    }
    navigation.replace('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to CityBuddy AI! 👋
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Let's set up your profile to personalize your experience
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Who are you?
          </Text>
          <RadioButton.Group
            onValueChange={value => setUserType(value as UserType)}
            value={userType}>
            <RadioButton.Item label="Student" value="student" />
            <RadioButton.Item label="Newcomer" value="newcomer" />
            <RadioButton.Item label="Tourist" value="tourist" />
            <RadioButton.Item label="Worker" value="worker" />
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            What are you interested in? (Select all that apply)
          </Text>
          {allInterests.map(interest => (
            <Checkbox.Item
              key={interest}
              label={interest.charAt(0).toUpperCase() + interest.slice(1)}
              status={interests.includes(interest) ? 'checked' : 'unchecked'}
              onPress={() => toggleInterest(interest)}
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Budget Preference
          </Text>
          <RadioButton.Group
            onValueChange={value => setBudget(value as BudgetPreference)}
            value={budget}>
            <RadioButton.Item label="Low" value="low" />
            <RadioButton.Item label="Medium" value="medium" />
            <RadioButton.Item label="High" value="high" />
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Location
          </Text>
          <TextInput
            label="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., M5H 2N2"
          />
          <TextInput
            label="Address (optional)"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={styles.input}
            placeholder="Street address"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Checkbox.Item
            label="Looking for a roommate?"
            status={showRoommatePrefs ? 'checked' : 'unchecked'}
            onPress={() => setShowRoommatePrefs(!showRoommatePrefs)}
          />
          {showRoommatePrefs && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Roommate Preferences
              </Text>
              <TextInput
                label="Preferred Location (optional)"
                value={roommateLocation}
                onChangeText={setRoommateLocation}
                mode="outlined"
                style={styles.input}
              />
              <Text variant="bodySmall" style={styles.label}>
                Budget Preference
              </Text>
              <RadioButton.Group
                onValueChange={value => setRoommateBudget(value as BudgetPreference)}
                value={roommateBudget}>
                <RadioButton.Item label="Low" value="low" />
                <RadioButton.Item label="Medium" value="medium" />
                <RadioButton.Item label="High" value="high" />
              </RadioButton.Group>
              <Checkbox.Item
                label="Open to pets"
                status={roommatePets ? 'checked' : 'unchecked'}
                onPress={() => setRoommatePets(!roommatePets)}
              />
            </>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Get Started
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
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

