import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from './types';
import WelcomeScreen from '../modules/auth/screens/WelcomeScreen';
import OnboardingSlides from '../modules/auth/screens/OnboardingSlides';
import OnboardingFlow from '../modules/auth/screens/OnboardingFlow';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import Theme from '../app/theme';

import useAuthStore from '../core/auth/store';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const WelcomeWrapper = () => {
  const navigation = useNavigation<any>();
  const setGuest = useAuthStore((state) => state.setGuest);
  return (
    <WelcomeScreen 
      onNext={() => navigation.navigate('OnboardingSlides')} 
      onSkip={() => setGuest(true)}
    />
  );
};

const OnboardingSlidesWrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <OnboardingSlides 
      onSkip={() => navigation.navigate('Login')} 
      onStart={() => navigation.navigate('OnboardingFlow')} 
    />
  );
};

const OnboardingFlowWrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <OnboardingFlow 
      onBackToWelcome={() => navigation.navigate('Welcome')} 
      onNavigateToLogin={() => navigation.navigate('Login')} 
    />
  );
};

const LoginWrapper = () => {
  const navigation = useNavigation<any>();
  const setGuest = useAuthStore((state) => state.setGuest);
  return (
    <LoginScreen 
      onNavigateToRegister={() => navigation.navigate('OnboardingFlow')} 
      onBrowseAsGuest={() => setGuest(true)}
    />
  );
};

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeWrapper} />
      <Stack.Screen name="OnboardingSlides" component={OnboardingSlidesWrapper} />
      <Stack.Screen name="OnboardingFlow" component={OnboardingFlowWrapper} />
      <Stack.Screen name="Login" component={LoginWrapper} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
