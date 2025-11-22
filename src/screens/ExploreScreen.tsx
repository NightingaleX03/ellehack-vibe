import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Linking, Platform} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {getLocation, LocationInfo} from '../utils/location';
import {mapsService} from '../services/maps';
import {getGoogleMapsApiKey} from '../config/env';

// TypeScript declaration for window in web environment
declare const window: any;

type ExploreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Explore'>;

interface ExploreScreenProps {
  navigation: ExploreScreenNavigationProp;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({navigation}) => {
  const [location, setLocation] = useState<string>('Toronto');
  const [postalCode, setPostalCode] = useState<string>('M5H 2N2');
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('');

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    const info = await getLocation();
    setLocation(info.location);
    setPostalCode(info.postalCode);
    setLocationInfo(info);
    
    // Generate Google Maps embed URL
    if (info.coordinates) {
      const apiKey = getGoogleMapsApiKey();
      if (apiKey) {
        // Use Google Maps Embed API
        const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(info.postalCode + ', Toronto, ON, Canada')}&zoom=13`;
        setMapUrl(embedUrl);
      } else {
        // Fallback to OpenStreetMap
        const osmUrl = mapsService.getOpenStreetMapEmbedUrl(
          info.coordinates.lat,
          info.coordinates.lng,
          13
        );
        setMapUrl(osmUrl);
      }
    }
  };

  const handleViewOnMap = () => {
    if (locationInfo) {
      const searchUrl = mapsService.getGoogleMapsSearchUrl(`${postalCode}, Toronto, ON, Canada`, postalCode);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.open(searchUrl, '_blank');
        }
      } else {
        Linking.openURL(searchUrl);
      }
    }
  };

  const categories = [
    {name: 'Food & Restaurants', category: 'food', icon: '🍽️'},
    {name: 'Nightlife', category: 'nightlife', icon: '🍸'},
    {name: 'Parks & Recreation', category: 'parks', icon: '🌳'},
    {name: 'Events & Activities', category: 'events', icon: '🎉'},
    {name: 'Shopping', category: 'shopping', icon: '🛍️'},
    {name: 'Culture & Arts', category: 'culture', icon: '🎭'},
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Explore My Area
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Discover local places by category
      </Text>
      <Text variant="bodySmall" style={styles.locationText}>
        📍 {location} ({postalCode})
      </Text>

      {/* Google Map */}
      {mapUrl && (
        <Card style={styles.mapCard} mode="elevated">
          <Card.Content style={styles.mapCardContent}>
            <Text variant="titleMedium" style={styles.mapTitle}>
              Your Location
            </Text>
            <View style={styles.mapContainer}>
              {Platform.OS === 'web' ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="300"
                  style={{border: 0, borderRadius: 8}}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Text>Map View</Text>
                  <Button mode="contained" onPress={handleViewOnMap} style={styles.mapButton}>
                    View on Map
                  </Button>
                </View>
              )}
            </View>
            <Button 
              mode="outlined" 
              onPress={handleViewOnMap} 
              style={styles.viewMapButton}
              icon="map">
              Open in Google Maps
            </Button>
          </Card.Content>
        </Card>
      )}

      <Text variant="titleMedium" style={styles.categoriesTitle}>
        Explore by Category
      </Text>

      {categories.map((item, index) => (
        <Card
          key={index}
          style={styles.card}
          mode="elevated"
          onPress={() => {
            // Navigate to recommendations with category and ensure location is passed
            navigation.navigate('Recommendations', {category: item.category});
          }}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardTextContainer}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.cardSubtitle}>
                Near {postalCode}
              </Text>
            </View>
            <Button mode="text">
              Explore
            </Button>
          </Card.Content>
        </Card>
      ))}
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
    color: '#19052b',
  },
  locationText: {
    marginBottom: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  mapCard: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#19052b",
  },
  mapCardContent: {
    padding: 0,
  },
  mapTitle: {
    padding: 16,
    paddingBottom: 8,
    fontWeight: '600',
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButton: {
    marginTop: 16,
  },
  viewMapButton: {
    margin: 16,
    marginTop: 8,
  },
  categoriesTitle: {
    marginBottom: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  card: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#19052b"
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#666',
    fontSize: 12,
  },
});

