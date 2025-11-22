import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {Card, Text, Button, Chip} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import {geminiService} from '../services/gemini';
import {storage} from '../utils/storage';
import {Recommendation} from '../types';

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

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const profile = await storage.getProfile();
      if (profile) {
        const results = await geminiService.getRecommendations(category, profile);
        setRecommendations(results);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
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

      {recommendations.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text>No recommendations found. Try again later.</Text>
          </Card.Content>
        </Card>
      ) : (
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
      )}

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
});

