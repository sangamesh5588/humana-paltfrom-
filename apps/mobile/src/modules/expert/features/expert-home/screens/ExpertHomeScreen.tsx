import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useExpertDashboard from '../hooks/useExpertDashboard';
import ExpertStatsCard from '../components/ExpertStatsCard';
import QuickActionBanner from '../components/QuickActionBanner';
import UpcomingSessionsCard from '../components/UpcomingSessionsCard';
import ExpertHeader from '../components/ExpertHeader';

export const ExpertHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { refreshing, onRefresh, stats } = useExpertDashboard();

  return (
    <View style={styles.container}>
      {/* Dynamic Time-Gated Reusable Expert Header */}
      <ExpertHeader 
        onNotificationPress={() => navigation.navigate('InboxTab')}
        onProfilePress={() => navigation.navigate('ExpertProfileTab')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0369A1']} tintColor="#0369A1" />
        }
      >
        {/* Metric Cards Grid */}
        <ExpertStatsCard
          earnings={stats.earnings}
          completedSessions={stats.completedSessions}
          rating={stats.rating}
        />

        {/* Quick Action Navigation - 3 Cards in 1 Row */}
        <QuickActionBanner
          onSchedulePress={() => navigation.navigate('ExpertCalendarTab')}
          onCreateSessionPress={() => navigation.navigate('ExpertSessionsTab')}
          onBookingsPress={() => navigation.navigate('MainTabs', { screen: 'BookingsTab' })}
        />

        {/* Upcoming Sessions List Component */}
        <UpcomingSessionsCard
          onSeeAllPress={() => navigation.navigate('MainTabs', { screen: 'BookingsTab' })}
          onSetSlotsPress={() => navigation.navigate('ExpertCalendarTab')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    gap: 20,
    paddingBottom: 110,
  },
});

export default ExpertHomeScreen;
