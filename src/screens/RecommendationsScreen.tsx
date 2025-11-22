import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {Card, Text, Button, Chip} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import {geminiService} from '../services/gemini';
import {storage} from '../utils/storage';
import {Recommendation} from '../types';
import {getLocation} from '../utils/location';

type RecommendationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Recommendations'
>;
type RecommendationsScreenRouteProp = RouteProp<RootStackParamList, 'Recommendations'>;

interface RecommendationsScreenProps {
  navigation: RecommendationsScreenNavigationProp;
  route: RecommendationsScreenRouteProp;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  navigation,
  route,
}) => {
  const {category} = route.params;
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#8a2be2', // New Nav Bar Background Color
      },
      headerTintColor: '#ffffff', // New Title and Back Button Color (for contrast)
    });

    loadRecommendations();
  }, [navigation, category]);

  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await storage.getProfile();
      if (!profile) {
        setError('Please complete onboarding first to get personalized recommendations.');
        setLoading(false);
        return;
      }
      
      // Ensure postal code is set (will use default if not)
      const locationInfo = await getLocation();
      if (!profile.postalCode) {
        profile.postalCode = locationInfo.postalCode;
      }
      
      console.log('Loading recommendations for category:', category, 'postal code:', profile.postalCode);
      const results = await geminiService.getRecommendations(category, profile);
      console.log('Recommendations received:', results.length, results);
      
      if (results.length === 0) {
        setError('No places found. Make sure Google Maps APIs are enabled in Google Cloud Console. See GOOGLE_MAPS_SETUP.md for instructions.');
      } else {
        setRecommendations(results);
      }
    } catch (error: any) {
      console.error('Error loading recommendations:', error);
      setError(`Error: ${error?.message || 'Failed to load recommendations. Check console for details.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Finding great places...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        {category.charAt(0).toUpperCase() + category.slice(1)} Recommendations
      </Text>

      {error && (
        <Card style={[styles.card, styles.errorCard]}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.errorText}>
              {error}
            </Text>
            <Text variant="bodySmall" style={styles.errorHint}>
              Tip: Make sure you've enabled Geocoding API and Places API in Google Cloud Console.
            </Text>
          </Card.Content>
        </Card>
      )}

      {recommendations.length === 0 && !error ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text>No recommendations found. Try again later.</Text>
            <Text variant="bodySmall" style={{marginTop: 8, color: '#666'}}>
              Make sure Google Maps APIs are enabled and your API keys are correct.
            </Text>
          </Card.Content>
        </Card>
      ) : recommendations.length > 0 ? (
        recommendations.map((rec, index) => (
          <Card key={index} style={styles.card} mode="elevated">
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={styles.placeName}>
                  {rec.name}
                </Text>
                <Chip style={styles.distanceChip}>{rec.distance}</Chip>
              </View>
              {rec.category && (
                <Chip style={styles.categoryChip} textStyle={styles.chipText}>
                  {rec.category}
                </Chip>
              )}
              {rec.address && (
                <Text variant="bodyMedium" style={styles.address}>
                  📍 {rec.address}
                </Text>
              )}
              {rec.description && (
                <Text variant="bodySmall" style={styles.description}>
                  {rec.description}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))
      ) : null}

      <Button
        mode="outlined"
        onPress={loadRecommendations}
        style={styles.refreshButton}>
        Refresh
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#19052b"
    
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: { 
    flex: 1,
    fontWeight: '600',
  },
  distanceChip: {
    backgroundColor: '#e3f2fd',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#f3e5f5',
  },
  chipText: {
    fontSize: 12,
  },
  address: {
    marginTop: 4,
    color: '#666',
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  refreshButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  errorCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  errorText: {
    color: '#856404',
    marginBottom: 8,
  },
  errorHint: {
    color: '#856404',
    fontStyle: 'italic',
  },
});

