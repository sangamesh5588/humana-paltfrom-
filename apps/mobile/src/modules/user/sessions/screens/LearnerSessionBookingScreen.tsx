import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Platform, 
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Globe,
  Sparkles,
  Target,
  Video,
  ListChecks,
  Users,
  Play,
  Check,
  AlertTriangle
} from 'lucide-react-native';
import { LearnerSessionsApi, ApprovedSession, AvailableSlot } from '../api/learnerSessions.api';
import RazorpayPaymentModal from '../../bookings/components/RazorpayPaymentModal';
import useAuthStore from '../../../../core/auth/store';

// Generate next 5 dates dynamically starting from today
const generateNextDates = () => {
  const dates = [];
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()];
    const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    const fullDateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    dates.push({ label, date: dateStr, isToday: i === 0, fullDateKey });
  }
  return dates;
};


export const LearnerSessionBookingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const setTabBarHidden = useAuthStore((state) => state.setTabBarHidden);

  // Hide Bottom Navigation Bar while viewing Session Booking / Detail screen
  useFocusEffect(
    React.useCallback(() => {
      setTabBarHidden(true);
    }, [setTabBarHidden])
  );

  const session: ApprovedSession = route.params?.session;

  const datesList = React.useMemo(() => generateNextDates(), []);
  const [selectedDateObj, setSelectedDateObj] = useState(datesList[0]);


  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedSlotDateTime, setSelectedSlotDateTime] = useState<string>('');
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState<boolean>(false);
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);

  React.useEffect(() => {
    if (!session?.id || !selectedDateObj?.fullDateKey) return;

    let isActive = true;
    const loadSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await LearnerSessionsApi.getAvailableSlots(session.id, selectedDateObj.fullDateKey);
        if (!isActive) return;
        const slots = res.slots || [];
        setAvailableSlots(slots);
        setSelectedTimeSlot(slots[0]?.time || '');
        setSelectedSlotDateTime(slots[0]?.slotDateTime || '');
      } finally {
        if (isActive) setSlotsLoading(false);
      }
    };

    loadSlots();
    return () => {
      isActive = false;
    };
  }, [session?.id, selectedDateObj?.fullDateKey]);

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  if (!session) {
    return (
      <View style={styles.errorCenter}>
        <Text style={styles.errorText}>Session details unavailable.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [paymentFailedModalVisible, setPaymentFailedModalVisible] = useState<boolean>(false);

  const handleBooking = async () => {
    if (!selectedSlotDateTime) {
      Alert.alert('Select Time Slot', 'Please select an available time slot for your call.');
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await LearnerSessionsApi.createBookingOrder(session.id, selectedSlotDateTime, answers);
      setCurrentOrderData({
        ...orderRes,
        sessionTitle: session.title,
        expertName: session.expertName,
      });
      setPaymentModalVisible(true);
    } catch (err: any) {
      Alert.alert('Booking Unavailable', err?.message || 'Unable to reserve this slot. Please choose another time.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails: {
    bookingId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setSubmitting(true);
    try {
      const verificationRes = await LearnerSessionsApi.verifyPayment(
        paymentDetails.bookingId,
        paymentDetails.razorpay_order_id,
        paymentDetails.razorpay_payment_id,
        paymentDetails.razorpay_signature
      );

      setPaymentModalVisible(false);
      setCurrentOrderData(null);

      navigation.replace('LearnerBookingSuccess', {
        booking: verificationRes.booking,
        session,
        meetingUrl: verificationRes.meetingUrl,
        slotDateTime: selectedSlotDateTime,
      });
    } catch (err: any) {
      await LearnerSessionsApi.recordPaymentFailure(paymentDetails.bookingId, err?.message || 'Payment verification failed');
      setPaymentModalVisible(false);
      setPaymentFailedModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentClose = async () => {
    if (currentOrderData?.bookingId) {
      await LearnerSessionsApi.recordPaymentFailure(currentOrderData.bookingId, 'User closed Razorpay checkout');
    }
    setPaymentModalVisible(false);
    setCurrentOrderData(null);
    setPaymentFailedModalVisible(true);
  };

  // Compute key takeaways / outcomes list
  const outcomesList = (session.outcomes && session.outcomes.length > 0)
    ? session.outcomes
    : (session.topics && session.topics.length > 0)
    ? session.topics
    : [
        'Personalized 1-on-1 strategy & action plan tailored to your goals',
        'Live expert feedback, resume / code review, and career navigation',
        'Direct Q&A session with actionable step-by-step roadmap'
      ];

  // Compute target audience list
  const audienceList = (session.targetAudience && session.targetAudience.length > 0)
    ? session.targetAudience
    : ['Software Engineers', 'Career Switchers', 'Students & Grads', 'Founders'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      {/* Clean Flat App Bar */}
      <View style={[styles.appBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle} numberOfLines={1}>Connect 1:1 Live</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Thumbnail & Video Preview Banner */}
        <View style={styles.mediaBannerBox}>
          {session.thumbnailUrl ? (
            <Image source={{ uri: session.thumbnailUrl }} style={styles.mediaImage} resizeMode="cover" />
          ) : (
            <View style={styles.mediaFallback}>
              <Sparkles size={36} color="#0284C7" />
            </View>
          )}

          {session.videoUrl ? (
            <View style={styles.playOverlay}>
              <View style={styles.playCircle}>
                <Play size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
              <Text style={styles.playText}>Watch 1:1 Introduction Video</Text>
            </View>
          ) : null}

          <View style={styles.durationPill}>
            <Clock size={11} color="#FFFFFF" />
            <Text style={styles.durationPillText}>{session.durationMinutes || 60} Mins HD Call</Text>
          </View>
        </View>

        {/* 1. Expert Header Row */}
        <TouchableOpacity 
          style={styles.expertHeaderRow}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PublicExpertProfile', { expertId: session.expertId, session })}
        >
          <Image source={{ uri: session.expertAvatar }} style={styles.expertAvatar} />
          <View style={styles.expertTextCol}>
            <View style={styles.expertNameRow}>
              <Text style={styles.expertName}>{session.expertName}</Text>
              <CheckCircle2 size={15} color="#059669" />
            </View>
            <Text style={styles.expertHeadline} numberOfLines={1}>
              {session.expertHeadline} • {session.expertCompany}
            </Text>
          </View>
        </TouchableOpacity>

        {/* 2. Session Title & Overview Section */}
        <View style={styles.flatSection}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionDesc}>{session.description}</Text>

          {/* Meta Tags Row */}
          <View style={styles.metaTagsRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{session.category || 'Career Strategy'}</Text>
            </View>

            <View style={styles.metaBadge}>
              <Clock size={12} color="#0284C7" />
              <Text style={styles.metaBadgeText}>{session.durationMinutes || 60} Mins Call</Text>
            </View>

            <View style={styles.metaBadge}>
              <Video size={12} color="#059669" />
              <Text style={styles.metaBadgeText}>1:1 HD Video Call</Text>
            </View>

            <View style={styles.metaBadge}>
              <Globe size={12} color="#64748B" />
              <Text style={styles.metaBadgeText}>{session.language || 'English'}</Text>
            </View>
          </View>
        </View>

        {/* 3. What You Will Gain (Learner Wording) */}
        <View style={styles.flatSection}>
          <View style={styles.sectionTitleRow}>
            <ListChecks size={18} color="#0284C7" />
            <Text style={styles.sectionTitle}>What You'll Gain in This 1:1 Call</Text>
          </View>

          <View style={styles.bulletList}>
            {outcomesList.map((item, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <View style={styles.greenCheckBullet}>
                  <Check size={10} color="#FFFFFF" strokeWidth={3.5} />
                </View>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Step-by-Step Live Agenda */}
        {session.explanation ? (
          <View style={styles.flatSection}>
            <View style={styles.sectionTitleRow}>
              <Target size={18} color="#0284C7" />
              <Text style={styles.sectionTitle}>Step-by-Step Live Agenda</Text>
            </View>
            <Text style={styles.explanationText}>{session.explanation}</Text>
          </View>
        ) : (
          <View style={styles.flatSection}>
            <View style={styles.sectionTitleRow}>
              <Target size={18} color="#0284C7" />
              <Text style={styles.sectionTitle}>Step-by-Step Live Agenda</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownBadge}><Text style={styles.breakdownBadgeText}>5 Mins</Text></View>
              <Text style={styles.breakdownDesc}>Introduction & Goal Alignment</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownBadge}><Text style={styles.breakdownBadgeText}>45 Mins</Text></View>
              <Text style={styles.breakdownDesc}>Deep Dive, Code / Resume Audit & Strategy</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownBadge}><Text style={styles.breakdownBadgeText}>10 Mins</Text></View>
              <Text style={styles.breakdownDesc}>Action Plan Summary & Q&A</Text>
            </View>
          </View>
        )}

        {/* 5. Who Will Benefit Most */}
        <View style={styles.flatSection}>
          <View style={styles.sectionTitleRow}>
            <Users size={18} color="#0284C7" />
            <Text style={styles.sectionTitle}>Who Will Benefit Most</Text>
          </View>

          <View style={styles.audienceGrid}>
            {audienceList.map((aud, idx) => (
              <View key={idx} style={styles.audienceChip}>
                <Text style={styles.audienceChipText}>{aud}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Select Date */}
        <View style={styles.flatSection}>
          <View style={styles.sectionTitleRow}>
            <CalendarIcon size={18} color="#0284C7" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {datesList.map((item) => {
              const isSelected = selectedDateObj.fullDateKey === item.fullDateKey;
              return (
                <TouchableOpacity
                  key={item.fullDateKey}
                  style={[styles.dateChip, isSelected && styles.selectedDateChip]}
                  onPress={() => setSelectedDateObj(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateLabel, isSelected && styles.selectedDateText]}>{item.label}</Text>
                  <Text style={[styles.dateVal, isSelected && styles.selectedDateText]}>{item.date}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 7. Select Available Time Slot */}
        <View style={styles.flatSection}>
          <View style={styles.sectionTitleRow}>
            <Clock size={18} color="#0284C7" />
            <Text style={styles.sectionTitle}>Select Available Time Slot</Text>
          </View>

          {slotsLoading ? (
            <View style={{ paddingVertical: 18, alignItems: 'center' }}>
              <ActivityIndicator color="#0284C7" />
            </View>
          ) : availableSlots.length > 0 ? (
            <View style={styles.slotGrid}>
              {availableSlots.map((slot) => {
                const isSelected = selectedSlotDateTime === slot.slotDateTime;
                const displayTime = (() => {
                  if (!slot.slotDateTime) return slot.time;
                  const d = new Date(slot.slotDateTime);
                  return isNaN(d.getTime()) ? slot.time : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                })();

                return (
                  <TouchableOpacity
                    key={slot.slotDateTime}
                    style={[styles.slotChip, isSelected && styles.selectedSlotChip]}
                    onPress={() => {
                      setSelectedTimeSlot(displayTime);
                      setSelectedSlotDateTime(slot.slotDateTime);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.slotText, isSelected && styles.selectedSlotText]}>{displayTime}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' }}>
                No available slots for this date. Please select another date.
              </Text>
            </View>
          )}
        </View>

        {/* 8. Prepare for Your Session */}
        {session.bookingQuestions && session.bookingQuestions.length > 0 ? (
          <View style={styles.flatSection}>
            <Text style={styles.sectionTitle}>Prepare for Your Session</Text>
            <Text style={styles.sectionSub}>Answer these quick notes so Sangamesh K can tailor your 1:1 call:</Text>

            {session.bookingQuestions.map((q: string, idx: number) => (
              <View key={idx} style={styles.questionBox}>
                <Text style={styles.questionLabel}>{idx + 1}. {q}</Text>
                <TextInput
                  style={styles.questionInput}
                  placeholder="Type your response here..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={answers[`q_${idx}`] || ''}
                  onChangeText={(txt) => setAnswers({ ...answers, [`q_${idx}`]: txt })}
                />
              </View>
            ))}
          </View>
        ) : null}

        {/* 9. Flat Fee Summary Box */}
        <View style={styles.flatSummaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Scheduled Slot:</Text>
            <Text style={styles.summaryValue}>{selectedDateObj.date} @ {selectedTimeSlot || 'Select Slot'}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Fee:</Text>
            <Text style={styles.totalValue}>₹{session.priceAmount || 1499}</Text>
          </View>

          <View style={styles.guaranteeBox}>
            <ShieldCheck size={16} color="#059669" />
            <Text style={styles.guaranteeText}>100% Satisfaction Guarantee • Verified Expert Call</Text>
          </View>
        </View>

        {/* Confirm Booking CTA */}
        <TouchableOpacity 
          style={[styles.confirmBtn, submitting && styles.disabledBtn]} 
          activeOpacity={0.88}
          onPress={handleBooking}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm & Connect 1:1 Live (₹{session.priceAmount || 1499})</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <RazorpayPaymentModal
        visible={paymentModalVisible}
        orderData={currentOrderData}
        onClose={handlePaymentClose}
        onPaymentSuccess={handlePaymentSuccess}
      />
      {/* Payment Failure & Retry Modal */}
      <Modal visible={paymentFailedModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBg}>
              <AlertTriangle size={32} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Payment Unsuccessful</Text>
            <Text style={styles.modalSub}>
              We couldn't process your transaction. Don't worry, your slot reservation is saved.
            </Text>

            <TouchableOpacity 
              style={styles.retryBtn}
              activeOpacity={0.8}
              onPress={() => {
                setPaymentFailedModalVisible(false);
                handleBooking();
              }}
            >
              <Text style={styles.retryBtnText}>Retry Razorpay Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelModalBtn}
              activeOpacity={0.8}
              onPress={() => setPaymentFailedModalVisible(false)}
            >
              <Text style={styles.cancelModalBtnText}>Cancel</Text>
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
    backgroundColor: '#FFFFFF',
  },
  errorCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#64748B',
  },
  backBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 18,
    gap: 20,
    paddingBottom: 60,
  },
  mediaBannerBox: {
    width: '100%',
    height: 185,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  durationPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  durationPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  expertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  expertAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expertTextCol: {
    flex: 1,
  },
  expertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expertName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  expertHeadline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  flatSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 18,
    gap: 12,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
  },
  sessionDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  metaTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  categoryPill: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: -6,
  },
  bulletList: {
    gap: 10,
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  greenCheckBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  bulletText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    flex: 1,
    fontWeight: '600',
  },
  explanationText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 21,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  breakdownBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369A1',
  },
  breakdownDesc: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  audienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  audienceChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  audienceChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  dateList: {
    gap: 10,
    marginTop: 4,
  },
  dateChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 2,
  },
  selectedDateChip: {
    backgroundColor: '#0284C7',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  dateVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  slotChip: {
    width: '30%',
    backgroundColor: '#F1F5F9',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedSlotChip: {
    backgroundColor: '#0284C7',
  },
  slotText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  selectedSlotText: {
    color: '#FFFFFF',
  },
  questionBox: {
    gap: 6,
    marginTop: 4,
  },
  questionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  questionInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#0F172A',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  flatSummaryBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#BAE6FD',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0284C7',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  guaranteeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  confirmBtn: {
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
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
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    width: '100%',
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  cancelModalBtn: {
    paddingVertical: 8,
  },
  cancelModalBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LearnerSessionBookingScreen;





