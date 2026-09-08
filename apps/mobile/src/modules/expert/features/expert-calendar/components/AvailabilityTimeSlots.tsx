import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Clock } from 'lucide-react-native';
import { AvailabilitySlot } from '../../../shared/types/expert.types';

interface AvailabilityTimeSlotsProps {
  slots: AvailabilitySlot[];
  onToggleSlot: (id: string) => void;
}

export const AvailabilityTimeSlots: React.FC<AvailabilityTimeSlotsProps> = ({
  slots,
  onToggleSlot,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Clock size={18} color="#2563EB" />
        <Text style={styles.title}>Weekly Consultation Hours</Text>
      </View>

      <View style={styles.card}>
        {slots.map((slot) => (
          <View key={slot.id} style={styles.slotRow}>
            <View style={styles.dayCol}>
              <Text style={styles.dayText}>{slot.dayOfWeek}</Text>
              <Text style={styles.timeText}>{slot.startTime} - {slot.endTime}</Text>
            </View>

            <Switch
              value={slot.enabled}
              onValueChange={() => onToggleSlot(slot.id)}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={slot.enabled ? '#2563EB' : '#94A3B8'}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dayCol: {
    gap: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default AvailabilityTimeSlots;
