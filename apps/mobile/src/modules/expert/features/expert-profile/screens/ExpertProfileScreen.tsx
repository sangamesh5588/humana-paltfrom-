import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, ArrowLeftRight } from 'lucide-react-native';
import useExpertProfile from '../hooks/useExpertProfile';
import ExpertProfileHeroCard from '../components/ExpertProfileHeroCard';
import ExpertCareerTab from '../components/ExpertCareerTab';

const renderPersonalStoryJSX = (profile: any, fullName: string) => {
  const originDistrictState = [profile?.originDistrict, profile?.originState, profile?.originCountry?.name || 'India'].filter(Boolean).join(', ');
  const currentPlace = [profile?.currentCity, profile?.currentState, profile?.currentCountry?.name || 'India'].filter(Boolean).join(', ');
  const spokenLangs = profile && (profile as any).languages && (profile as any).languages.length > 0 ? (profile as any).languages.join(', ') : 'English, Hindi, and Kannada';
  const birthDate = profile?.dob ? new Date(profile.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const experiences = (profile as any)?.experiences || (profile as any)?.experience || [];
  const primaryExp = experiences.find((e: any) => e.isCurrent || e.current) || experiences[0];
  const isCurrentlyActive = primaryExp ? (primaryExp.isCurrent === true || primaryExp.current === true || !primaryExp.endDate || !primaryExp.end_date) : true;

  const expRoleTitle = primaryExp?.role || primaryExp?.title || primaryExp?.role_title || primaryExp?.position;
  const expCompany = primaryExp?.company || primaryExp?.company_name;

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.storyTextBody}>
        <Text style={styles.boldText}>{fullName}</Text>
        {profile?.originVillage ? (
          <> grew up in the native village of <Text style={styles.boldText}>{profile.originVillage}</Text>, rooted in <Text style={styles.boldText}>{originDistrictState}</Text>. Raised with strong community values and cultural heritage, he learned the power of perseverance and continuous learning early in life.</>
        ) : (
          <> originates from <Text style={styles.boldText}>{originDistrictState || 'India'}</Text>, raised with strong community values and a passion for growth.</>
        )}
      </Text>

      <Text style={styles.storyTextBody}>
        {birthDate ? (
          <>Born on <Text style={styles.boldText}>{birthDate}</Text>, he is fluent in <Text style={styles.boldText}>{spokenLangs}</Text>, enabling him to seamlessly connect and communicate across diverse cultural and professional environments.</>
        ) : (
          <>He communicates fluently in <Text style={styles.boldText}>{spokenLangs}</Text>, seamlessly connecting across diverse backgrounds.</>
        )}
      </Text>

      <Text style={styles.storyTextBody}>
        {currentPlace ? (
          <>Today, based in <Text style={styles.boldText}>{currentPlace}</Text>, </>
        ) : (
          <>Today, </>
        )}
        {isCurrentlyActive && expRoleTitle ? (
          <>he thrives as a <Text style={styles.boldText}>{expRoleTitle}{expCompany ? ` at ${expCompany}` : ''}</Text>. He is dedicated to sharing real-world insights, guiding peers, and driving meaningful impact.</>
        ) : expRoleTitle ? (
          <>he serves as a <Text style={styles.boldText}>Senior Advisory Expert</Text>, having previously worked as a <Text style={styles.boldText}>{expRoleTitle}{expCompany ? ` at ${expCompany}` : ''}</Text>. He is dedicated to sharing real-world insights and guiding peers.</>
        ) : (
          <>he serves as a <Text style={styles.boldText}>Senior Advisory Expert</Text>, dedicated to sharing real-world insights, guiding peers, and driving meaningful impact.</>
        )}
        {profile && (profile as any).passions && (profile as any).passions.length > 0 ? (
          <> He is deeply passionate about <Text style={styles.boldText}>{(profile as any).passions.join(', ')}</Text>.</>
        ) : null}
      </Text>
    </View>
  );
};

