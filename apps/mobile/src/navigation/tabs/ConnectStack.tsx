import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectStackParamList } from '../types';
import ConnectCenterScreen from '../../modules/user/home/screens/ConnectCenterScreen';
import GuestConnectPage from '../../modules/user/home/screens/GuestConnectPage';
import Theme from '../../app/theme';
import useAuthStore from '../../core/auth/store';

const Stack = createNativeStackNavigator<ConnectStackParamList>();

export const ConnectStack = () => {
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
        name="ConnectCenter" 
        component={isAuthenticated ? ConnectCenterScreen : GuestConnectPage} 
        options={{ title: 'Instant Match Connect' }} 
      />
    </Stack.Navigator>
  );
};

export default ConnectStack;
