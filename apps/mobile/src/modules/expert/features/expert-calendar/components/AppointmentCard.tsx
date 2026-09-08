import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, Calendar, User } from 'lucide-react-native';
import { ExpertAppointment } from '../../../shared/types/expert.types';

interface AppointmentCardProps {
  appointment: ExpertAppointment;
  onJoinRoom: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onJoinRoom,
}) => {
  return (
    <View style={styles.card}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        <View style={styles.topicBadge}>
          <Text style={styles.topicBadgeText}>{appointment.topic}</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
      </View>

      {/* Client details */}
      <View style={styles.clientRow}>
        <View style={styles.avatarCircle}>
          <User size={18} color="#2563EB" />
        </View>

        <View style={styles.clientCol}>
          <Text style={styles.clientName}>{appointment.clientName}</Text>
          <View style={styles.timeRow}>
            <Calendar size={12} color="#64748B" />
            <Text style={styles.timeText}>{appointment.date} at {appointment.timeSlot}</Text>
          </View>
        </View>

        <Text style={styles.priceText}>${appointment.price}</Text>
      </View>

      {/* Join Video Action */}
      <TouchableOpacity
        style={styles.joinBtn}
        onPress={() => onJoinRoom(appointment.id)}
        activeOpacity={0.85}
      >
        <Video size={16} color="#FFFFFF" />
        <Text style={styles.joinBtnText}>Join 1:1 Video Room</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientCol: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  joinBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default AppointmentCard;
