import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../types';
import BookingsScreen from '../../modules/user/bookings/screens/BookingsScreen';
import GuestBookingPage from '../../modules/user/bookings/screens/GuestBookingPage';
import BookingDetailsScreen from '../../modules/user/bookings/screens/BookingDetailsScreen';
import VideoCallScreen from '../../modules/user/bookings/screens/VideoCallScreen';
import Theme from '../../app/theme';
import useAuthStore from '../../core/auth/store';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export const BookingStack = () => {
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
        name="Bookings" 
        component={isAuthenticated ? BookingsScreen : GuestBookingPage} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BookingDetails" 
        component={BookingDetailsScreen} 
        options={{ title: 'Session Details' }} 
      />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCallScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default BookingStack;
