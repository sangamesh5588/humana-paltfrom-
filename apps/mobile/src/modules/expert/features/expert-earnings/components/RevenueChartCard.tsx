import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Wallet } from 'lucide-react-native';

interface RevenueChartCardProps {
  monthlyRevenue: number;
  growthPercent: number;
  pendingPayout: number;
}

export const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  monthlyRevenue,
  growthPercent,
  pendingPayout,
}) => {
  const bars = [
    { label: 'Feb', height: 40 },
    { label: 'Mar', height: 60 },
    { label: 'Apr', height: 50 },
    { label: 'May', height: 75 },
    { label: 'Jun', height: 90 },
    { label: 'Jul', height: 110, active: true },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subTitle}>THIS MONTH'S REVENUE</Text>
          <Text style={styles.amount}>${monthlyRevenue.toLocaleString()}.00</Text>
        </View>

        <View style={styles.growthBadge}>
          <TrendingUp size={14} color="#059669" />
          <Text style={styles.growthText}>+{growthPercent}%</Text>
        </View>
      </View>

      {/* Bar Chart Visualization */}
      <View style={styles.chartArea}>
        {bars.map((bar, idx) => (
          <View key={idx} style={styles.barCol}>
            <View
              style={[
                styles.bar,
                { height: bar.height },
                bar.active ? styles.barActive : styles.barInactive,
              ]}
            />
            <Text style={[styles.barLabel, bar.active && styles.barLabelActive]}>
              {bar.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer Payout Summary */}
      <View style={styles.payoutFooter}>
        <View style={styles.payoutIcon}>
          <Wallet size={18} color="#2563EB" />
        </View>
        <View style={styles.payoutTextCol}>
          <Text style={styles.payoutLabel}>Pending Transfer to Bank</Text>
          <Text style={styles.payoutVal}>${pendingPayout.toLocaleString()}.00</Text>
        </View>
        <View style={styles.payoutStatusChip}>
          <Text style={styles.payoutStatusText}>Processing</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  amount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  growthText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  barCol: {
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: 24,
    borderRadius: 8,
  },
  barInactive: {
    backgroundColor: '#E2E8F0',
  },
  barActive: {
    backgroundColor: '#2563EB',
  },
  barLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  barLabelActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  payoutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  payoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutTextCol: {
    flex: 1,
  },
  payoutLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  payoutVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  payoutStatusChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  payoutStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
});

export default RevenueChartCard;
