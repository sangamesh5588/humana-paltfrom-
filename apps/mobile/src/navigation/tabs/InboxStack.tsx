import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InboxStackParamList } from '../types';
import InboxScreen from '../../modules/user/inbox/screens/InboxScreen';
import GuestInboxPage from '../../modules/user/inbox/screens/GuestInboxPage';
import ChatScreen from '../../modules/user/inbox/screens/ChatScreen';
import AudioCallScreen from '../../modules/user/inbox/screens/AudioCallScreen';
import Theme from '../../app/theme';
import useAuthStore from '../../core/auth/store';

const Stack = createNativeStackNavigator<InboxStackParamList>();

export const InboxStack = () => {
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
        name="Inbox" 
        component={isAuthenticated ? InboxScreen : GuestInboxPage} 
        options={{ title: 'Messages' }} 
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({ title: route.params?.recipientName || 'Chat' })} 
      />
      <Stack.Screen 
        name="Call" 
        component={AudioCallScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default InboxStack;
