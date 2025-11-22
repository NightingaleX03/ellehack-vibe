import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type ExploreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Explore'>;

interface ExploreScreenProps {
  navigation: ExploreScreenNavigationProp;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({navigation}) => {
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

      {categories.map((item, index) => (
        <Card
          key={index}
          style={styles.card}
          mode="elevated"
          onPress={() => navigation.navigate('Recommendations', {category: item.category})}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {item.name}
            </Text>
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
  cardTitle: {
    flex: 1,
    fontWeight: '600',
  },
});

