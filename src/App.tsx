import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {AppNavigator} from './navigation/AppNavigator';
import {storage} from './utils/storage';

const App: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('App mounted, checking onboarding status...');
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const complete = await storage.isOnboardingComplete();
      console.log('App: Onboarding status check result:', complete);
      setIsOnboardingComplete(complete);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to showing onboarding if there's an error
      setIsOnboardingComplete(false);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isOnboardingComplete === null) {
    console.log('App: Still loading, showing loading indicator');
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('App: Onboarding complete =', isOnboardingComplete, 'Rendering navigator');
  return (
    <PaperProvider>
      <AppNavigator
        initialRouteName={isOnboardingComplete ? 'Home' : 'Onboarding'}
        onOnboardingComplete={handleOnboardingComplete}
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    width: '100%',
  },
});

export default App;

