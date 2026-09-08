import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Clock, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, AlertCircle, GraduationCap, Briefcase } from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';

export const VerificationPendingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { typeSlug, targetName: routeTargetName, experienceId, educationId } = route.params || {};

  const [statusData, setStatusData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [targetName, setTargetName] = useState<string>(routeTargetName || '');

  const isEducation = typeSlug === 'education' || !!educationId;
  const isCareer = typeSlug === 'career' || !!experienceId;

  const fetchStatus = async () => {
    try {
      const [overview, profileData, _specificStatus] = await Promise.all([
        ExpertApi.getHomeOverview().catch(() => null),
        ExpertApi.getProfile().catch(() => null),
        ExpertApi.getStatus(typeSlug, experienceId, educationId).catch(() => null),
      ]);

      if (overview) setStatusData(overview);

      // Load specific target name if missing
      if (!targetName && profileData) {
        if (isCareer && experienceId) {
          const exp = profileData.experience?.find((e: any) => e.id === experienceId);
          if (exp) setTargetName(`${exp.title} at ${exp.company}`);
        } else if (isEducation && educationId) {
          const edu = profileData.education?.find((e: any) => e.id === educationId);
          if (edu) setTargetName(`${edu.degree} from ${edu.school}`);
        }
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [typeSlug, experienceId, educationId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  };

  const currentStatus = (statusData?.status as string) || 'PENDING_REVIEW';
  const isApproved = currentStatus === 'APPROVED' || currentStatus === 'VERIFIED';
  const isRejected = currentStatus === 'REJECTED';

  const getHeaderTitle = () => {
    if (isEducation) return 'Education Verification';
    if (isCareer) return 'Career Experience Verification';
    return 'Credential Verification';
  };

  const getSubTitle = () => {
    if (isApproved) {
      if (isEducation) return `Congratulations! Your degree credential ${targetName ? `(${targetName})` : ''} has been verified and active.`;
      if (isCareer) return `Congratulations! Your work experience credential ${targetName ? `(${targetName})` : ''} has been verified and active.`;
      return 'Congratulations! Your profile credential has been verified and active.';
    }
    if (isRejected) {
      return statusData?.activeSession?.rejectionReason || 'Your submitted verification proof could not be validated by Admin.';
    }
    if (isEducation) {
      return `Your graduation degree & academic proof ${targetName ? `for ${targetName} ` : ''}has been submitted for Admin review.`;
    }
    if (isCareer) {
      return `Your corporate employment & experience proof ${targetName ? `for ${targetName} ` : ''}has been submitted for Admin review.`;
    }
    return 'Your verification application has been submitted and is currently being audited by our Admin Trust Team.';
  };

  return (
    <View style={styles.container}>
      {/* Dynamic App Bar */}
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
        {/* Main Status Hero Card */}
        <View style={styles.heroCard}>
          <View style={[styles.iconCircleFlat, isEducation ? styles.eduIconBg : isCareer ? styles.careerIconBg : null]}>
            {isApproved ? (
              <ShieldCheck size={36} color="#059669" />
            ) : isRejected ? (
              <AlertCircle size={36} color="#DC2626" />
            ) : isEducation ? (
              <GraduationCap size={36} color="#1D4ED8" />
            ) : isCareer ? (
              <Briefcase size={36} color="#0D9488" />
            ) : (
              <Clock size={36} color="#D97706" />
            )}
          </View>

          <View style={[styles.statusPillFlat, isApproved ? styles.approvedPill : isRejected ? styles.rejectedPill : isEducation ? styles.eduPill : isCareer ? styles.careerPill : null]}>
            <Text style={[styles.statusPillText, isApproved ? styles.approvedText : isRejected ? styles.rejectedText : isEducation ? styles.eduText : isCareer ? styles.careerText : null]}>
              {isApproved ? 'VERIFIED' : isRejected ? 'REJECTED' : 'UNDER REVIEW'}
            </Text>
          </View>

          <Text style={styles.title}>
            {isApproved
              ? `${getHeaderTitle()} Approved!`
              : isRejected
              ? `${getHeaderTitle()} Rejected`
              : `${getHeaderTitle()} Under Review`}
          </Text>

          {targetName ? (
            <Text style={styles.targetNameText}>{targetName}</Text>
          ) : null}

          <Text style={styles.subtitle}>{getSubTitle()}</Text>

          {/* Explicit Manual Refresh Action Button */}
          {!isApproved && (
            <TouchableOpacity style={styles.checkStatusBtn} onPress={onRefresh} activeOpacity={0.85}>
              <RefreshCw size={16} color="#2563EB" />
              <Text style={styles.checkStatusBtnText}>Check Live Status</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Timeline Flat Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionHeader}>Audit Progress</Text>

          <View style={styles.timelineList}>
            {/* Step 1 */}
            <View style={styles.timelineRow}>
              <View style={[styles.timelineNode, styles.nodeDone]}>
                <CheckCircle2 size={18} color="#FFFFFF" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.nodeTitleDone}>Application Submitted</Text>
                <Text style={styles.nodeSub}>Form and details received</Text>
              </View>
            </View>

            <View style={[styles.timelineTrack, styles.trackDone]} />

            {/* Step 2 */}
            <View style={styles.timelineRow}>
              <View style={[styles.timelineNode, isApproved ? styles.nodeDone : isRejected ? styles.nodeError : styles.nodeActive]}>
                {isApproved ? (
                  <CheckCircle2 size={18} color="#FFFFFF" />
                ) : isRejected ? (
                  <AlertCircle size={18} color="#FFFFFF" />
                ) : (
                  <Clock size={18} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={isApproved ? styles.nodeTitleDone : isRejected ? styles.nodeTitleError : styles.nodeTitleActive}>
                  {isApproved ? 'Identity & Document Approved' : isRejected ? 'Review Failed' : 'Admin Identity & Document Review'}
                </Text>
                <Text style={styles.nodeSub}>
                  {isApproved ? 'Audit complete' : isRejected ? 'Audit rejected' : 'In progress by Trust & Safety'}
                </Text>
              </View>
            </View>

            <View style={[styles.timelineTrack, isApproved ? styles.trackDone : styles.trackPending]} />

            {/* Step 3 */}
            <View style={styles.timelineRow}>
              <View style={[styles.timelineNode, isApproved ? styles.nodeDone : styles.nodePending]}>
                {isApproved ? <CheckCircle2 size={18} color="#FFFFFF" /> : <View style={styles.innerDot} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={isApproved ? styles.nodeTitleDone : styles.nodeTitlePending}>Badge & Expert Activation</Text>
                <Text style={styles.nodeSub}>{isApproved ? 'Badge active on profile' : 'Unlocks upon approval'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SLA Flat Banner */}
        {!isApproved && !isRejected && (
          <View style={styles.slaBanner}>
            <Text style={styles.slaTitle}>Estimated Review Time</Text>
            <Text style={styles.slaText}>Within 24 Hours. Pull down to refresh anytime to verify live status.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Flat Action Buttons */}
      <View style={styles.bottomBar}>
        {isApproved ? (
          <TouchableOpacity style={styles.dashboardBtnFlat} onPress={() => navigation.replace('ExpertBottomTabs')}>
            <Text style={styles.dashboardBtnTextFlat}>Go to Expert Dashboard</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.homeBtnFlat} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.homeBtnTextFlat}>Return to User Home</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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
  backBtn: {
    padding: 4,
  },
  refreshBtn: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  iconCircleFlat: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  eduIconBg: {
    backgroundColor: '#DBEAFE',
  },
  careerIconBg: {
    backgroundColor: '#CCFBF1',
  },
  statusPillFlat: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedPill: {
    backgroundColor: '#D1FAE5',
  },
  rejectedPill: {
    backgroundColor: '#FEE2E2',
  },
  eduPill: {
    backgroundColor: '#DBEAFE',
  },
  careerPill: {
    backgroundColor: '#CCFBF1',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  approvedText: {
    color: '#059669',
  },
  rejectedText: {
    color: '#DC2626',
  },
  eduText: {
    color: '#1D4ED8',
  },
  careerText: {
    color: '#0D9488',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  targetNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    textAlign: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  checkStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
    marginTop: 6,
  },
  checkStatusBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  timelineList: {
    gap: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  timelineNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: '#059669',
  },
  nodeActive: {
    backgroundColor: '#D97706',
  },
  nodePending: {
    backgroundColor: '#E2E8F0',
  },
  nodeError: {
    backgroundColor: '#DC2626',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
  },
  timelineTrack: {
    width: 2,
    height: 20,
    marginLeft: 15,
  },
  trackDone: {
    backgroundColor: '#059669',
  },
  trackPending: {
    backgroundColor: '#E2E8F0',
  },
  timelineContent: {
    gap: 2,
  },
  nodeTitleDone: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  nodeTitleActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  nodeTitlePending: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  nodeTitleError: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  nodeSub: {
    fontSize: 12,
    color: '#64748B',
  },
  slaBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 4,
  },
  slaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  slaText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  homeBtnFlat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  homeBtnTextFlat: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dashboardBtnFlat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  dashboardBtnTextFlat: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default VerificationPendingScreen;
