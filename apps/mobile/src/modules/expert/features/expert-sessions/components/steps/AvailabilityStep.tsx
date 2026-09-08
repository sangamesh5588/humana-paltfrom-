import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

export const AvailabilityStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Availability</Text>
      <Text style={styles.formSub}>Sync your weekly calendar consultation settings.</Text>

      <View style={styles.availabilityCard}>
        <Clock size={20} color="#0369A1" />
        <View style={{ flex: 1 }}>
          <Text style={styles.availTitle}>Weekly Available Hours</Text>
          <Text style={styles.availSub}>Mon - Fri, 09:00 AM - 05:00 PM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  formSub: {
    fontSize: 13,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 16,
    lineHeight: 18,
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  availTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0369A1',
  },
  availSub: {
    fontSize: 12,
    color: '#0369A1',
    opacity: 0.8,
  },
});

export default AvailabilityStep;
