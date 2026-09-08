import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import HomeScreen from '../../modules/user/home/screens/HomeScreen';
import SearchScreen from '../../modules/user/search/screens/SearchScreen';
import ExpertProfileScreen from '../../modules/expert/features/home/screens/ExpertProfileScreen';
import PublicExpertProfileScreen from '../../modules/user/public-expert-profile/screens/PublicExpertProfileScreen';
import LearnerSessionBookingScreen from '../../modules/user/sessions/screens/LearnerSessionBookingScreen';
import BookingConfirmationScreen from '../../modules/user/bookings/screens/BookingConfirmationScreen';
import LearnerBookingSuccessScreen from '../../modules/user/sessions/screens/LearnerBookingSuccessScreen';
import LiveVideoCallScreen from '../../modules/user/sessions/screens/LiveVideoCallScreen';
import Theme from '../../app/theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
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
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Search Niches' }} 
      />
      <Stack.Screen 
        name="ExpertProfile" 
        component={ExpertProfileScreen} 
        options={{ title: 'Expert Profile' }} 
      />
      <Stack.Screen 
        name="PublicExpertProfile" 
        component={PublicExpertProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="LearnerSessionBooking" 
        component={LearnerSessionBookingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="LearnerBookingSuccess" 
        component={LearnerBookingSuccessScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="LiveVideoCall" 
        component={LiveVideoCallScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen} 
        options={{ title: 'Confirm Session' }} 
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