export const ExpertProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'history' | 'settings'>('overview');

  const {
    setActiveMode,
    profile,
    hourlyRate,
    fullName,
    expertTitle,
    expertBio,
    avatarUrl,
    refreshing,
    onRefresh,
  } = useExpertProfile();

  const handleSwitchToUser = () => {
    setActiveMode('user');
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0369A1']} />
        }
      >
        {/* 1. Full-Bleed Cover Header */}
        <ExpertProfileHeroCard
          fullName={fullName}
          expertTitle={expertTitle}
          expertBio={expertBio}
          hourlyRate={hourlyRate}
          avatarUrl={avatarUrl}
          onBackPress={handleSwitchToUser}
          onMenuPress={() => setActiveTab('settings')}
        />

        {/* 2. Interactive 4-Tab Navigation Switcher */}
        <View style={styles.tabBar}>
          {(['overview', 'career', 'history', 'settings'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'overview'
                  ? 'Overview'
                  : tab === 'career'
                  ? 'Career & Exp'
                  : tab === 'history'
                  ? 'History'
                  : 'Settings'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Tab Content Rendering */}
        <View style={styles.tabContentContainer}>
          {/* TAB 1: OVERVIEW (Flat Minimal Layout with Bold Highlights) */}
          {activeTab === 'overview' && (
            <View style={styles.flatOverviewContainer}>
              {/* 1. Personal Narrative */}
              <View style={styles.flatSection}>
                <Text style={styles.flatSectionTitle}>Personal Story & Roots</Text>
                {renderPersonalStoryJSX(profile, fullName)}
              </View>

              {/* 2. Key Facts Summary */}
              <View style={styles.flatSection}>
                <Text style={styles.flatSectionTitle}>Background Summary</Text>
                
                <View style={styles.flatMetaGrid}>
                  <View style={styles.flatMetaRow}>
                    <Text style={styles.flatMetaLabel}>Native Roots</Text>
                    <Text style={styles.flatMetaValue}>
                      {[profile?.originVillage, profile?.originDistrict, profile?.originState, profile?.originCountry?.name || 'India'].filter(Boolean).join(', ') || 'Karnataka, India'}
                    </Text>
                  </View>

                  <View style={styles.flatMetaRow}>
                    <Text style={styles.flatMetaLabel}>Spoken Languages</Text>
                    <Text style={styles.flatMetaValue}>
                      {(profile as any)?.languages && (profile as any).languages.length > 0 ? (profile as any).languages.join(', ') : 'English, Hindi, Kannada'}
                    </Text>
                  </View>

                  <View style={styles.flatMetaRow}>
                    <Text style={styles.flatMetaLabel}>Current Base</Text>
                    <Text style={styles.flatMetaValue}>
                      {[profile?.currentCity, profile?.currentState, profile?.currentCountry?.name || 'India'].filter(Boolean).join(', ') || 'Bengaluru, India'}
                    </Text>
                  </View>

                  <View style={styles.flatMetaRow}>
                    <Text style={styles.flatMetaLabel}>Role & Company</Text>
                    <Text style={styles.flatMetaValueBold}>
                      {((profile as any)?.experiences?.find((e: any) => e.isCurrent) || (profile as any)?.experiences?.[0] || (profile as any)?.experience?.[0])?.role
                        ? `${((profile as any)?.experiences?.find((e: any) => e.isCurrent) || (profile as any)?.experiences?.[0] || (profile as any)?.experience?.[0]).role}${
                            ((profile as any)?.experiences?.find((e: any) => e.isCurrent) || (profile as any)?.experiences?.[0] || (profile as any)?.experience?.[0]).company
                              ? ` at ${((profile as any)?.experiences?.find((e: any) => e.isCurrent) || (profile as any)?.experiences?.[0] || (profile as any)?.experience?.[0]).company}`
                              : ''
                          }`
                        : profile?.currentStatus === 'STUDYING'
                        ? 'Student'
                        : profile?.currentStatus === 'WORKING'
                        ? 'Working Professional'
                        : 'Senior Advisory Expert'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 3. Expert Bio */}
              <View style={styles.flatSectionNoBorder}>
                <Text style={styles.flatSectionTitle}>Biography</Text>
                <Text style={styles.aboutText}>{expertBio}</Text>
              </View>
            </View>
          )}

          {/* TAB 2: DEDICATED EXPERT CAREER TAB */}
          {activeTab === 'career' && <ExpertCareerTab />}

          {/* TAB 3: CONSULTATION HISTORY */}
          {activeTab === 'history' && (
            <View style={styles.emptyHistoryCard}>
              <View style={styles.emptyIconCircle}>
                <Clock size={20} color="#0369A1" />
              </View>
              <Text style={styles.emptyHistoryTitle}>No Recent Consultations</Text>
              <Text style={styles.emptyHistorySub}>
                Completed 1:1 video sessions and advisory client history will appear here.
              </Text>
            </View>
          )}

          {/* TAB 5: SETTINGS & MODE SWITCHER */}
          {activeTab === 'settings' && (
            <View style={styles.settingsView}>
              <TouchableOpacity 
                style={styles.settingsActionCard} 
                onPress={() => navigation.navigate('ConsultationHours')}
                activeOpacity={0.8}
              >
                <Clock size={18} color="#0369A1" />
                <View style={styles.actionTextCol}>
                  <Text style={styles.actionTitle}>Consultation Hours & Availability</Text>
                  <Text style={styles.actionSub}>Set weekly working hours, custom slots & buffer times</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsActionCard} onPress={handleSwitchToUser}>
                <ArrowLeftRight size={18} color="#059669" />
                <View style={styles.actionTextCol}>
                  <Text style={styles.actionTitle}>Switch to User Mode</Text>
                  <Text style={styles.actionSub}>Return to standard user marketplace dashboard</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabItem: {
    paddingVertical: 14,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#0369A1',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0369A1',
    fontWeight: '800',
  },
  tabContentContainer: {
    padding: 16,
  },
  tabView: {
    gap: 16,
  },
  categoriesContainer: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 2,
  },
  cardIconBg: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  aboutText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 2,
  },
  editPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  emptyHistoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
  },
  emptyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistoryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyHistorySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  infoValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifiedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedValueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  statusHighlightText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  langPillContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  langPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  settingsView: {
    gap: 10,
  },
  settingsActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionTextCol: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionSub: {
    fontSize: 12,
    color: '#64748B',
  },
  flatOverviewContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 24,
    marginHorizontal: -16,
    marginTop: -16,
  },
  flatSection: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  flatSectionNoBorder: {
    gap: 8,
  },
  flatSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  storyTextBody: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  flatMetaGrid: {
    gap: 10,
  },
  flatMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flatMetaLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  flatMetaValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  flatMetaValueBold: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '800',
  },
});

export default ExpertProfileScreen;
