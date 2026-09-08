import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  CheckCircle2, 
  Video, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  CreditCard,
  FileText
} from 'lucide-react-native';

export const BookingConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { booking, meetingUrl: routeMeetingUrl } = route.params || {};

  const bookingData = booking || {
    id: `bkg-${Date.now()}`,
    bookingNumber: `BKG-${Math.floor(100000 + Math.random() * 900000)}`,
    slotDateTime: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    priceAmount: 1499,
    status: 'CONFIRMED',
    meetingUrl: routeMeetingUrl || 'https://humanplatform.daily.co/room-live',
    session: { title: '1:1 Mentorship & Career Strategy Session' },
    expert: { firstName: 'Expert', lastName: 'Advisor' }
  };

  const meetingUrl = bookingData.meetingUrl || routeMeetingUrl || 'https://humanplatform.daily.co/room-live';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Hero Badge */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <CheckCircle2 size={48} color="#059669" />
          </View>

          <View style={styles.statusPill}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.statusPillText}>PAYMENT SUCCESSFUL & CONFIRMED</Text>
          </View>

          <Text style={styles.title}>Session Booking Confirmed!</Text>
          <Text style={styles.bookingNum}>Ref: {bookingData.bookingNumber}</Text>

          <Text style={styles.subtitle}>
            Your 1:1 live video mentorship session has been scheduled and recorded in the database.
          </Text>
        </View>

        {/* Session Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Session Overview</Text>

          <View style={styles.rowItem}>
            <FileText size={18} color="#0369A1" />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Session Title</Text>
              <Text style={styles.rowValue}>{bookingData.session?.title || '1:1 Mentorship Session'}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <Calendar size={18} color="#0369A1" />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Scheduled Date & Time</Text>
              <Text style={styles.rowValue}>{bookingData.slotDateTime}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <CreditCard size={18} color="#0369A1" />
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Amount Paid via Razorpay</Text>
              <Text style={styles.rowValue}>₹{bookingData.priceAmount?.toLocaleString() || '1,499'}</Text>
            </View>
          </View>
        </View>

        {/* Prep Q&A Card */}
        {bookingData.prepAnswers && bookingData.prepAnswers.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.cardHeader}>Saved Session Prep Q&A</Text>
            {bookingData.prepAnswers.map((qa: any, idx: number) => (
              <View key={idx} style={styles.qaItem}>
                <View style={styles.qaHeader}>
                  <HelpCircle size={14} color="#2563EB" />
                  <Text style={styles.qaQuestion}>{qa.questionText}</Text>
                </View>
                <Text style={styles.qaAnswer}>{qa.answerText}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Join Live Session Primary Banner */}
        <View style={styles.liveBanner}>
          <Video size={28} color="#FFFFFF" />
          <View style={styles.liveBannerText}>
            <Text style={styles.liveBannerTitle}>Live Video Room Ready</Text>
            <Text style={styles.liveBannerSub}>{meetingUrl}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.joinBtn}
          onPress={() => navigation.navigate('VideoCall', { bookingId: bookingData.id, meetingUrl })}
          activeOpacity={0.85}
        >
          <Video size={20} color="#FFFFFF" />
          <Text style={styles.joinBtnText}>Join 1:1 Live Video Call</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookingsBtn}
          onPress={() => navigation.navigate('Bookings')}
          activeOpacity={0.8}
        >
          <Text style={styles.bookingsBtnText}>View All My Bookings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  bookingNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    gap: 2,
  },
  rowLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  qaItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qaQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  qaAnswer: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 20,
  },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  liveBannerText: {
    flex: 1,
    gap: 2,
  },
  liveBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveBannerSub: {
    fontSize: 11,
    color: '#38BDF8',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  joinBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bookingsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  bookingsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});

export default BookingConfirmationScreen;
