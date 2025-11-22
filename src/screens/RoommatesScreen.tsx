import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Card, Text, Button, Chip, Dialog, Portal} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {hardcodedRoommates} from '../data/roommates';
import {geminiService} from '../services/gemini';
import {storage} from '../utils/storage';
import {RoommateProfile, CompatibilityScore} from '../types';

type RoommatesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Roommates'>;

interface RoommatesScreenProps {
  navigation: RoommatesScreenNavigationProp;
}

export const RoommatesScreen: React.FC<RoommatesScreenProps> = ({navigation}) => {
  const [roommates] = useState<RoommateProfile[]>(hardcodedRoommates);
  const [selectedRoommate, setSelectedRoommate] = useState<RoommateProfile | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreementDialog, setAgreementDialog] = useState(false);
  const [agreement, setAgreement] = useState('');

  const handleCheckCompatibility = async (roommate: RoommateProfile) => {
    setSelectedRoommate(roommate);
    setLoading(true);
    try {
      const profile = await storage.getProfile();
      if (profile) {
        const score = await geminiService.getCompatibilityScore(profile, roommate);
        setCompatibility(score);
      }
    } catch (error) {
      console.error('Error checking compatibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAgreement = async () => {
    if (!selectedRoommate) return;

    setLoading(true);
    try {
      const profile = await storage.getProfile();
      if (profile) {
        const agreementText = await geminiService.generateRoommateAgreement(
          profile,
          selectedRoommate
        );
        setAgreement(agreementText);
        setAgreementDialog(true);
      }
    } catch (error) {
      console.error('Error generating agreement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low':
        return '#c8e6c9';
      case 'medium':
        return '#fff9c4';
      case 'high':
        return '#ffccbc';
      default:
        return '#e0e0e0';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Roommate Finder
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {roommates.length} potential roommates available
      </Text>

      {roommates.map(roommate => (
        <Card key={roommate.id} style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleLarge" style={styles.name}>
                {roommate.name}
              </Text>
              <Chip
                style={[styles.budgetChip, {backgroundColor: getBudgetColor(roommate.budget)}]}>
                {roommate.budget} budget
              </Chip>
            </View>

            <Text variant="bodyMedium" style={styles.bio}>
              {roommate.bio}
            </Text>

            <View style={styles.details}>
              <Text variant="bodySmall" style={styles.detail}>
                📅 {roommate.schedule}
              </Text>
              <Text variant="bodySmall" style={styles.detail}>
                📍 {roommate.location}
              </Text>
              <Text variant="bodySmall" style={styles.detail}>
                {roommate.pets ? '🐾 Has pets' : '🚫 No pets'}
              </Text>
            </View>

            <View style={styles.interests}>
              {roommate.interests.map((interest, idx) => (
                <Chip key={idx} style={styles.interestChip} textStyle={styles.chipText}>
                  {interest}
                </Chip>
              ))}
            </View>

            {selectedRoommate?.id === roommate.id && compatibility && (
              <View style={styles.compatibilityContainer}>
                <Text variant="titleMedium" style={styles.compatibilityTitle}>
                  Compatibility Score: {compatibility.score}%
                </Text>
                <Text variant="bodySmall" style={styles.compatibilitySummary}>
                  {compatibility.summary}
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleGenerateAgreement}
                  style={styles.agreementButton}
                  loading={loading}>
                  Generate Roommate Agreement
                </Button>
              </View>
            )}

            <Button
              mode="contained"
              onPress={() => handleCheckCompatibility(roommate)}
              style={styles.checkButton}
              loading={loading && selectedRoommate?.id === roommate.id}>
              Check Compatibility
            </Button>
          </Card.Content>
        </Card>
      ))}

      <Portal>
        <Dialog visible={agreementDialog} onDismiss={() => setAgreementDialog(false)}>
          <Dialog.Title>Roommate Agreement</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{agreement}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAgreementDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontWeight: '600',
  },
  budgetChip: {
    marginLeft: 8,
  },
  bio: {
    marginBottom: 12,
    color: '#666',
  },
  details: {
    marginBottom: 12,
  },
  detail: {
    marginBottom: 4,
    color: '#666',
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  interestChip: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: '#e1bee7',
  },
  chipText: {
    fontSize: 11,
  },
  compatibilityContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 12,
  },
  compatibilityTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  compatibilitySummary: {
    marginBottom: 8,
    color: '#666',
  },
  agreementButton: {
    marginTop: 4,
  },
  checkButton: {
    marginTop: 8,
  },
});

