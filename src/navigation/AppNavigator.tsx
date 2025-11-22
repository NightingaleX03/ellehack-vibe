import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {ExploreScreen} from '../screens/ExploreScreen';
import {RecommendationsScreen} from '../screens/RecommendationsScreen';
import {EmergencyScreen} from '../screens/EmergencyScreen';
import {RoommatesScreen} from '../screens/RoommatesScreen';
import {ChatScreen} from '../screens/ChatScreen';
import {TopNavBar} from '../components/TopNavBar';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  initialRouteName?: 'Onboarding' | 'Home';
  onOnboardingComplete?: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  initialRouteName = 'Onboarding',
  onOnboardingComplete,
}) => {
  console.log('AppNavigator: Rendering with initialRouteName =', initialRouteName);
  
  const OnboardingWithHandler = (props: any) => {
    console.log('OnboardingWithHandler: Rendering OnboardingScreen');
    return (
      <OnboardingScreen
        {...props}
        onComplete={onOnboardingComplete || (() => {})}
      />
    );
  };

  // Wrapper component to add top nav bar to screens
  const ScreenWithNavBar = (Component: React.ComponentType<any>) => {
    return (props: any) => (
      <View style={{flex: 1}}>
        <TopNavBar />
        <Component {...props} />
      </View>
    );
  };

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - CityBuddy AI`,
      }}
      onReady={() => console.log('NavigationContainer: Ready')}
      onStateChange={(state) => console.log('NavigationContainer: State changed', state)}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingWithHandler}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={ScreenWithNavBar(HomeScreen)}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Explore"
          component={ScreenWithNavBar(ExploreScreen)}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Emergency"
          component={ScreenWithNavBar(EmergencyScreen)}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Roommates"
          component={ScreenWithNavBar(RoommatesScreen)}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={ScreenWithNavBar(ChatScreen)}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={({route}) => ({
            title: `${route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1)} Recommendations`,
            headerShown: true,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

