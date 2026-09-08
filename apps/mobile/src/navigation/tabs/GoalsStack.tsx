import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LearnerSessionsFeedScreen from '../../modules/user/sessions/screens/LearnerSessionsFeedScreen';
import LearnerSessionBookingScreen from '../../modules/user/sessions/screens/LearnerSessionBookingScreen';
import LearnerBookingSuccessScreen from '../../modules/user/sessions/screens/LearnerBookingSuccessScreen';
import LiveVideoCallScreen from '../../modules/user/sessions/screens/LiveVideoCallScreen';
import PublicExpertProfileScreen from '../../modules/user/public-expert-profile/screens/PublicExpertProfileScreen';

const Stack = createNativeStackNavigator<any>();

export const GoalsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="LearnerSessionsFeed" 
        component={LearnerSessionsFeedScreen} 
      />
      <Stack.Screen 
        name="PublicExpertProfile" 
        component={PublicExpertProfileScreen} 
      />
      <Stack.Screen 
        name="LearnerSessionBooking" 
        component={LearnerSessionBookingScreen} 
      />
      <Stack.Screen 
        name="LearnerBookingSuccess" 
        component={LearnerBookingSuccessScreen} 
      />
      <Stack.Screen 
        name="LiveVideoCall" 
        component={LiveVideoCallScreen} 
      />
    </Stack.Navigator>
  );
};

export default GoalsStack;
