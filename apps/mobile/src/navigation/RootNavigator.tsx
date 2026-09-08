import React, { useEffect, useState } from 'react';
import useAuthStore from '../core/auth/store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import OnboardingNavigator from '../modules/user/onboarding/OnboardingNavigator';
import DynamicSplashScreen from '../modules/auth/screens/DynamicSplashScreen';

export const RootNavigator = () => {
  const { isAuthenticated, isGuest, initialize, user } = useAuthStore();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  useEffect(() => {
    initialize()
      .catch((error) => {
        console.log('Initialization failed:', error);
      })
      .finally(() => {
        setIsInitialLoadDone(true);
      });
  }, [initialize]);

  const showSplash = isSplashVisible || !isInitialLoadDone;

  if (showSplash) {
    return <DynamicSplashScreen onInitializationComplete={() => setIsSplashVisible(false)} />;
  }

  // 1. Unauthenticated Stack Flow (Show login if neither logged in nor guest)
  if (!isAuthenticated && !isGuest) {
    return <AuthNavigator />;
  }

  // 2. Onboarding Flow (Only force if onboardingDone is explicitly false)
  if (isAuthenticated && user?.profile?.onboardingDone === false) {
    return (
      <OnboardingNavigator 
        onComplete={async () => {
          // Re-fetch user details to update onboarding status in AuthStore
          await initialize();
        }} 
      />
    );
  }

  // 3. Main Application Stack Flow
  return <AppNavigator />;
};

export default RootNavigator;