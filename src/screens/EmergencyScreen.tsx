import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Card, Text, Chip, Button} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {geminiService} from '../services/gemini';
import {EmergencyService} from '../types';
import {getLocation} from '../utils/location';

type EmergencyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Emergency'>;

interface EmergencyScreenProps {
  navigation: EmergencyScreenNavigationProp;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({navigation}) => {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string>('Toronto');
  const [postalCode, setPostalCode] = useState<string>('M5H 2N2');

  useEffect(() => {
    loadLocation();
    loadEmergencyServices();
  }, []);

  const loadLocation = async () => {
    const locationInfo = await getLocation();
    setLocation(locationInfo.location);
    setPostalCode(locationInfo.postalCode);
  };

  const loadEmergencyServices = async () => {
    setLoading(true);
    try {
      const locationInfo = await getLocation();
      const results = await geminiService.getEmergencyServices(
        locationInfo.location,
        locationInfo.postalCode
      );
      setServices(results);
    } catch (error) {
      console.error('Error loading emergency services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return '🏥';
      case 'clinic':
        return '🏩';
      case 'police':
        return '🚔';
      default:
        return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return '#ffcdd2';
      case 'clinic':
        return '#c5e1a5';
      case 'police':
        return '#bbdefb';
      default:
        return '#e0e0e0';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading emergency services...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Emergency Help
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Nearest emergency services
      </Text>
      <Text variant="bodySmall" style={styles.locationText}>
        📍 {location} ({postalCode})
      </Text>

      {services.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text>No emergency services found. Try again later.</Text>
          </Card.Content>
        </Card>
      ) : (
        services.map((service, index) => (
          <Card
            key={index}
            style={[styles.card, {borderLeftWidth: 4, borderLeftColor: getTypeColor(service.type)}]}
            mode="elevated">
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.icon}>{getTypeIcon(service.type)}</Text>
                  <Text variant="titleLarge" style={styles.serviceName}>
                    {service.name}
                  </Text>
                </View>
                <Chip style={styles.distanceChip}>{service.distance}</Chip>
              </View>

              <Chip
                style={[styles.typeChip, {backgroundColor: getTypeColor(service.type)}]}
                textStyle={styles.chipText}>
                {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
              </Chip>

              <Text variant="bodyMedium" style={styles.address}>
                📍 {service.address}
              </Text>

              {service.phone && (
                <Text variant="bodyMedium" style={styles.phone}>
                  📞 {service.phone}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))
      )}

      <Button
        mode="outlined"
        onPress={loadEmergencyServices}
        style={styles.refreshButton}
        icon="refresh">
        Refresh
      </Button>

      <Card style={styles.emergencyCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.emergencyTitle}>
            🚨 In case of emergency, call 911
          </Text>
          <Text variant="bodySmall" style={styles.emergencyText}>
            For immediate life-threatening emergencies, always call 911 first.
          </Text>
        </Card.Content>
      </Card>
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
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 8,
    color: '#666',
  },
  locationText: {
    marginBottom: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  serviceName: {
    flex: 1,
    fontWeight: '600',
  },
  distanceChip: {
    backgroundColor: '#e3f2fd',
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  address: {
    marginTop: 4,
    color: '#666',
  },
  phone: {
    marginTop: 4,
    color: '#2196f3',
    fontWeight: '500',
  },
  refreshButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  emergencyCard: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  emergencyTitle: {
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 4,
  },
  emergencyText: {
    color: '#666',
  },
});

