import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, DollarSign, Calendar, UserCog, Video } from 'lucide-react-native';
import ExpertHomeScreen from '../features/expert-home/screens/ExpertHomeScreen';
import ExpertSessionsScreen from '../features/expert-sessions/screens/ExpertSessionsScreen';
import ExpertEarningsScreen from '../features/expert-earnings/screens/ExpertEarningsScreen';
import ExpertCalendarScreen from '../features/expert-calendar/screens/ExpertCalendarScreen';
import ExpertProfileScreen from '../features/expert-profile/screens/ExpertProfileScreen';

const Tab = createBottomTabNavigator();

export const ExpertBottomTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const strokeWidth = focused ? 2.6 : 2;
          switch (route.name) {
            case 'ExpertHomeTab':
              return <LayoutDashboard size={size} color={color} strokeWidth={strokeWidth} />;
            case 'ExpertSessionsTab':
              return <Video size={size} color={color} strokeWidth={strokeWidth} />;
            case 'ExpertEarningsTab':
              return <DollarSign size={size} color={color} strokeWidth={strokeWidth} />;
            case 'ExpertCalendarTab':
              return <Calendar size={size} color={color} strokeWidth={strokeWidth} />;
            case 'ExpertProfileTab':
              return <UserCog size={size} color={color} strokeWidth={strokeWidth} />;
            default:
              return <LayoutDashboard size={size} color={color} strokeWidth={strokeWidth} />;
          }
        },
        tabBarActiveTintColor: '#0369A1', // Signature Steel Blue Primary Accent
        tabBarInactiveTintColor: '#94A3B8', // Soft Slate
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 88 : 64 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="ExpertHomeTab" component={ExpertHomeScreen} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="ExpertSessionsTab" component={ExpertSessionsScreen} options={{ tabBarLabel: 'My Sessions' }} />
      <Tab.Screen name="ExpertEarningsTab" component={ExpertEarningsScreen} options={{ tabBarLabel: 'Earnings' }} />
      <Tab.Screen name="ExpertCalendarTab" component={ExpertCalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
      <Tab.Screen name="ExpertProfileTab" component={ExpertProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default ExpertBottomTabNavigator;
