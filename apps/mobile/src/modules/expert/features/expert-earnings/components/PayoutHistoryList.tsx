import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, DollarSign } from 'lucide-react-native';
import { PayoutTransaction } from '../../../shared/types/expert.types';

interface PayoutHistoryListProps {
  transactions: PayoutTransaction[];
}

export const PayoutHistoryList: React.FC<PayoutHistoryListProps> = ({ transactions }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Session Earnings ({transactions.length})</Text>

      {transactions.length > 0 ? (
        <View style={styles.list}>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.iconCircle}>
                {tx.status === 'COMPLETED' ? (
                  <CheckCircle2 size={20} color="#059669" />
                ) : (
                  <Clock size={20} color="#D97706" />
                )}
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.topicText}>{tx.topic}</Text>
                <Text style={styles.clientText}>Client: {tx.clientName} • {tx.date}</Text>
              </View>

              <View style={styles.amountCol}>
                <Text style={styles.amountText}>+${tx.amount}.00</Text>
                <Text style={[styles.statusText, tx.status === 'COMPLETED' ? styles.statusSuccess : styles.statusPending]}>
                  {tx.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <DollarSign size={24} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No Completed Sessions Yet</Text>
          <Text style={styles.emptySubtitle}>Your completed consultation payouts will appear here in real time.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  clientText: {
    fontSize: 12,
    color: '#64748B',
  },
  amountCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#047857',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusSuccess: {
    color: '#059669',
  },
  statusPending: {
    color: '#D97706',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default PayoutHistoryList;
