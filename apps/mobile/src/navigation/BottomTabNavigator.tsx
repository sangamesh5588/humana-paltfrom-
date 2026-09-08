import React, { useEffect, useRef } from 'react';
import { View, Platform, Animated, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from './types';
import HomeStack from './tabs/HomeStack';
import BookingStack from './tabs/BookingStack';
import InboxStack from './tabs/InboxStack';
import GoalsStack from './tabs/GoalsStack';

// Icon Imports
import { Home, Calendar, MessageSquare, Video } from 'lucide-react-native';
import Theme from '../app/theme';
import ProfileDrawer from '../modules/user/profile/components/ProfileDrawer';
import useAuthStore from '../core/auth/store';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const isTabBarHidden = useAuthStore((state) => state.isTabBarHidden);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isTabBarHidden ? (Platform.OS === 'ios' ? 100 : 80 + insets.bottom) : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isTabBarHidden, insets.bottom]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const strokeWidth = focused ? 2.5 : 2;
            switch (route.name) {
              case 'HomeTab':
                return <Home size={size} color={color} strokeWidth={strokeWidth} />;
              case 'BookingsTab':
                return <Calendar size={size} color={color} strokeWidth={strokeWidth} />;
              case 'InboxTab':
                return <MessageSquare size={size} color={color} strokeWidth={strokeWidth} />;
              case 'GoalsTab':
                return <Video size={size} color={color} strokeWidth={strokeWidth} />;
              default:
                return <Home size={size} color={color} strokeWidth={strokeWidth} />;
            }
          },
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: 'rgba(15, 23, 42, 0.4)',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
            height: Platform.OS === 'ios' ? 88 : 60 + insets.bottom,
            paddingBottom: insets.bottom,
            transform: [{ translateY }] as any,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="BookingsTab" component={BookingStack} options={{ tabBarLabel: 'Bookings' }} />
        <Tab.Screen name="InboxTab" component={InboxStack} options={{ tabBarLabel: 'Inbox' }} />
        <Tab.Screen name="GoalsTab" component={GoalsStack} options={{ tabBarLabel: 'Sessions' }} />
      </Tab.Navigator>
      <ProfileDrawer />
    </View>
  );
};

export default BottomTabNavigator;
