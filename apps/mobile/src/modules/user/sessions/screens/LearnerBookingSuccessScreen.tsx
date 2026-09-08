import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  Image,
  Clipboard
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  CheckCircle2, 
  Calendar, 
  Video, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Compass 
} from 'lucide-react-native';

export const LearnerBookingSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState<boolean>(false);

  const booking = route.params?.booking;
  const session = route.params?.session;
  const meetingUrl = route.params?.meetingUrl || booking?.meetingUrl || 'https://humanplatform.daily.co/room-demo';
  const rawSlotDateTime = route.params?.slotDateTime || booking?.slotDateTime || 'Jul 25, 2026 @ 10:30 AM';
  
  const slotDateTime = React.useMemo(() => {
    if (!rawSlotDateTime) return 'Scheduled Session';
    try {
      const d = new Date(rawSlotDateTime);
      if (isNaN(d.getTime())) return String(rawSlotDateTime);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} @ ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } catch {
      return String(rawSlotDateTime);
    }
  }, [rawSlotDateTime]);

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  const handleCopyLink = () => {
    Clipboard.setString(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const expertName = session?.expertName || booking?.expert?.firstName ? `${booking?.expert?.firstName} ${booking?.expert?.lastName || ''}`.trim() : 'Verified Expert';
  const expertAvatar = session?.expertAvatar || booking?.expert?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      <View style={[styles.content, { paddingTop: topInset + 16 }]}>
        {/* Celebration Header */}
        <View style={styles.successIconCircle}>
          <CheckCircle2 size={52} color="#059669" />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your 1-on-1 strategy session with <Text style={{ fontWeight: '800', color: '#0F172A' }}>{expertName}</Text> is reserved.
        </Text>

        {/* Booking Details Card */}
        <View style={styles.detailsCard}>
          {/* Expert Info Row */}
          <View style={styles.expertHeaderRow}>
            <Image source={{ uri: expertAvatar }} style={styles.expertAvatar} />
            <View style={styles.expertTextCol}>
              <Text style={styles.expertName}>{expertName}</Text>
              <Text style={styles.sessionTitle} numberOfLines={1}>{session?.title || '1:1 Live Strategy Call'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Calendar size={16} color="#0284C7" />
            <Text style={styles.detailText}>{slotDateTime}</Text>
          </View>

          {/* Meeting Room Link Row */}
          <View style={styles.meetingBox}>
            <View style={styles.meetingBoxLeft}>
              <Video size={16} color="#059669" />
              <Text style={styles.meetingUrlText} numberOfLines={1}>{meetingUrl}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} activeOpacity={0.8}>
              {copied ? (
                <Check size={14} color="#059669" />
              ) : (
                <Copy size={14} color="#0284C7" />
              )}
              <Text style={[styles.copyBtnText, copied && { color: '#059669' }]}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guaranteeBox}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.guaranteeText}>Payment Verified via Razorpay • 100% Refund Guarantee</Text>
          </View>
        </View>

        {/* CTAs */}
        <View style={styles.btnCol}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MainTabs', { screen: 'BookingsTab' })}
          >
            <Text style={styles.primaryBtnText}>View My 1:1 Live Calls</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          >
            <Compass size={18} color="#0284C7" />
            <Text style={styles.secondaryBtnText}>Explore More Sessions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginVertical: 4,
  },
  expertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expertAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  expertTextCol: {
    flex: 1,
    gap: 2,
  },
  expertName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sessionTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  meetingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  meetingBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  meetingUrlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  btnCol: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  primaryBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  secondaryBtnText: {
    color: '#0284C7',
    fontSize: 14.5,
    fontWeight: '800',
  },
});


export default LearnerBookingSuccessScreen;
