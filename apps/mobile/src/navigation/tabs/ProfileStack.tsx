import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types';
import ProfileScreen from '../../modules/user/profile/screens/ProfileScreen';
import GuestProfilePage from '../../modules/user/profile/screens/GuestProfilePage';
import EditProfileScreen from '../../modules/user/profile/screens/EditProfileScreen';
import SettingsScreen from '../../modules/user/settings/screens/SettingsScreen';
import Theme from '../../app/theme';
import useAuthStore from '../../core/auth/store';

import EditExperienceScreen from '../../modules/user/profile/screens/EditExperienceScreen';
import EditEducationScreen from '../../modules/user/profile/screens/EditEducationScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: Theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={isAuthenticated ? ProfileScreen : GuestProfilePage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }} 
      />
      <Stack.Screen 
        name="EditExperience" 
        component={EditExperienceScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditEducation" 
        component={EditEducationScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
