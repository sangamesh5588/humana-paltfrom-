import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Video, ChevronRight, Calendar } from 'lucide-react-native';

interface SessionItem {
  id: string;
  clientName: string;
  clientInitials: string;
  serviceTitle: string;
  timeString: string;
  durationMinutes: number;
  status: 'CONFIRMED' | 'UPCOMING';
}

interface UpcomingSessionsCardProps {
  onSeeAllPress?: () => void;
  onJoinPress?: (sessionId: string) => void;
  onSetSlotsPress?: () => void;
}

export const UpcomingSessionsCard: React.FC<UpcomingSessionsCardProps> = ({
  onSeeAllPress,
  onJoinPress,
  onSetSlotsPress,
}) => {
  // Mock upcoming session items (simulating live upcoming bookings)
  const sessions: SessionItem[] = [
    {
      id: 'b-101',
      clientName: 'Alex Morgan',
      clientInitials: 'AM',
      serviceTitle: '1:1 Tech Strategy & Architecture',
      timeString: 'Today, 4:30 PM',
      durationMinutes: 45,
      status: 'UPCOMING',
    },
    {
      id: 'b-102',
      clientName: 'David Chen',
      clientInitials: 'DC',
      serviceTitle: 'Code Audit & Performance Review',
      timeString: 'Tomorrow, 11:00 AM',
      durationMinutes: 60,
      status: 'CONFIRMED',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Section Title & Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Upcoming Sessions</Text>
        <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7} style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={15} color="#0369A1" />
        </TouchableOpacity>
      </View>

      {/* Upcoming Sessions List */}
      {sessions.length > 0 ? (
        <View style={styles.sessionsList}>
          {sessions.map((item) => (
            <View key={item.id} style={styles.sessionCard}>
              {/* Client Info Header */}
              <View style={styles.clientRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{item.clientInitials}</Text>
                </View>

                <View style={styles.clientCol}>
                  <Text style={styles.clientName}>{item.clientName}</Text>
                  <Text style={styles.serviceTitle} numberOfLines={1}>{item.serviceTitle}</Text>
                </View>

                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{item.status}</Text>
                </View>
              </View>

              {/* Time Badge & Join Action Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.timeBadge}>
                  <Clock size={13} color="#475569" />
                  <Text style={styles.timeText}>{item.timeString} • {item.durationMinutes}m</Text>
                </View>

                <TouchableOpacity 
                  style={styles.joinBtn} 
                  onPress={() => onJoinPress && onJoinPress(item.id)}
                  activeOpacity={0.8}
                >
                  <Video size={14} color="#FFFFFF" />
                  <Text style={styles.joinBtnText}>Join Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        /* Empty State Fallback */
        <View style={styles.emptyCard}>
          <Calendar size={28} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Upcoming Sessions Today</Text>
          <Text style={styles.emptySub}>Set your availability slots so clients can book consultations with you.</Text>
          <TouchableOpacity style={styles.setSlotsBtn} onPress={onSetSlotsPress} activeOpacity={0.8}>
            <Text style={styles.setSlotsBtnText}>Set Slots</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4338CA',
  },
  clientCol: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  serviceTitle: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  statusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#047857',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0369A1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  setSlotsBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 4,
  },
  setSlotsBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#4F46E5',
  },
});

export default UpcomingSessionsCard;
