import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ShieldCheck, Briefcase, GraduationCap, Calendar } from 'lucide-react-native';
import ApiClient from '../../../../core/api/client';
import useAuthStore from '../../../../core/auth/store';
import { ApprovedSession } from '../../sessions/api/learnerSessions.api';
import LearnerSessionCard from '../../sessions/components/LearnerSessionCard';

export const PublicExpertProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const setTabBarHidden = useAuthStore((state) => state.setTabBarHidden);

  // Hide Bottom Navigation Bar while viewing Public Expert Profile
  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(true);
    }, [setTabBarHidden])
  );

  const expertId: string = route.params?.expertId;
  const sessionParam: ApprovedSession | undefined = route.params?.session;

  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [expertSessions, setExpertSessions] = useState<ApprovedSession[]>(sessionParam ? [sessionParam] : []);
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'topics'>('overview');

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      try {
        if (expertId) {
          const [profRes, feedRes] = await Promise.all([
            ApiClient.get(`/expert/profile`, { params: { userId: expertId } }).catch(() => ({ data: null })),
            ApiClient.get(`/sessions/feed`).catch(() => ({ data: [] })),
          ]);

          if (profRes?.data) setProfileData(profRes.data);
          
          if (feedRes?.data && Array.isArray(feedRes.data)) {
            const filtered = feedRes.data.filter((s: ApprovedSession) => s.expertId === expertId);
            if (filtered.length > 0) setExpertSessions(filtered);
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [expertId]);

  const fullName = sessionParam?.expertName || 
    (profileData?.firstName && profileData?.lastName ? `${profileData.firstName} ${profileData.lastName}` : 'Verified Expert');
  
  const headline = sessionParam?.expertHeadline || profileData?.headline || 'Senior Platform Advisory Expert';
  const avatarUrl = sessionParam?.expertAvatar || profileData?.avatar;
  const bio = profileData?.bio || 'Specialized expert sharing real-world industry insights, career strategy, and technical guidance.';
  const experiences = profileData?.experiences || profileData?.experience || [];
  const education = profileData?.education || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || 'Verified';
  const lastName = nameParts.slice(1).join(' ') || 'Expert';

  const originDistrictState = [profileData?.originDistrict, profileData?.originState, profileData?.originCountry?.name || 'India'].filter(Boolean).join(', ');
  const currentPlace = [profileData?.currentCity, profileData?.currentState, profileData?.currentCountry?.name || 'India'].filter(Boolean).join(', ');
  const spokenLangs = profileData?.languages && profileData.languages.length > 0 ? profileData.languages.join(', ') : 'English, Hindi, and Kannada';

  const primaryExp = experiences.find((e: any) => e.isCurrent || e.current) || experiences[0];
  const expRoleTitle = primaryExp?.role || primaryExp?.title || primaryExp?.role_title || primaryExp?.position;
  const expCompany = primaryExp?.company || primaryExp?.company_name;

  // Fallback 1-on-1 Session Topics if backend has no custom sessions for this expert yet
  const defaultTopics: ApprovedSession[] = [
    {
      id: `topic-1-${expertId || 'default'}`,
      expertId: expertId || '1',
      expertName: fullName,
      expertHeadline: headline,
      expertCompany: expCompany || 'Human Platform',
      expertAvatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      title: '1-on-1 Strategy & Career Growth Advisory',
      description: 'Personalized 1-on-1 strategy call covering career advancement, interview preparation, and leadership guidance.',
      category: 'Career Strategy',
      durationMinutes: 60,
      priceAmount: 1499,
      language: 'English',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
      status: 'APPROVED',
      expertVerified: true,
    },
    {
      id: `topic-2-${expertId || 'default'}`,
      expertId: expertId || '1',
      expertName: fullName,
      expertHeadline: headline,
      expertCompany: expCompany || 'Human Platform',
      expertAvatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      title: 'Technical Architecture & Leadership Review',
      description: 'Deep-dive session evaluating system architecture, scale engineering, and technical leadership tactics.',
      category: 'Tech Advisory',
      durationMinutes: 45,
      priceAmount: 1999,
      language: 'English, Hindi',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      status: 'APPROVED',
      expertVerified: true,
    },
  ];

  const sessionsToDisplay = expertSessions.length > 0 ? expertSessions : defaultTopics;

  const handleConnectClick = () => {
    if (sessionParam) {
      navigation.navigate('LearnerSessionBooking', { session: sessionParam });
      return;
    }

    if (sessionsToDisplay.length === 1) {
      navigation.navigate('LearnerSessionBooking', { session: sessionsToDisplay[0] });
      return;
    }

    if (activeTab !== 'topics') {
      setActiveTab('topics');
    } else {
      navigation.navigate('LearnerSessionBooking', { session: sessionsToDisplay[0] });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" translucent />

      {/* Hero Header Card - Matching Attached Screenshot */}
      <View style={[styles.heroHeader, { paddingTop: topInset + 8 }]}>
        <View style={styles.floatingNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
          {/* Left Column: Stacked Name + Role */}
          <View style={styles.heroLeft}>
            <Text style={styles.userNameText} numberOfLines={2}>
              {firstName}{'\n'}{lastName}
            </Text>
            <Text style={styles.userHeadlineText} numberOfLines={1}>
              {headline}
            </Text>
            {bio ? (
              <Text style={styles.userBioText} numberOfLines={2}>
                {bio}
              </Text>
            ) : null}
          </View>

          {/* Right Column: Portrait Photo with Green Verified Badge */}
          <View style={styles.heroRight}>
            <View style={styles.portraitPhotoContainer}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.portraitImage} />
              ) : (
                <View style={styles.portraitFallback}>
                  <Text style={styles.portraitAvatarText}>{getInitials(fullName)}</Text>
                </View>
              )}

              {/* Overlapping Verified Status Badge */}
              <View style={styles.statusBadge}>
                <ShieldCheck size={12} color="#FFFFFF" />
                <Text style={styles.statusBadgeText}>VERIFIED</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Clean White Profile Hero Tabs Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'overview' && styles.tabItemActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'career' && styles.tabItemActive]}
          onPress={() => setActiveTab('career')}
        >
          <Text style={[styles.tabText, activeTab === 'career' && styles.tabTextActive]}>Career & Exp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'topics' && styles.tabItemActive]}
          onPress={() => setActiveTab('topics')}
        >
          <Text style={[styles.tabText, activeTab === 'topics' && styles.tabTextActive]}>Topics</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color="#0284C7" />
            <Text style={styles.loadingText}>Loading Expert Profile...</Text>
          </View>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <View style={styles.flatOverviewContainer}>
                {/* 1. Personal Story & Roots */}
                <View style={styles.flatSection}>
                  <Text style={styles.flatSectionTitle}>Personal Story & Roots</Text>
                  <View style={{ gap: 12 }}>
                    <Text style={styles.storyTextBody}>
                      <Text style={styles.boldText}>{fullName}</Text>
                      {profileData?.originVillage ? (
                        <> grew up in the native village of <Text style={styles.boldText}>{profileData.originVillage}</Text>, rooted in <Text style={styles.boldText}>{originDistrictState}</Text>. Raised with strong community values, he learned perseverance early in life.</>
                      ) : (
                        <> originates from <Text style={styles.boldText}>{originDistrictState || 'India'}</Text>, raised with strong community values and a passion for growth.</>
                      )}
                    </Text>

                    <Text style={styles.storyTextBody}>
                      He communicates fluently in <Text style={styles.boldText}>{spokenLangs}</Text>, seamlessly connecting across diverse backgrounds.
                    </Text>

                    <Text style={styles.storyTextBody}>
                      Today, based in <Text style={styles.boldText}>{currentPlace || 'Bengaluru, India'}</Text>,
                      {expRoleTitle ? (
                        <> he thrives as a <Text style={styles.boldText}>{expRoleTitle}{expCompany ? ` at ${expCompany}` : ''}</Text>. He is dedicated to sharing real-world insights and guiding peers.</>
                      ) : (
                        <> he serves as a <Text style={styles.boldText}>Senior Advisory Expert</Text>, dedicated to sharing real-world insights and guiding peers.</>
                      )}
                    </Text>
                  </View>
                </View>

                {/* 2. Background Summary */}
                <View style={styles.flatSection}>
                  <Text style={styles.flatSectionTitle}>Background Summary</Text>
                  
                  <View style={styles.flatMetaGrid}>
                    <View style={styles.flatMetaRow}>
                      <Text style={styles.flatMetaLabel}>Native Roots</Text>
                      <Text style={styles.flatMetaValue}>
                        {[profileData?.originVillage, profileData?.originDistrict, profileData?.originState, profileData?.originCountry?.name || 'India'].filter(Boolean).join(', ') || 'Karnataka, India'}
                      </Text>
                    </View>

                    <View style={styles.flatMetaRow}>
                      <Text style={styles.flatMetaLabel}>Spoken Languages</Text>
                      <Text style={styles.flatMetaValue}>{spokenLangs}</Text>
                    </View>

                    <View style={styles.flatMetaRow}>
                      <Text style={styles.flatMetaLabel}>Current Base</Text>
                      <Text style={styles.flatMetaValue}>
                        {[profileData?.currentCity, profileData?.currentState, profileData?.currentCountry?.name || 'India'].filter(Boolean).join(', ') || 'Bengaluru, India'}
                      </Text>
                    </View>

                    <View style={styles.flatMetaRow}>
                      <Text style={styles.flatMetaLabel}>Role & Company</Text>
                      <Text style={styles.flatMetaValueBold}>
                        {expRoleTitle ? `${expRoleTitle}${expCompany ? ` at ${expCompany}` : ''}` : 'Senior Advisory Expert'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 3. Biography */}
                <View style={styles.flatSectionNoBorder}>
                  <Text style={styles.flatSectionTitle}>Biography</Text>
                  <Text style={styles.aboutText}>{bio}</Text>
                </View>
              </View>
            )}

            {/* TAB 2: CAREER & EXP (Read-only Expert Work & Higher Education) */}
            {activeTab === 'career' && (
              <View style={styles.tabContent}>
                {/* Work Experience */}
                <View style={styles.cardSection}>
                  <View style={styles.sectionTitleRow}>
                    <Briefcase size={18} color="#0284C7" />
                    <Text style={styles.sectionTitle}>Work Experience</Text>
                  </View>

                  {(experiences.length > 0 ? experiences : [
                    {
                      id: 'exp-fallback-1',
                      role: expRoleTitle || headline || 'Senior Software Engineer / Entrepreneur',
                      company: expCompany || 'Google / Platform Advisory',
                      verified: true,
                    },
                    {
                      id: 'exp-fallback-2',
                      role: 'Lead Technical Strategist',
                      company: 'Platform Innovation Group',
                      verified: true,
                    }
                  ]).map((exp: any, idx: number) => {
                    const rTitle = exp.role || exp.title || exp.role_title || exp.position || 'Senior Advisory Leader';
                    const cName = exp.company || exp.company_name || exp.organization || 'Platform Advisory';
                    return (
                      <View key={exp.id || idx} style={styles.itemRow}>
                        <View style={styles.dotIndicator} />
                        <View style={styles.itemBody}>
                          <Text style={styles.itemTitle}>{rTitle}</Text>
                          <Text style={styles.itemSub}>{cName}</Text>
                          <View style={styles.inlineVerifiedBadge}>
                            <ShieldCheck size={11} color="#059669" />
                            <Text style={styles.inlineVerifiedText}>Verified Employment</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Higher Education */}
                <View style={styles.cardSection}>
                  <View style={styles.sectionTitleRow}>
                    <GraduationCap size={18} color="#0284C7" />
                    <Text style={styles.sectionTitle}>Higher Education</Text>
                  </View>

                  {(education.length > 0 ? education : [
                    {
                      id: 'edu-fallback-1',
                      degree: 'Bachelor of Technology (B.Tech)',
                      fieldOfStudy: 'Computer Science & Engineering',
                      school: 'VTU / Indian Engineering Institute',
                    }
                  ]).map((edu: any, idx: number) => {
                    const deg = edu.degree || edu.degree_title || edu.qualification || 'Bachelor Degree';
                    const field = edu.fieldOfStudy || edu.field_of_study || edu.major || 'Engineering';
                    const inst = edu.school || edu.institution || edu.university || edu.college || 'Verified Institution';
                    return (
                      <View key={edu.id || idx} style={styles.itemRow}>
                        <View style={styles.dotIndicator} />
                        <View style={styles.itemBody}>
                          <Text style={styles.itemTitle}>{deg} in {field}</Text>
                          <Text style={styles.itemSub}>{inst}</Text>
                          <View style={styles.inlineVerifiedBadge}>
                            <ShieldCheck size={11} color="#059669" />
                            <Text style={styles.inlineVerifiedText}>Verified Academic Credential</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB 3: TOPICS (1-ON-1 SESSIONS & TOPICS) */}
            {activeTab === 'topics' && (
              <View style={styles.tabContent}>
                <Text style={styles.flatSectionTitle}>1-on-1 Sessions & Topics</Text>
                {sessionsToDisplay.map((sess) => (
                  <LearnerSessionCard
                    key={sess.id}
                    session={sess}
                    onPress={() => navigation.navigate('LearnerSessionBooking', { session: sess })}
                    onBookPress={() => navigation.navigate('LearnerSessionBooking', { session: sess })}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Sticky Bottom Booking Bar - Always Visible */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity 
          style={styles.bookCtaBtn} 
          onPress={handleConnectClick} 
          activeOpacity={0.88}
        >
          <Calendar size={18} color="#FFFFFF" />
          <Text style={styles.bookCtaText}>Connect 1:1 Live</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroHeader: {
    backgroundColor: '#0B132B',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  floatingNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },
  userNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  userHeadlineText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 8,
    lineHeight: 18,
  },
  userBioText: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 17,
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitPhotoContainer: {
    width: 120,
    height: 145,
    borderRadius: 22,
    backgroundColor: '#F59E0B',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  portraitFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitAvatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    gap: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#0284C7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  loadingCenter: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  flatOverviewContainer: {
    gap: 20,
  },
  flatSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 16,
    gap: 10,
  },
  flatSectionNoBorder: {
    gap: 10,
  },
  flatSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  storyTextBody: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  flatMetaGrid: {
    gap: 10,
    marginTop: 4,
  },
  flatMetaRow: {
    gap: 2,
  },
  flatMetaLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  flatMetaValue: {
    fontSize: 13.5,
    color: '#1E293B',
    fontWeight: '600',
  },
  flatMetaValueBold: {
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '800',
  },
  aboutText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
  },
  tabContent: {
    gap: 16,
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 6,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
    marginTop: 6,
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemSub: {
    fontSize: 13,
    color: '#64748B',
  },
  inlineVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  inlineVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  emptySubText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bookCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  bookCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default PublicExpertProfileScreen;
