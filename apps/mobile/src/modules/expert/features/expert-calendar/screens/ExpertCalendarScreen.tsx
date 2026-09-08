import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform, 
  Alert 
} from 'react-native';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Clock, 
  CheckCircle2 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CalendarDay {
  dayName: string; // e.g. "Mon"
  dayNumber: number; // e.g. 23
  dateStr: string; // e.g. "2026-07-23"
  hasBookings: boolean;
  isToday: boolean;
}

interface AppointmentItem {
  id: string;
  clientName: string;
  clientInitials: string;
  serviceTitle: string;
  timeSlot: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  avatarBg: string;
}

export const ExpertCalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Calendar State: Selected Active Date (default today)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-23');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(23);

  // Sample Weekly Date Strip Data
  const weekDays: CalendarDay[] = [
    { dayName: 'Mon', dayNumber: 20, dateStr: '2026-07-20', hasBookings: false, isToday: false },
    { dayName: 'Tue', dayNumber: 21, dateStr: '2026-07-21', hasBookings: true, isToday: false },
    { dayName: 'Wed', dayNumber: 22, dateStr: '2026-07-22', hasBookings: false, isToday: false },
    { dayName: 'Thu', dayNumber: 23, dateStr: '2026-07-23', hasBookings: true, isToday: true },
    { dayName: 'Fri', dayNumber: 24, dateStr: '2026-07-24', hasBookings: true, isToday: false },
    { dayName: 'Sat', dayNumber: 25, dateStr: '2026-07-25', hasBookings: false, isToday: false },
    { dayName: 'Sun', dayNumber: 26, dateStr: '2026-07-26', hasBookings: false, isToday: false },
  ];

  // Schedule Appointments per Date Map
  const appointmentsByDate: Record<string, AppointmentItem[]> = {
    '2026-07-21': [
      {
        id: 'session-101',
        clientName: 'Alex Morgan',
        clientInitials: 'AM',
        serviceTitle: 'Architecture Review & Code Audit',
        timeSlot: '02:00 PM - 03:00 PM',
        status: 'COMPLETED',
        avatarBg: '#8B5CF6',
      },
    ],
    '2026-07-23': [
      {
        id: 'session-102',
        clientName: 'Rahul Verma',
        clientInitials: 'RV',
        serviceTitle: '1:1 Tech Strategy & System Architecture',
        timeSlot: '10:30 AM - 11:30 AM',
        status: 'UPCOMING',
        avatarBg: '#2563EB',
      },
      {
        id: 'session-103',
        clientName: 'Sophia Lin',
        clientInitials: 'SL',
        serviceTitle: 'Career Advisory & Mock Interview',
        timeSlot: '04:00 PM - 05:00 PM',
        status: 'UPCOMING',
        avatarBg: '#EC4899',
      },
    ],
    '2026-07-24': [
      {
        id: 'session-104',
        clientName: 'David Miller',
        clientInitials: 'DM',
        serviceTitle: 'Senior Engineering Portfolio Review',
        timeSlot: '11:00 AM - 12:00 PM',
        status: 'UPCOMING',
        avatarBg: '#10B981',
      },
    ],
  };

  const currentAppointments = appointmentsByDate[selectedDateStr] || [];

  const handleJoinCall = (app: AppointmentItem) => {
    Alert.alert('Launching Video Consultation', `Connecting to secure 1:1 call with ${app.clientName}...`);
  };

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0369A1" translucent />

      {/* Steel Blue Header with Month & Navigation */}
      <View style={[styles.headerContainer, { paddingTop: topInset + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.monthCol}>
            <Text style={styles.monthTitle}>July 2026</Text>
            <Text style={styles.monthSub}>Interactive Calendar & Agenda</Text>
          </View>

          <View style={styles.monthNavActions}>
            <TouchableOpacity style={styles.navArrowBtn} activeOpacity={0.7}>
              <ChevronLeft size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navArrowBtn} activeOpacity={0.7}>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 7-Day Interactive Date Strip */}
        <View style={styles.dateStripRow}>
          {weekDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            return (
              <TouchableOpacity
                key={day.dateStr}
                style={[
                  styles.dayBox,
                  isSelected && styles.dayBoxSelected,
                  day.isToday && !isSelected && styles.dayBoxToday,
                ]}
                onPress={() => {
                  setSelectedDateStr(day.dateStr);
                  setSelectedDayNumber(day.dayNumber);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayNameText, isSelected && styles.dayNameSelected]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayNumText, isSelected && styles.dayNumSelected]}>
                  {day.dayNumber}
                </Text>
                {day.hasBookings && (
                  <View style={[styles.bookingDot, isSelected && styles.bookingDotSelected]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Selected Date Header */}
        <View style={styles.agendaHeaderRow}>
          <Text style={styles.agendaTitle}>
            Agenda for Thursday, July {selectedDayNumber}
          </Text>
          <View style={styles.badgeCountPill}>
            <Text style={styles.badgeCountText}>{currentAppointments.length} Sessions</Text>
          </View>
        </View>

        {/* Agenda Appointments List */}
        {currentAppointments.length > 0 ? (
          currentAppointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.avatarCircle, { backgroundColor: app.avatarBg }]}>
                  <Text style={styles.avatarText}>{app.clientInitials}</Text>
                </View>

                <View style={styles.clientDetailsCol}>
                  <Text style={styles.clientName}>{app.clientName}</Text>
                  <Text style={styles.serviceTitle}>{app.serviceTitle}</Text>
                </View>

                <View style={[
                  styles.statusBadge, 
                  app.status === 'COMPLETED' ? styles.statusCompleted : styles.statusUpcoming
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    app.status === 'COMPLETED' ? styles.statusCompletedText : styles.statusUpcomingText
                  ]}>
                    {app.status}
                  </Text>
                </View>
              </View>

              {/* Time Slot & Video Call Action */}
              <View style={styles.cardFooterRow}>
                <View style={styles.timeSlotRow}>
                  <Clock size={15} color="#0369A1" />
                  <Text style={styles.timeSlotText}>{app.timeSlot}</Text>
                </View>

                {app.status === 'UPCOMING' ? (
                  <TouchableOpacity 
                    style={styles.joinCallBtn} 
                    onPress={() => handleJoinCall(app)}
                    activeOpacity={0.8}
                  >
                    <Video size={14} color="#FFFFFF" />
                    <Text style={styles.joinCallBtnText}>Join Call</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.completedTag}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <Text style={styles.completedTagText}>Done</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyAgendaCard}>
            <View style={styles.emptyIconCircle}>
              <CalendarIcon size={24} color="#0369A1" />
            </View>
            <Text style={styles.emptyTitle}>No Sessions Scheduled for July {selectedDayNumber}</Text>
            <Text style={styles.emptySub}>
              Clients can view your available consultation hours and book 1:1 sessions on this day.
            </Text>
          </View>
        )}

        {/* Visual Open Time Slots Section for Today */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Open Time Slots ({selectedDayNumber} July)</Text>
          <Text style={styles.sectionSub}>Clients see these slots based on your weekly recurring schedule.</Text>

          <View style={styles.slotsGrid}>
            {['09:00 AM - 10:00 AM', '11:30 AM - 12:30 PM', '02:00 PM - 03:00 PM', '05:00 PM - 06:00 PM'].map((slot, idx) => (
              <View key={idx} style={styles.slotChip}>
                <Clock size={14} color="#0369A1" />
                <Text style={styles.slotChipText}>{slot}</Text>
                <View style={styles.openBadge}>
                  <Text style={styles.openBadgeText}>Open</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#0369A1',
    borderBottomWidth: 1,
    borderBottomColor: '#0284C7',
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthCol: {
    gap: 2,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  monthSub: {
    fontSize: 12,
    color: '#E0F2FE',
    opacity: 0.9,
  },
  monthNavActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayBox: {
    width: 44,
    height: 60,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  dayBoxSelected: {
    backgroundColor: '#FFFFFF',
  },
  dayBoxToday: {
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  dayNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0F2FE',
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: '#0369A1',
    fontWeight: '800',
  },
  dayNumText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dayNumSelected: {
    color: '#0369A1',
  },
  bookingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6EE7B7',
    marginTop: 1,
  },
  bookingDotSelected: {
    backgroundColor: '#0369A1',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 110,
  },
  agendaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agendaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  badgeCountPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCountText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clientDetailsCol: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  serviceTitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  statusUpcoming: {
    backgroundColor: '#E0F2FE',
  },
  statusUpcomingText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusCompletedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeSlotText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  joinCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0369A1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  joinCallBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  emptyAgendaCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: -4,
  },
  slotsGrid: {
    gap: 8,
    marginTop: 4,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
    marginLeft: 8,
  },
  openBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  openBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
});

export default ExpertCalendarScreen;
