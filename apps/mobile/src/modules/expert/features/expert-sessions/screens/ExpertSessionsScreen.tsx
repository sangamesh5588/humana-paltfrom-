import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  StatusBar, 
  Platform,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Plus, 
  Clock, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MoreVertical
} from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';
import ApiClient from '../../../../../core/api/client';

export const ExpertSessionsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ExpertApi.getExpertSessions();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions])
  );

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleResubmit = async (sessionId: string) => {
    try {
      await ApiClient.post(`/sessions/${sessionId}/resubmit`);
      Alert.alert('Resubmitted!', 'Your session has been resubmitted to Admin for review.');
      fetchSessions();
    } catch (e) {
      Alert.alert('Resubmit Error', 'Failed to resubmit session.');
    }
  };

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0369A1" translucent />

      {/* Header Bar */}
      <View style={[styles.headerContainer, { paddingTop: topInset + 8 }]}>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerSub}>1 to 1 Strategy Sessions</Text>
          <Text style={styles.headerTitle}>My Sessions</Text>
        </View>

        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateSession')}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#0369A1" />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner / Info Card */}
        <View style={styles.infoBanner}>
          <Sparkles size={20} color="#0369A1" />
          <View style={styles.infoBannerTextCol}>
            <Text style={styles.infoBannerTitle}>Active Session Offerings</Text>
            <Text style={styles.infoBannerSub}>Learners can book approved session types directly from your public expert profile.</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0369A1" />
            <Text style={styles.loadingText}>Loading your sessions...</Text>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Sessions Created Yet</Text>
            <Text style={styles.emptySub}>Create your first 1:1 strategy session to get started.</Text>
            <TouchableOpacity style={styles.createFirstBtn} onPress={() => navigation.navigate('CreateSession')}>
              <Text style={styles.createFirstBtnText}>+ Create First Session</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.servicesList}>
            {services.map((item) => {
              const status = item.status || 'DRAFT';
              const isApproved = status === 'APPROVED';
              const isSubmitted = status === 'SUBMITTED';
              const isRejected = status === 'REJECTED';

              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.serviceCard, !item.active && styles.disabledCard]}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('SessionDetails', { sessionId: item.id, sessionData: item })}
                >
                  {/* Full 16:9 Thumbnail Image Banner */}
                  <View style={styles.thumbnailBannerContainer}>
                    {item.thumbnailUrl ? (
                      <Image 
                        source={{ uri: item.thumbnailUrl }} 
                        style={styles.thumbnailBannerImage} 
                        resizeMode="cover" 
                      />
                    ) : (
                      <View style={styles.thumbnailFallbackBanner}>
                        <Sparkles size={36} color="#0284C7" />
                        <Text style={styles.thumbnailFallbackText}>Human Platform Session</Text>
                      </View>
                    )}

                    {/* Top Status & Active Switch Overlay */}
                    <View style={styles.bannerOverlayRow}>
                      {isApproved ? (
                        <View style={styles.statusApprovedBadge}>
                          <CheckCircle size={11} color="#059669" />
                          <Text style={styles.statusApprovedText}>Approved & Live</Text>
                        </View>
                      ) : isSubmitted ? (
                        <View style={styles.statusPendingBadge}>
                          <Clock size={11} color="#B45309" />
                          <Text style={styles.statusPendingText}>Under Review</Text>
                        </View>
                      ) : isRejected ? (
                        <View style={styles.statusRejectedBadge}>
                          <AlertTriangle size={11} color="#DC2626" />
                          <Text style={styles.statusRejectedText}>Action Needed</Text>
                        </View>
                      ) : (
                        <View style={styles.statusDraftBadge}>
                          <Text style={styles.statusDraftText}>Draft</Text>
                        </View>
                      )}

                      <Switch
                        value={item.active !== false}
                        onValueChange={() => toggleActive(item.id)}
                        trackColor={{ false: '#E2E8F0', true: '#BAE6FD' }}
                        thumbColor={item.active !== false ? '#0369A1' : '#94A3B8'}
                      />
                    </View>

                    {/* Bottom-Right YouTube-Style Duration Badge */}
                    <View style={styles.ytDurationBadge}>
                      <Clock size={10} color="#FFFFFF" />
                      <Text style={styles.ytDurationText}>{item.durationMinutes || 60}:00</Text>
                    </View>
                  </View>

                  {/* YouTube-Style Below-Thumbnail Details */}
                  <View style={styles.cardContentBody}>
                    <View style={styles.ytTitleRow}>
                      <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
                      
                      <TouchableOpacity 
                        style={styles.moreMenuBtn} 
                        onPress={() => {
                          Alert.alert(
                            item.title,
                            'Choose an action for this session:',
                            [
                              { 
                                text: 'Edit Session', 
                                onPress: () => navigation.navigate('CreateSession', { sessionId: item.id, sessionData: item }) 
                              },
                              { text: 'Share Link', onPress: () => {} },
                              { text: 'Cancel', style: 'cancel' }
                            ]
                          );
                        }}
                      >
                        <MoreVertical size={18} color="#64748B" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.categorySubText}>
                      {item.category || 'Career Strategy'} • 🌐 {item.language || 'English'} • {item.durationMinutes || 60} Mins
                    </Text>

                    {/* Admin Rejection Reason Box */}
                    {isRejected ? (
                      <View style={styles.rejectionBox}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <View style={styles.rejectionTextCol}>
                          <Text style={styles.rejectionBoxTitle}>Rejection Feedback</Text>
                          <Text style={styles.rejectionBoxText}>
                            {item.rejectionReason || 'Session video preview or details require revision before approval.'}
                          </Text>
                          <TouchableOpacity 
                            style={styles.resubmitBtnInline} 
                            onPress={() => handleResubmit(item.id)}
                          >
                            <RefreshCw size={12} color="#FFFFFF" />
                            <Text style={styles.resubmitBtnInlineText}>Resubmit</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#0369A1',
    borderBottomWidth: 1,
    borderBottomColor: '#0284C7',
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0F2FE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  addBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 110,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  infoBannerTextCol: {
    flex: 1,
    gap: 2,
  },
  infoBannerTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  infoBannerSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  servicesList: {
    gap: 14,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  disabledCard: {
    opacity: 0.6,
  },
  thumbnailBannerContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 12,
  },
  thumbnailBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  thumbnailFallbackBanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  thumbnailFallbackText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  bannerOverlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  ytDurationBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    zIndex: 2,
  },
  ytDurationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  cardContentBody: {
    padding: 12,
    gap: 4,
  },
  ytTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    lineHeight: 20,
  },
  moreMenuBtn: {
    padding: 2,
  },
  categorySubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  resubmitBtnInline: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginTop: 6,
  },
  resubmitBtnInlineText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  createFirstBtn: {
    backgroundColor: '#0369A1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  statusApprovedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusApprovedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  statusPendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPendingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  statusRejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusRejectedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  statusDraftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusDraftText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  rejectionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  rejectionTextCol: {
    flex: 1,
  },
  rejectionBoxTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#991B1B',
  },
  rejectionBoxText: {
    fontSize: 11.5,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  resubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  resubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default ExpertSessionsScreen;
