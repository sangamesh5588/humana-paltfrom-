import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Platform, 
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Clock, 
  Video, 
  CheckCircle, 
  AlertTriangle, 
  Share2, 
  Edit3, 
  Play, 
  Globe, 
  Tag, 
  UserCheck, 
  Target, 
  HelpCircle 
} from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';

export const SessionDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const sessionId = route.params?.sessionId;
  const initialData = route.params?.sessionData;

  const [session, setSession] = useState<any>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  useEffect(() => {
    if (sessionId) {
      ExpertApi.getSessionDetails(sessionId)
        .then((res) => {
          if (res) setSession(res);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  if (loading && !session) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#0369A1" />
        <Text style={styles.loadingText}>Loading Session Details...</Text>
      </View>
    );
  }

  const title = session?.title || 'Untitled Session';
  const description = session?.description || '';
  const explanation = session?.explanation || description;
  const category = session?.category || 'Career Strategy';
  const language = session?.language || 'English';
  const duration = session?.durationMinutes || 60;
  const price = session?.priceAmount || 1499;
  const status = session?.status || 'DRAFT';
  const thumbnailUrl = session?.thumbnailUrl;
  const videoUrl = session?.videoUrl;
  const topics = session?.topics || [];
  const targetAudience = session?.targetAudience || [];
  const outcomes = session?.outcomes || [];
  const bookingQuestions = session?.bookingQuestions || [];

  const isApproved = status === 'APPROVED';
  const isSubmitted = status === 'SUBMITTED';
  const isRejected = status === 'REJECTED';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      {/* Header Bar */}
      <View style={[styles.appBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle} numberOfLines={1}>Session Details</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CreateSession', { sessionId: session?.id, sessionData: session })}>
          <Edit3 size={20} color="#0369A1" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Media Player / Banner Header */}
        <View style={styles.mediaBannerBox}>
          {thumbnailUrl ? (
            <Image source={{ uri: thumbnailUrl }} style={styles.mediaImage} resizeMode="cover" />
          ) : (
            <View style={styles.mediaFallback}>
              <Video size={42} color="#0284C7" />
              <Text style={styles.mediaFallbackText}>Human Platform Video Session</Text>
            </View>
          )}

          {/* Video Play Button Overlay */}
          {videoUrl && !isPlayingVideo ? (
            <TouchableOpacity 
              style={styles.playOverlayBtn} 
              activeOpacity={0.8}
              onPress={() => setIsPlayingVideo(true)}
            >
              <View style={styles.playCircle}>
                <Play size={28} color="#FFFFFF" style={{ marginLeft: 3 }} />
              </View>
              <Text style={styles.playBtnText}>Play Pitch Video</Text>
            </TouchableOpacity>
          ) : null}

          {/* Duration Badge */}
          <View style={styles.ytDurationBadge}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.ytDurationText}>{duration}:00 Mins</Text>
          </View>
        </View>

        {/* Title & Quick Meta Section */}
        <View style={styles.sectionCard}>
          <View style={styles.statusRow}>
            {isApproved ? (
              <View style={styles.statusApprovedBadge}>
                <CheckCircle size={13} color="#059669" />
                <Text style={styles.statusApprovedText}>Approved & Live</Text>
              </View>
            ) : isSubmitted ? (
              <View style={styles.statusPendingBadge}>
                <Clock size={13} color="#B45309" />
                <Text style={styles.statusPendingText}>Under Admin Review</Text>
              </View>
            ) : isRejected ? (
              <View style={styles.statusRejectedBadge}>
                <AlertTriangle size={13} color="#DC2626" />
                <Text style={styles.statusRejectedText}>Action Needed</Text>
              </View>
            ) : (
              <View style={styles.statusDraftBadge}>
                <Text style={styles.statusDraftText}>Draft</Text>
              </View>
            )}

            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>₹{price}</Text>
            </View>
          </View>

          <Text style={styles.titleText}>{title}</Text>

          <View style={styles.subMetaRow}>
            <View style={styles.subMetaItem}>
              <Tag size={14} color="#0284C7" />
              <Text style={styles.subMetaText}>{category}</Text>
            </View>

            <View style={styles.subMetaItem}>
              <Globe size={14} color="#64748B" />
              <Text style={styles.subMetaText}>{language}</Text>
            </View>
          </View>

          {description ? (
            <Text style={styles.descText}>{description}</Text>
          ) : null}
        </View>

        {/* About Session Explanation */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionCardTitle}>About This Session</Text>
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>

        {/* Topics Covered */}
        {topics.length > 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Target size={18} color="#0284C7" />
              <Text style={styles.sectionCardTitle}>What We Cover</Text>
            </View>

            <View style={styles.listContainer}>
              {topics.map((t: string, idx: number) => (
                <View key={idx} style={styles.listItemRow}>
                  <Text style={styles.bulletCheck}>✓</Text>
                  <Text style={styles.listItemText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Target Audience */}
        {targetAudience.length > 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <UserCheck size={18} color="#0284C7" />
              <Text style={styles.sectionCardTitle}>Who Is This For?</Text>
            </View>

            <View style={styles.audiencePillRow}>
              {targetAudience.map((aud: string, idx: number) => (
                <View key={idx} style={styles.audiencePill}>
                  <Text style={styles.audiencePillText}>{aud}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Learner Outcomes */}
        {outcomes.length > 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <CheckCircle size={18} color="#059669" />
              <Text style={styles.sectionCardTitle}>Expected Outcomes</Text>
            </View>

            <View style={styles.listContainer}>
              {outcomes.map((o: string, idx: number) => (
                <View key={idx} style={styles.listItemRow}>
                  <Text style={styles.bulletStar}>★</Text>
                  <Text style={styles.listItemText}>{o}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Learner Preparation Questions */}
        {bookingQuestions.length > 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <HelpCircle size={18} color="#0284C7" />
              <Text style={styles.sectionCardTitle}>Learner Questions Before Booking</Text>
            </View>

            <View style={styles.listContainer}>
              {bookingQuestions.map((q: string, idx: number) => (
                <View key={idx} style={styles.questionRow}>
                  <Text style={styles.questionNum}>{idx + 1}.</Text>
                  <Text style={styles.questionText}>{q}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity 
            style={styles.primaryEditBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreateSession', { sessionId: session?.id, sessionData: session })}
          >
            <Edit3 size={18} color="#FFFFFF" />
            <Text style={styles.primaryEditBtnText}>Edit Session Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryShareBtn} activeOpacity={0.8}>
            <Share2 size={18} color="#0369A1" />
            <Text style={styles.secondaryShareBtnText}>Share Public Link</Text>
          </TouchableOpacity>
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
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
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
    borderRadius: 12,
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
    marginHorizontal: 12,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 60,
  },
  mediaBannerBox: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E0F2FE',
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
    gap: 8,
  },
  mediaFallbackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  playOverlayBtn: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  ytDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ytDurationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusApprovedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusApprovedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  statusPendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPendingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  statusRejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusRejectedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  statusDraftBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusDraftText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  pricePill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pricePillText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  subMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subMetaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  descText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  explanationText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  listContainer: {
    gap: 8,
    marginTop: 4,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletCheck: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
  },
  bulletStar: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  listItemText: {
    fontSize: 13.5,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  audiencePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  audiencePill: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  audiencePillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  questionNum: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  questionText: {
    fontSize: 13.5,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  actionBtnContainer: {
    gap: 10,
    marginTop: 8,
  },
  primaryEditBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  primaryEditBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  secondaryShareBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  secondaryShareBtnText: {
    color: '#0369A1',
    fontSize: 14.5,
    fontWeight: '800',
  },
});

export default SessionDetailsScreen;
