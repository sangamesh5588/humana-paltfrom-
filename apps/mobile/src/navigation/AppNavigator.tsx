import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileStack from './tabs/ProfileStack';
import ExpertNavigator from '../modules/expert/navigation/ExpertNavigator';
import EditExperienceScreen from '../modules/user/profile/screens/EditExperienceScreen';
import EditEducationScreen from '../modules/user/profile/screens/EditEducationScreen';
import ConsultationHoursScreen from '../modules/expert/features/expert-profile/screens/ConsultationHoursScreen';
import AiGuideScreen from '../modules/user/ai-guide/screens/AiGuideScreen';
import AiRecommendationsScreen from '../modules/user/ai-guide/screens/AiRecommendationsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="EditExperience" component={EditExperienceScreen} />
      <Stack.Screen name="EditEducation" component={EditEducationScreen} />
      <Stack.Screen name="ConsultationHours" component={ConsultationHoursScreen} />
      <Stack.Screen name="ExpertStack" component={ExpertNavigator} />
      <Stack.Screen name="AiGuide" component={AiGuideScreen} />
      <Stack.Screen name="AiRecommendations" component={AiRecommendationsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
