import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  ShieldCheck, 
  Users, 
  Clock
} from 'lucide-react-native';
import { LearnerSessionsApi } from '../../sessions/api/learnerSessions.api';

export const VideoCallScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId, meetingUrl: routeMeetingUrl } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    const fetchRoom = async () => {
      setLoading(true);
      try {
        if (bookingId) {
          const data = await LearnerSessionsApi.getRoomToken(bookingId);
          setRoomData(data);
        } else {
          setRoomData({
            meetingUrl: routeMeetingUrl || 'https://humanplatform.daily.co/room-live',
            durationMinutes: 60,
          });
        }
      } catch (err) {
        console.warn('Error fetching room token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();

    // Live call duration counter
    timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [bookingId, routeMeetingUrl]);

  const handleEndCall = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this live 1:1 mentorship video call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive', 
          onPress: () => navigation.navigate('Bookings') 
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0369A1" />
        <Text style={styles.loadingText}>Connecting to Live Video Room...</Text>
      </View>
    );
  }

  const meetingUrl = roomData?.meetingUrl || routeMeetingUrl || 'https://humanplatform.daily.co/room-live';

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Session Header */}
      <View style={styles.topBar}>
        <View style={styles.liveBadge}>
          <View style={styles.redDot} />
          <Text style={styles.liveBadgeText}>LIVE SESSION</Text>
        </View>

        <View style={styles.timerBox}>
          <Clock size={14} color="#94A3B8" />
          <Text style={styles.timerText}>{formatTime(callDuration)}</Text>
        </View>

        <View style={styles.secureBadge}>
          <ShieldCheck size={16} color="#059669" />
          <Text style={styles.secureText}>Encrypted</Text>
        </View>
      </View>

      {/* Main Video Meeting Window */}
      <View style={styles.videoStage}>
        {cameraOff ? (
          <View style={styles.cameraOffPlaceholder}>
            <VideoOff size={48} color="#64748B" />
            <Text style={styles.cameraOffText}>Your Camera is Off</Text>
          </View>
        ) : (
          <View style={styles.activeStageCard}>
            <View style={styles.peerAvatarCircle}>
              <Users size={48} color="#38BDF8" />
            </View>
            <Text style={styles.peerName}>1:1 Mentorship Live Session</Text>
            <Text style={styles.roomUrlText}>{meetingUrl}</Text>
          </View>
        )}

        {/* Small Self Video Preview Card */}
        <View style={styles.selfPreviewCard}>
          <Text style={styles.selfLabel}>You ({micMuted ? 'Muted' : 'Unmuted'})</Text>
        </View>
      </View>

      {/* Meeting Controls Bottom Bar */}
      <View style={styles.controlsBar}>
        {/* Mic Button */}
        <TouchableOpacity 
          style={[styles.controlBtn, micMuted ? styles.btnActiveOff : styles.btnActiveOn]} 
          onPress={() => setMicMuted(!micMuted)}
          activeOpacity={0.8}
        >
          {micMuted ? <MicOff size={22} color="#FFFFFF" /> : <Mic size={22} color="#FFFFFF" />}
        </TouchableOpacity>

        {/* Camera Button */}
        <TouchableOpacity 
          style={[styles.controlBtn, cameraOff ? styles.btnActiveOff : styles.btnActiveOn]} 
          onPress={() => setCameraOff(!cameraOff)}
          activeOpacity={0.8}
        >
          {cameraOff ? <VideoOff size={22} color="#FFFFFF" /> : <VideoIcon size={22} color="#FFFFFF" />}
        </TouchableOpacity>

        {/* End Call Button */}
        <TouchableOpacity 
          style={styles.endCallBtn} 
          onPress={handleEndCall}
          activeOpacity={0.85}
        >
          <PhoneOff size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FCA5A5',
    letterSpacing: 0.5,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  videoStage: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  activeStageCard: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  peerAvatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  peerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  roomUrlText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  cameraOffPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  cameraOffText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  selfPreviewCard: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 100,
    height: 140,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    padding: 8,
    justifyContent: 'flex-end',
  },
  selfLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 20,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActiveOn: {
    backgroundColor: '#334155',
  },
  btnActiveOff: {
    backgroundColor: '#DC2626',
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default VideoCallScreen;
