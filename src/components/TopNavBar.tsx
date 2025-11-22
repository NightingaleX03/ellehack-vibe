import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type TopNavBarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NavItem {
  name: string;
  screen: keyof RootStackParamList;
  icon: string;
}

const navItems: NavItem[] = [
  {name: 'Home', screen: 'Home', icon: '🏠'},
  {name: 'Explore', screen: 'Explore', icon: '🗺️'},
  {name: 'Emergency', screen: 'Emergency', icon: '🆘'},
  {name: 'Roommates', screen: 'Roommates', icon: '🏠'},
  {name: 'Chat', screen: 'Chat', icon: '💬'},
];

export const TopNavBar: React.FC = () => {
  const navigation = useNavigation<TopNavBarNavigationProp>();
  const route = useRoute();

  const handleNavPress = (screen: keyof RootStackParamList) => {
    if (screen === 'Onboarding' || screen === 'Recommendations') {
      return;
    }
    navigation.navigate(screen as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {navItems.map((item, index) => {
          const isActive = route.name === item.screen || route.name === item.name;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => handleNavPress(item.screen)}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8a2be2',
    borderBottomWidth: 1,
    borderBottomColor: '#1976d2',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 20,
    marginRight: 6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: 'bold',
  },
});

