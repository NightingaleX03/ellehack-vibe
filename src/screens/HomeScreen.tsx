import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const menuItems = [
    {
      icon: '🗺️',
      title: 'Explore My Area',
      subtitle: 'Discover local places',
      screen: 'Explore' as const,
    },
    {
      icon: '🆘',
      title: 'Emergency Help',
      subtitle: 'Hospitals, clinics, police',
      screen: 'Emergency' as const,
    },
    {
      icon: '🍽️',
      title: 'Food & Groceries',
      subtitle: 'Restaurants and stores',
      screen: 'Recommendations' as const,
      category: 'food',
    },
    {
      icon: '🎉',
      title: 'Things to Do',
      subtitle: 'Events and activities',
      screen: 'Recommendations' as const,
      category: 'events',
    },
    {
      icon: '🏠',
      title: 'Roommate Finder',
      subtitle: 'Find compatible roommates',
      screen: 'Roommates' as const,
    },
    {
      icon: '🤖',
      title: 'Talk to Gemini',
      subtitle: 'AI city guide chat',
      screen: 'Chat' as const,
    },
  ];

  const handlePress = (item: typeof menuItems[0]) => {
    if (item.screen === 'Recommendations' && item.category) {
      navigation.navigate('Recommendations', {category: item.category});
    } else {
      navigation.navigate(item.screen);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineLarge" style={styles.title}>
         🏙️ CityBuddy 🏙️
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Your AI-powered city guide
      </Text>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={() => handlePress(item)}
            mode="elevated">
            <Card.Content style={styles.cardContent}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text variant="bodySmall" style={styles.cardSubtitle}>
                {item.subtitle}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
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
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#19052b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    minHeight: 140,
    borderWidth: 2,
    borderColor: "#19052b"
    
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  cardSubtitle: {
    textAlign: 'center',
    color: '#19052b',
  },
});

