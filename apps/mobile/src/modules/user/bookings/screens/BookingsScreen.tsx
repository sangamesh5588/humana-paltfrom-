import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Platform, 
  ActivityIndicator, 
  Modal, 
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles
} from 'lucide-react-native';
import { LearnerSessionsApi } from '../../sessions/api/learnerSessions.api';
import useAuthStore from '../../../../core/auth/store';

const formatBookingDateTime = (isoString: string) => {
  if (!isoString) return 'Date TBD';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = dayNames[d.getDay()];
  const monthName = monthNames[d.getMonth()];
  const dayNum = d.getDate();
  const year = d.getFullYear();
  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  return `${dayName}, ${monthName} ${dayNum}, ${year} @ ${timeStr}`;
};

export const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const setTabBarHidden = useAuthStore((state) => state.setTabBarHidden);

  // Restore tab bar when viewing Bookings screen
  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(false);
    }, [setTabBarHidden])
  );

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Cancellation Modal State
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelling, setCancelling] = useState<boolean>(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await LearnerSessionsApi.getMyBookings();
      setBookings(data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleCancelPress = (item: any) => {
    setSelectedBookingForCancel(item);
    setCancelReason('');
    setCancelModalVisible(true);
  };

  const submitCancellation = async () => {
    if (!selectedBookingForCancel) return;
    setCancelling(true);
    try {
      const res = await LearnerSessionsApi.cancelBooking(
        selectedBookingForCancel.id,
        cancelReason || 'Schedule conflict'
      );

      Alert.alert(
        'Booking Cancelled',
        `Your 1:1 call has been cancelled. Refund amount: ₹${res.refundAmount} (${res.refundPercentage}% refund applied).`
      );

      setCancelModalVisible(false);
      loadBookings();
    } catch {
      Alert.alert('Error', 'Could not process cancellation. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'UPCOMING') return b.status === 'CONFIRMED' || b.status === 'PENDING_PAYMENT';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'EXPIRED';
    return true;
  });

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      {/* Clean Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topInset + 6 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.headerSubTitle}>My 1:1 Live Calls</Text>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'UPCOMING' && styles.activeTabBtn]}
            onPress={() => setActiveTab('UPCOMING')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'UPCOMING' && styles.activeTabText]}>Upcoming</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'COMPLETED' && styles.activeTabBtn]}
            onPress={() => setActiveTab('COMPLETED')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'COMPLETED' && styles.activeTabText]}>Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'CANCELLED' && styles.activeTabBtn]}
            onPress={() => setActiveTab('CANCELLED')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'CANCELLED' && styles.activeTabText]}>Cancelled</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main List Content */}
      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingText}>Fetching your 1:1 sessions...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0284C7']} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Sparkles size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} bookings</Text>
              <Text style={styles.emptySub}>
                Book a 1:1 advisory call with top industry leaders to get started.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              {/* Card Header: Expert Row */}
              <View style={styles.expertRow}>
                <Image 
                  source={{ uri: item.expert?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} 
                  style={styles.expertAvatar} 
                />
                <View style={styles.expertInfoCol}>
                  <View style={styles.expertNameRow}>
                    <Text style={styles.expertName}>
                      {item.expert?.firstName} {item.expert?.lastName}
                    </Text>
                    <CheckCircle2 size={14} color="#059669" />
                  </View>
                  <Text style={styles.expertHeadline} numberOfLines={1}>
                    {item.expert?.headline || 'Senior Staff Expert'}
                  </Text>
                </View>

                {/* Status Badge */}
                <View style={[
                  styles.statusBadge, 
                  item.status === 'CONFIRMED' ? styles.confirmedBadge :
                  item.status === 'COMPLETED' ? styles.completedBadge : styles.cancelledBadge
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    item.status === 'CONFIRMED' ? styles.confirmedBadgeText :
                    item.status === 'COMPLETED' ? styles.completedBadgeText : styles.cancelledBadgeText
                  ]}>
                    {item.status === 'CONFIRMED' ? 'Confirmed' : item.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                  </Text>
                </View>
              </View>

              {/* Session Title & Category */}
              <Text style={styles.sessionTitle}>{item.session?.title || '1:1 Live Strategy Call'}</Text>

              {/* Time & Meeting Row */}
              <View style={styles.infoRow}>
                <Calendar size={14} color="#0284C7" />
                <Text style={styles.infoText}>{formatBookingDateTime(item.slotDateTime)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Clock size={14} color="#64748B" />
                <Text style={styles.infoText}>{item.durationMinutes || 60} Minutes Call • ₹{item.priceAmount || 1499}</Text>
              </View>

              {/* Actions Footer Bar */}
              {item.status === 'CONFIRMED' ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.joinCallBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('LiveVideoCall', { booking: item })}
                  >
                    <Video size={16} color="#FFFFFF" />
                    <Text style={styles.joinCallBtnText}>Join 1:1 Video Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelCallBtn}
                    activeOpacity={0.8}
                    onPress={() => handleCancelPress(item)}
                  >
                    <XCircle size={15} color="#DC2626" />
                    <Text style={styles.cancelCallBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
        />
      )}

      {/* Cancellation & Refund Modal */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.cancelIconBg}>
              <AlertCircle size={32} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Cancel 1:1 Live Call?</Text>
            <Text style={styles.modalSub}>
              Refund Policy: Cancelling 24+ hours prior receives a 100% refund (₹{selectedBookingForCancel?.priceAmount || 1499}).
            </Text>

            <View style={styles.reasonBox}>
              <Text style={styles.reasonLabel}>Reason for Cancellation:</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="Type reason here (e.g. Schedule conflict)..."
                placeholderTextColor="#94A3B8"
                value={cancelReason}
                onChangeText={setCancelReason}
              />
            </View>

            <TouchableOpacity 
              style={[styles.confirmCancelBtn, cancelling && { opacity: 0.6 }]}
              activeOpacity={0.8}
              onPress={submitCancellation}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmCancelBtnText}>Confirm Cancellation & Refund</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.keepBookingBtn}
              activeOpacity={0.8}
              onPress={() => setCancelModalVisible(false)}
            >
              <Text style={styles.keepBookingBtnText}>Keep My Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  titleRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  headerSubTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3.5,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10.5,
  },
  activeTabBtn: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#0284C7',
    fontWeight: '800',
  },
  listContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  expertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  expertInfoCol: {
    flex: 1,
  },
  expertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expertName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  expertHeadline: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confirmedBadge: { backgroundColor: '#ECFDF5' },
  completedBadge: { backgroundColor: '#E0F2FE' },
  cancelledBadge: { backgroundColor: '#FEF2F2' },
  statusBadgeText: { fontSize: 10.5, fontWeight: '800' },
  confirmedBadgeText: { color: '#059669' },
  completedBadgeText: { color: '#0284C7' },
  cancelledBadgeText: { color: '#DC2626' },
  sessionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 21,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 2,
  },
  joinCallBtn: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  joinCallBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cancelCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    gap: 4,
  },
  cancelCallBtnText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '800',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  cancelIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  reasonBox: {
    width: '100%',
    gap: 6,
    marginTop: 4,
  },
  reasonLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  reasonInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  confirmCancelBtn: {
    width: '100%',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  confirmCancelBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  keepBookingBtn: {
    paddingVertical: 6,
  },
  keepBookingBtnText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '700',
  },
});

export default BookingsScreen;
