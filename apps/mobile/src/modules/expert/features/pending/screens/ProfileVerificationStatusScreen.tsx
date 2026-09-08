import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, AlertCircle, UserCheck, Smartphone } from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';

export const ProfileVerificationStatusScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileStatus = async () => {
    try {
      const data = await ExpertApi.getProfile();
      if (data) setProfile(data);
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileStatus();
    setRefreshing(false);
  };

  const status = profile?.identityStatus || profile?.expertStatus || 'UNVERIFIED';
  const isApproved = status === 'VERIFIED' || status === 'APPROVED' || profile?.aadhaarVerified || profile?.phoneVerified;
  const isPending = status === 'PENDING' || status === 'PENDING_REVIEW';
  const isRejected = status === 'REJECTED';

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Profile Identity Status</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <RefreshCw size={18} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0369A1']} tintColor="#0369A1" />}
      >
        {/* Status Hero Card */}
        <View style={styles.heroCard}>
          <View style={[styles.iconCircle, isApproved ? styles.approvedBg : isRejected ? styles.rejectedBg : styles.pendingBg]}>
            {isApproved ? (
              <ShieldCheck size={36} color="#059669" />
            ) : isRejected ? (
              <AlertCircle size={36} color="#DC2626" />
            ) : (
              <Clock size={36} color="#D97706" />
            )}
          </View>

          <View style={[styles.statusPill, isApproved ? styles.approvedPill : isRejected ? styles.rejectedPill : styles.pendingPill]}>
            <Text style={[styles.statusPillText, isApproved ? styles.approvedText : isRejected ? styles.rejectedText : styles.pendingText]}>
              {isApproved ? 'VERIFIED IDENTITY' : isRejected ? 'REJECTED' : isPending ? 'UNDER REVIEW' : 'UNVERIFIED'}
            </Text>
          </View>

          <Text style={styles.title}>
            {isApproved
              ? 'Profile Identity Verified!'
              : isRejected
              ? 'Identity Review Rejected'
              : isPending
              ? 'Profile Identity Under Review'
              : 'Identity Unverified'}
          </Text>

          <Text style={styles.subtitle}>
            {isApproved
              ? 'Your personal identity and phone/Aadhaar credentials are fully verified.'
              : isRejected
              ? profile?.rejectionReason || 'Your submitted identity proof could not be verified by Admin.'
              : isPending
              ? 'Your identity documents have been submitted and are currently being audited by our Trust & Safety Team.'
              : 'Complete your phone & Aadhaar government ID verification to secure your account.'}
          </Text>
        </View>

        {/* Verification Items Checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.sectionHeader}>Verification Checklist</Text>

          {/* Phone */}
          <View style={styles.checkItem}>
            <View style={styles.checkIconWrap}>
              <Smartphone size={20} color="#2563EB" />
            </View>
            <View style={styles.checkTextWrap}>
              <Text style={styles.checkTitle}>Phone Number OTP</Text>
              <Text style={styles.checkSub}>Primary authentication mobile number</Text>
            </View>
            <View style={[styles.badgePill, profile?.phoneVerified || isApproved ? styles.badgeVerified : styles.badgeUnverified]}>
              <Text style={[styles.badgeText, profile?.phoneVerified || isApproved ? styles.badgeTextVerified : styles.badgeTextUnverified]}>
                {profile?.phoneVerified || isApproved ? 'VERIFIED' : 'PENDING'}
              </Text>
            </View>
          </View>

          {/* Govt ID */}
          <View style={styles.checkItem}>
            <View style={styles.checkIconWrap}>
              <UserCheck size={20} color="#0D9488" />
            </View>
            <View style={styles.checkTextWrap}>
              <Text style={styles.checkTitle}>Government ID / Aadhaar</Text>
              <Text style={styles.checkSub}>Official identity verification</Text>
            </View>
            <View style={[styles.badgePill, profile?.aadhaarVerified || isApproved ? styles.badgeVerified : styles.badgeUnverified]}>
              <Text style={[styles.badgeText, profile?.aadhaarVerified || isApproved ? styles.badgeTextVerified : styles.badgeTextUnverified]}>
                {profile?.aadhaarVerified || isApproved ? 'VERIFIED' : 'UNVERIFIED'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.bottomBar}>
        {isRejected ? (
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.navigate('TopNotchIdentity')}>
            <Text style={styles.retryBtnText}>Retry Identity Verification</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('ExpertBottomTabs')}>
            <Text style={styles.primaryBtnText}>Return to Dashboard</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  refreshBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 10 },
  appBarTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 24 },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  approvedBg: { backgroundColor: '#D1FAE5' },
  rejectedBg: { backgroundColor: '#FEE2E2' },
  pendingBg: { backgroundColor: '#FEF3C7' },
  statusPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  approvedPill: { backgroundColor: '#D1FAE5' },
  rejectedPill: { backgroundColor: '#FEE2E2' },
  pendingPill: { backgroundColor: '#FEF3C7' },
  statusPillText: { fontSize: 12, fontWeight: '800' },
  approvedText: { color: '#059669' },
  rejectedText: { color: '#DC2626' },
  pendingText: { color: '#D97706' },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkTextWrap: { flex: 1, gap: 2 },
  checkTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  checkSub: { fontSize: 12, color: '#64748B' },
  badgePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeVerified: { backgroundColor: '#D1FAE5' },
  badgeUnverified: { backgroundColor: '#F1F5F9' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  badgeTextVerified: { color: '#059669' },
  badgeTextUnverified: { color: '#64748B' },
  bottomBar: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  retryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 16,
  },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});

export default ProfileVerificationStatusScreen;
