import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertGuardScreen from './ExpertGuardScreen';
import ExpertStoryScreen from '../features/story/screens/ExpertStoryScreen';
import ExpertBottomTabNavigator from './ExpertBottomTabNavigator';
import CreateSessionScreen from '../features/expert-sessions/screens/CreateSessionScreen';
import TopNotchIdentityScreen from '../features/identity/screens/TopNotchIdentityScreen';
import SimpleVerificationScreen from '../features/journey/screens/SimpleVerificationScreen';
import VerificationCatalogScreen from '../features/catalog/screens/VerificationCatalogScreen';
import ProfileVerificationStatusScreen from '../features/pending/screens/ProfileVerificationStatusScreen';
import CredentialVerificationStatusScreen from '../features/pending/screens/CredentialVerificationStatusScreen';

import SessionDetailsScreen from '../features/expert-sessions/screens/SessionDetailsScreen';

const Stack = createNativeStackNavigator();

export const ExpertNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ExpertGuard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertGuard" component={ExpertGuardScreen} />
      <Stack.Screen name="TopNotchIdentity" component={TopNotchIdentityScreen} />
      <Stack.Screen name="ExpertStory" component={ExpertStoryScreen} />
      <Stack.Screen name="ExpertBottomTabs" component={ExpertBottomTabNavigator} />
      <Stack.Screen name="CreateSession" component={CreateSessionScreen} />
      <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} />
      <Stack.Screen name="ExpertJourney" component={SimpleVerificationScreen} />
      <Stack.Screen name="VerificationCatalog" component={VerificationCatalogScreen} />
      <Stack.Screen name="ExpertPending" component={CredentialVerificationStatusScreen} />
      <Stack.Screen name="ProfileVerificationStatus" component={ProfileVerificationStatusScreen} />
      <Stack.Screen name="CredentialVerificationStatus" component={CredentialVerificationStatusScreen} />
    </Stack.Navigator>
  );
};

export default ExpertNavigator;
