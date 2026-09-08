import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import useExpertEarnings from '../hooks/useExpertEarnings';
import RevenueChartCard from '../components/RevenueChartCard';
import PayoutHistoryList from '../components/PayoutHistoryList';

export const ExpertEarningsScreen: React.FC = () => {
  const { stats, transactions } = useExpertEarnings();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <DollarSign size={20} color="#059669" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Earnings & Revenue</Text>
          <Text style={styles.headerSub}>Financial analytics & payouts</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Revenue Chart Card */}
        <RevenueChartCard
          monthlyRevenue={stats.monthlyRevenue}
          growthPercent={stats.monthlyGrowthPercent}
          pendingPayout={stats.pendingPayout}
        />

        {/* Payout History List */}
        <PayoutHistoryList transactions={transactions} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 110,
  },
});

export default ExpertEarningsScreen;
