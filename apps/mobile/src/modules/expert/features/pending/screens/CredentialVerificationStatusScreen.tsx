import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Clock, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, AlertCircle, GraduationCap, Briefcase } from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';

export const CredentialVerificationStatusScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { typeSlug, targetName: routeTargetName, experienceId, educationId } = route.params || {};

  const [statusRes, setStatusRes] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [targetName, setTargetName] = useState<string>(routeTargetName || '');

  const isEducation = typeSlug === 'education' || !!educationId;
  const isCareer = typeSlug === 'career' || !!experienceId;

  const fetchCredentialStatus = async () => {
    try {
      if (isEducation && educationId) {
        const res = await ExpertApi.getEducationCredentialStatus(educationId);
        setStatusRes(res);
      } else if (isCareer && experienceId) {
        const res = await ExpertApi.getCareerCredentialStatus(experienceId);
        setStatusRes(res);
      } else {
        const profile = await ExpertApi.getProfile();
        
        if (isEducation && profile.education?.length > 0) {
          const edu = profile.education[0];
          setTargetName(edu.institution || 'University');
          const res = await ExpertApi.getEducationCredentialStatus(edu.id);
          setStatusRes(res);
        } else if (isCareer && profile.experience?.length > 0) {
          const exp = profile.experience[0];
          setTargetName(exp.company || 'Company');
          const res = await ExpertApi.getCareerCredentialStatus(exp.id);
          setStatusRes(res);
        }
      }
    } catch {
      setStatusRes({ status: 'PENDING' });
    }
  };

  useEffect(() => {
    fetchCredentialStatus();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCredentialStatus();
    setRefreshing(false);
  };

  const status = statusRes?.status || statusRes?.session?.status || 'PENDING';
  const isApproved = status === 'VERIFIED' || status === 'APPROVED';
  const isRejected = status === 'REJECTED';

  const getHeaderTitle = () => {
    if (isEducation) return 'Education Credential Status';
    if (isCareer) return 'Career Credential Status';
    return 'Credential Verification Status';
  };

  const getSubTitle = () => {
    if (isApproved) {
      if (isEducation) return `Your degree credential ${targetName ? `(${targetName})` : ''} has been officially verified!`;
      if (isCareer) return `Your work experience credential ${targetName ? `(${targetName})` : ''} has been officially verified!`;
      return 'Your credential has been officially verified!';
    }
    if (isRejected) {
      return statusRes?.rejectionReason || 'The uploaded document proof could not be verified by Admin. Please submit a clear copy.';
    }
    if (isEducation) {
      return `Your degree proof ${targetName ? `for ${targetName} ` : ''}is being reviewed by our Admin Trust Team.`;
    }
    if (isCareer) {
      return `Your employment proof ${targetName ? `for ${targetName} ` : ''}is being reviewed by our Admin Trust Team.`;
    }
    return 'Your credential application is under audit.';
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>{getHeaderTitle()}</Text>
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
          <View style={[styles.iconCircle, isApproved ? styles.approvedBg : isRejected ? styles.rejectedBg : isEducation ? styles.eduBg : styles.careerBg]}>
            {isApproved ? (
              <ShieldCheck size={36} color="#059669" />
            ) : isRejected ? (
              <AlertCircle size={36} color="#DC2626" />
            ) : isEducation ? (
              <GraduationCap size={36} color="#1D4ED8" />
            ) : (
              <Briefcase size={36} color="#0D9488" />
            )}
          </View>

          <View style={[styles.statusPill, isApproved ? styles.approvedPill : isRejected ? styles.rejectedPill : styles.pendingPill]}>
            <Text style={[styles.statusPillText, isApproved ? styles.approvedText : isRejected ? styles.rejectedText : styles.pendingText]}>
              {isApproved ? 'VERIFIED' : isRejected ? 'REJECTED' : 'UNDER REVIEW'}
            </Text>
          </View>

          <Text style={styles.title}>
            {isApproved
              ? 'Credential Verified!'
              : isRejected
              ? 'Credential Review Rejected'
              : 'Credential Under Review'}
          </Text>

          {targetName ? <Text style={styles.targetNameText}>{targetName}</Text> : null}

          <Text style={styles.subtitle}>{getSubTitle()}</Text>
        </View>

        {/* Audit Progress Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionHeader}>Audit Timeline</Text>

          <View style={styles.timelineRow}>
            <View style={[styles.node, styles.nodeDone]}>
              <CheckCircle2 size={16} color="#FFFFFF" />
            </View>
            <View style={styles.nodeText}>
              <Text style={styles.nodeTitle}>Document Uploaded</Text>
              <Text style={styles.nodeSub}>Proof document submitted for verification</Text>
            </View>
          </View>

          <View style={[styles.track, styles.trackDone]} />

          <View style={styles.timelineRow}>
            <View style={[styles.node, isApproved ? styles.nodeDone : isRejected ? styles.nodeError : styles.nodeActive]}>
              {isApproved ? <CheckCircle2 size={16} color="#FFFFFF" /> : isRejected ? <AlertCircle size={16} color="#FFFFFF" /> : <Clock size={16} color="#FFFFFF" />}
            </View>
            <View style={styles.nodeText}>
              <Text style={styles.nodeTitle}>{isApproved ? 'Admin Verified' : isRejected ? 'Verification Failed' : 'Admin Manual Review'}</Text>
              <Text style={styles.nodeSub}>{isApproved ? 'Approved by Trust Team' : isRejected ? 'Document rejected' : 'In progress by Admin'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.bottomBar}>
        {isRejected ? (
          <TouchableOpacity 
            style={styles.retryBtn} 
            onPress={() => navigation.navigate('ExpertJourney', { typeSlug: isEducation ? 'education' : 'career', experienceId, educationId })}
          >
            <Text style={styles.retryBtnText}>Re-upload Verification Document</Text>
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
  eduBg: { backgroundColor: '#DBEAFE' },
  careerBg: { backgroundColor: '#CCFBF1' },
  statusPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  approvedPill: { backgroundColor: '#D1FAE5' },
  rejectedPill: { backgroundColor: '#FEE2E2' },
  pendingPill: { backgroundColor: '#FEF3C7' },
  statusPillText: { fontSize: 12, fontWeight: '800' },
  approvedText: { color: '#059669' },
  rejectedText: { color: '#DC2626' },
  pendingText: { color: '#D97706' },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  targetNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  node: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: '#059669' },
  nodeActive: { backgroundColor: '#D97706' },
  nodeError: { backgroundColor: '#DC2626' },
  track: { width: 2, height: 16, marginLeft: 13 },
  trackDone: { backgroundColor: '#059669' },
  nodeText: { gap: 2 },
  nodeTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  nodeSub: { fontSize: 12, color: '#64748B' },
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
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 16,
  },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});

export default CredentialVerificationStatusScreen;
