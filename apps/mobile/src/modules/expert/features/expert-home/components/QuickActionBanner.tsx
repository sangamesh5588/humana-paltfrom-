import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarCheck, PlusCircle, ClipboardList } from 'lucide-react-native';

interface QuickActionBannerProps {
  onSchedulePress: () => void;
  onCreateSessionPress: () => void;
  onBookingsPress: () => void;
}

export const QuickActionBanner: React.FC<QuickActionBannerProps> = ({
  onSchedulePress,
  onCreateSessionPress,
  onBookingsPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      {/* 3 Action Cards in 1 Horizontal Row */}
      <View style={styles.row}>
        {/* 1. Set Availability - CalendarCheck */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={onSchedulePress} 
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: '#4F46E5' }]}>
            <CalendarCheck size={20} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>Set Availability</Text>
        </TouchableOpacity>

        {/* 2. Create Session - PlusCircle */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={onCreateSessionPress} 
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: '#10B981' }]}>
            <PlusCircle size={20} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>Create Session</Text>
        </TouchableOpacity>

        {/* 3. My Bookings - ClipboardList */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={onBookingsPress} 
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F59E0B' }]}>
            <ClipboardList size={20} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>My Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QuickActionBanner;
