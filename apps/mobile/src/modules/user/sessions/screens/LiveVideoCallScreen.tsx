import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Platform, 
  Modal, 
  TextInput,
  Alert 
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  RotateCcw, 
  MessageSquare, 
  Star, 
  Clock
} from 'lucide-react-native';
import useAuthStore from '../../../../core/auth/store';

export const LiveVideoCallScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const setTabBarHidden = useAuthStore((state) => state.setTabBarHidden);

  // Hide Bottom Navigation Bar continuously during active 1:1 video call
  useFocusEffect(
    React.useCallback(() => {
      setTabBarHidden(true);
    }, [setTabBarHidden])
  );

  const booking = route.params?.booking;
  const session = route.params?.session || booking?.session;

  // In-Call Controls State
  const [micMuted, setMicMuted] = useState<boolean>(false);
  const [cameraOff, setCameraOff] = useState<boolean>(false);
  const [frontCamera, setFrontCamera] = useState<boolean>(true);
  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);
  const [notesText, setNotesText] = useState<string>('');

  // Call Countdown Timer (Default 60 mins = 3600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (booking?.durationMinutes || session?.durationMinutes || 60) * 60
  );

  // Post-Call Review Modal State
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [starRating, setStarRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setReviewModalVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End 1:1 Advisory Call?',
      'Are you sure you want to end this 1:1 live video call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => setReviewModalVisible(true),
        },
      ]
    );
  };

  const submitReview = () => {
    Alert.alert(
      'Thank You!',
      'Your review and feedback have been submitted successfully.'
    );
    setReviewModalVisible(false);
    navigation.replace('UserBottomTabs');
  };

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  const expertAvatar = session?.expertAvatar || booking?.expert?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
  const expertName = session?.expertName || (booking?.expert ? `${booking.expert.firstName} ${booking.expert.lastName}` : 'Sangamesh K');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent />

      {/* Main Remote Video View (Full-Screen) */}
      <View style={styles.remoteVideoBox}>
        {cameraOff ? (
          <View style={styles.cameraOffPlaceholder}>
            <Image source={{ uri: expertAvatar }} style={styles.cameraOffAvatar} />
            <Text style={styles.cameraOffText}>{expertName} (Video Muted)</Text>
          </View>
        ) : (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80' }} 
            style={styles.remoteVideoImage} 
            resizeMode="cover" 
          />
        )}

        {/* Top Header Live Bar Overlay */}
        <View style={[styles.topLiveBar, { paddingTop: topInset + 10 }]}>
          <View style={styles.liveIndicatorPill}>
            <View style={styles.liveRedDot} />
            <Text style={styles.liveText}>1:1 LIVE</Text>
          </View>

          <View style={styles.timerPill}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.timerText}>{formatTimer(secondsRemaining)}</Text>
          </View>
        </View>

        {/* Self-View Picture-in-Picture (PiP) Corner Overlay */}
        <View style={styles.pipBox}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }} 
            style={styles.pipImage} 
            resizeMode="cover" 
          />
          <View style={styles.pipLabel}>
            <Text style={styles.pipLabelText}>You</Text>
          </View>
        </View>

        {/* In-Call Shared Notes Drawer (Slide-Up Overlay) */}
        {chatDrawerOpen ? (
          <View style={styles.notesDrawer}>
            <View style={styles.notesHeader}>
              <Text style={styles.notesTitle}>In-Call Shared Notes & Chat</Text>
              <TouchableOpacity onPress={() => setChatDrawerOpen(false)}>
                <Text style={styles.closeNotesText}>Close</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="Paste links, code snippets, or notes here..."
              placeholderTextColor="#94A3B8"
              multiline
              value={notesText}
              onChangeText={setNotesText}
            />
          </View>
        ) : null}

        {/* Bottom Floating Control Bar */}
        <View style={[styles.bottomControlBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Mute Mic */}
          <TouchableOpacity 
            style={[styles.controlBtn, micMuted && styles.controlBtnActive]} 
            activeOpacity={0.8}
            onPress={() => setMicMuted(!micMuted)}
          >
            {micMuted ? <MicOff size={22} color="#FFFFFF" /> : <Mic size={22} color="#FFFFFF" />}
          </TouchableOpacity>

          {/* Toggle Camera */}
          <TouchableOpacity 
            style={[styles.controlBtn, cameraOff && styles.controlBtnActive]} 
            activeOpacity={0.8}
            onPress={() => setCameraOff(!cameraOff)}
          >
            {cameraOff ? <VideoOff size={22} color="#FFFFFF" /> : <Video size={22} color="#FFFFFF" />}
          </TouchableOpacity>

          {/* Flip Camera */}
          <TouchableOpacity 
            style={styles.controlBtn} 
            activeOpacity={0.8}
            onPress={() => setFrontCamera(!frontCamera)}
          >
            <RotateCcw size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Chat / Shared Notes */}
          <TouchableOpacity 
            style={[styles.controlBtn, chatDrawerOpen && styles.controlBtnActive]} 
            activeOpacity={0.8}
            onPress={() => setChatDrawerOpen(!chatDrawerOpen)}
          >
            <MessageSquare size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity 
            style={styles.endCallBtn} 
            activeOpacity={0.85}
            onPress={handleEndCall}
          >
            <PhoneOff size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post-Call Rating & Review Modal */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.reviewModalOverlay}>
          <View style={styles.reviewCard}>
            <View style={styles.expertReviewAvatarBg}>
              <Image source={{ uri: expertAvatar }} style={styles.expertReviewAvatar} />
            </View>

            <Text style={styles.reviewTitle}>Rate Your 1:1 Live Session</Text>
            <Text style={styles.reviewSub}>
              How was your advisory call with {expertName}?
            </Text>

            {/* 5-Star Rating Selector */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setStarRating(star)}>
                  <Star 
                    size={32} 
                    color={star <= starRating ? '#F59E0B' : '#CBD5E1'} 
                    fill={star <= starRating ? '#F59E0B' : 'transparent'} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Input */}
            <View style={styles.feedbackBox}>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Write a review or testimonial for this expert..."
                placeholderTextColor="#94A3B8"
                multiline
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitReviewBtn}
              activeOpacity={0.8}
              onPress={submitReview}
            >
              <Text style={styles.submitReviewBtnText}>Submit Rating & Finish</Text>
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
    backgroundColor: '#0F172A',
  },
  remoteVideoBox: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  remoteVideoImage: {
    width: '100%',
    height: '100%',
  },
  cameraOffPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#1E293B',
  },
  cameraOffAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraOffText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '700',
  },
  topLiveBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  liveIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveRedDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pipBox: {
    position: 'absolute',
    top: 90,
    right: 16,
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: '#334155',
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  pipLabel: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pipLabelText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  notesDrawer: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeNotesText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '700',
  },
  notesInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bottomControlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingTop: 16,
  },
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#DC2626',
  },
  endCallBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  reviewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  reviewCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  expertReviewAvatarBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0284C7',
    marginBottom: 4,
  },
  expertReviewAvatar: {
    width: '100%',
    height: '100%',
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  reviewSub: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
  },
  starRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 6,
  },
  feedbackBox: {
    width: '100%',
  },
  feedbackInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    fontSize: 13.5,
    color: '#0F172A',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitReviewBtn: {
    width: '100%',
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default LiveVideoCallScreen;
