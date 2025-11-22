import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {AppNavigator} from './navigation/AppNavigator';
import {storage} from './utils/storage';

const App: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const complete = await storage.isOnboardingComplete();
    setIsOnboardingComplete(complete);
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isOnboardingComplete === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
    backgroundColor: '#fff',
  },
});

export default App;

