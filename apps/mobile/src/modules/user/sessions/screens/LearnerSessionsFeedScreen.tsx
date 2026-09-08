import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  StatusBar,
  Platform,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  User, 
  Bell, 
  Grid, 
  Laptop, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Zap,
  ChevronDown,
  Video,
  Calendar,
  CheckCircle2
} from 'lucide-react-native';
import { LearnerSessionsApi, ApprovedSession } from '../api/learnerSessions.api';
import LearnerSessionCard from '../components/LearnerSessionCard';
import useAuthStore from '../../../../core/auth/store';

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  bg: string;
  accent: string;
  text: string;
  badgeBg: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'ALL', name: 'All', icon: Grid, bg: '#FAF5FF', accent: '#8B5CF6', text: '#6D28D9', badgeBg: '#EDE9FE' },
  { id: 'Tech & Coding', name: 'Tech & Coding', icon: Laptop, bg: '#F0F9FF', accent: '#0284C7', text: '#0369A1', badgeBg: '#E0F2FE' },
  { id: 'Career Switcher', name: 'Career Jobs', icon: Briefcase, bg: '#ECFDF5', accent: '#059669', text: '#047857', badgeBg: '#D1FAE5' },
  { id: 'Abroad Studies', name: 'Abroad Study', icon: GraduationCap, bg: '#FFFBEB', accent: '#D97706', text: '#B45309', badgeBg: '#FEF3C7' },
  { id: 'Executive Leadership', name: 'Executive', icon: Award, bg: '#FFF1F2', accent: '#E11D48', text: '#BE123C', badgeBg: '#FFE4E6' },
  { id: 'Startup & Product', name: 'Startups', icon: Zap, bg: '#F5F3FF', accent: '#7C3AED', text: '#6D28D9', badgeBg: '#F3E8FF' },
];

interface UtilizationInfo {
  tag: string;
  heading: string;
  step1Num: string;
  step1Title: string;
  step1Icon: any;
  step2Num: string;
  step2Title: string;
  step2Icon: any;
  step3Num: string;
  step3Title: string;
  step3Icon: any;
}

const CATEGORY_UTILIZATION: Record<string, UtilizationInfo> = {
  'ALL': {
    tag: '1:1 Advisory',
    heading: 'Direct 1:1 Advisory',
    step1Num: '1. TOPIC',
    step1Title: 'Select Topic',
    step1Icon: Grid,
    step2Num: '2. SLOT',
    step2Title: 'Pick Time',
    step2Icon: Calendar,
    step3Num: '3. CONNECT',
    step3Title: '1:1 HD Video',
    step3Icon: Video,
  },
  'Tech & Coding': {
    tag: 'Engineering',
    heading: 'Tech & Architecture',
    step1Num: '1. DESIGN',
    step1Title: 'System Review',
    step1Icon: Laptop,
    step2Num: '2. CODE',
    step2Title: 'Live Debugging',
    step2Icon: Zap,
    step3Num: '3. MOCK',
    step3Title: 'Tech Interview',
    step3Icon: Award,
  },
  'Career Switcher': {
    tag: 'Career Growth',
    heading: 'Placement & Job Growth',
    step1Num: '1. RESUME',
    step1Title: 'Profile Audit',
    step1Icon: Briefcase,
    step2Num: '2. ROADMAP',
    step2Title: 'Transition Plan',
    step2Icon: Sparkles,
    step3Num: '3. SALARY',
    step3Title: 'Negotiation',
    step3Icon: CheckCircle2,
  },
  'Abroad Studies': {
    tag: 'Admissions',
    heading: 'Abroad Study & Visas',
    step1Num: '1. UNIV',
    step1Title: 'Shortlisting',
    step1Icon: GraduationCap,
    step2Num: '2. ESSAY',
    step2Title: 'SOP Strategy',
    step2Icon: Sparkles,
    step3Num: '3. VISA',
    step3Title: 'Interview Prep',
    step3Icon: CheckCircle2,
  },
  'Executive Leadership': {
    tag: 'Leadership',
    heading: 'Executive Leadership',
    step1Num: '1. LEAD',
    step1Title: 'Mentorship',
    step1Icon: Award,
    step2Num: '2. ORG',
    step2Title: 'Scale Strategy',
    step2Icon: Grid,
    step3Num: '3. COACH',
    step3Title: 'Exec Guidance',
    step3Icon: User,
  },
  'Startup & Product': {
    tag: 'Founders',
    heading: 'Startup & Pitch Advisory',
    step1Num: '1. PITCH',
    step1Title: 'Deck Review',
    step1Icon: Zap,
    step2Num: '2. GTM',
    step2Title: 'Market Growth',
    step2Icon: Sparkles,
    step3Num: '3. FUND',
    step3Title: 'Investor Prep',
    step3Icon: Award,
  },
};

export const LearnerSessionsFeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const setTabBarHidden = useAuthStore((state) => state.setTabBarHidden);
  const setProfileDrawerOpen = useAuthStore((state) => state.setProfileDrawerOpen);
  const user = useAuthStore((state) => state.user);

  // Restore bottom tab bar when viewing the main sessions feed
  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(false);
    }, [setTabBarHidden])
  );

  const [sessions, setSessions] = useState<ApprovedSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeCategoryObj = CATEGORY_ITEMS.find((c) => c.id === selectedCategory) || CATEGORY_ITEMS[0];
  const activeUtilization = CATEGORY_UTILIZATION[selectedCategory] || CATEGORY_UTILIZATION['ALL'];

  const Step1Icon = activeUtilization.step1Icon;
  const Step2Icon = activeUtilization.step2Icon;
  const Step3Icon = activeUtilization.step3Icon;

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await LearnerSessionsApi.getApprovedFeed(selectedCategory, searchQuery);
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFeed();
  };

  const lastScrollOffset = useRef<number>(0);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentOffset - lastScrollOffset.current;

    if (currentOffset > 40) {
      if (scrollDiff > 10) {
        // User scrolling DOWN -> hide bottom navigation bar
        setTabBarHidden(true);
      } else if (scrollDiff < -10) {
        // User scrolling UP -> show bottom navigation bar
        setTabBarHidden(false);
      }
    } else {
      // At top of feed -> always show bottom navigation bar
      setTabBarHidden(false);
    }

    lastScrollOffset.current = currentOffset;
  }, [setTabBarHidden]);

  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  const avatarUrl = user?.profile?.avatar;
  const userCity = user?.profile?.currentCity || 'Bengaluru';
  const userState = user?.profile?.currentState || 'Karnataka';

  const renderHeaderComponent = () => (
    <View style={styles.feedHeaderBox}>
      {/* 2.4:1 Wide Aspect Ratio Banner Card (Using Active Category Theme Background Color) */}
      <View style={[styles.attachedHeroBannerCard, { backgroundColor: activeCategoryObj.bg, borderColor: `${activeCategoryObj.accent}30` }]}>
        <View style={styles.heroBannerTitleRow}>
          <View style={[styles.heroBadgePill, { backgroundColor: '#FFFFFF' }]}>
            <Sparkles size={13} color={activeCategoryObj.accent} />
            <Text style={[styles.heroBadgeText, { color: activeCategoryObj.accent }]}>
              {activeUtilization.tag}
            </Text>
          </View>
        </View>

        {/* Category Minimal Utilization Heading */}
        <Text style={styles.heroBannerHeading}>{activeUtilization.heading}</Text>

        {/* 3 Clean Concept Step Cards Matched to Category */}
        <View style={styles.stepsGrid}>
          <View style={[styles.stepCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={[styles.stepIconBg, { backgroundColor: activeCategoryObj.badgeBg }]}>
              <Step1Icon size={16} color={activeCategoryObj.accent} />
            </View>
            <Text style={styles.stepTitleText}>{activeUtilization.step1Title}</Text>
          </View>

          <View style={[styles.stepCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={[styles.stepIconBg, { backgroundColor: activeCategoryObj.badgeBg }]}>
              <Step2Icon size={16} color={activeCategoryObj.accent} />
            </View>
            <Text style={styles.stepTitleText}>{activeUtilization.step2Title}</Text>
          </View>

          <View style={[styles.stepCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={[styles.stepIconBg, { backgroundColor: activeCategoryObj.badgeBg }]}>
              <Step3Icon size={16} color={activeCategoryObj.accent} />
            </View>
            <Text style={styles.stepTitleText}>{activeUtilization.step3Title}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionHeading}>Available 1:1 Live Sessions</Text>
        <Text style={[styles.sectionHeadingBadge, { color: activeCategoryObj.accent }]}>
          {sessions.length} Topics
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={activeCategoryObj.bg} translucent />

      {/* Pinned Sticky Cover Header Container (Profile Row + Search Bar + Category Tabs) */}
      <View style={[
        styles.pinnedHeaderContainer, 
        { paddingTop: topInset + 8, backgroundColor: activeCategoryObj.bg }
      ]}>
        <View style={styles.headerPaddedContent}>
          <View style={styles.topProfileRow}>
            {/* Left: User Profile Avatar */}
            <TouchableOpacity 
              style={styles.profileAvatarBtn} 
              onPress={() => setProfileDrawerOpen(true)}
              activeOpacity={0.8}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.profileAvatarImg} />
              ) : (
                <User size={20} color="#0F172A" />
              )}
            </TouchableOpacity>

            {/* Middle: Location & Title */}
            <View style={styles.locationCol}>
              <View style={styles.locationTitleRow}>
                <Text style={styles.locationMainTitle}>1:1 Live Advisory</Text>
                <ChevronDown size={14} color="#0F172A" />
              </View>
              <Text style={styles.locationSubText} numberOfLines={1}>
                Home - {userCity}, {userState}
              </Text>
            </View>

            {/* Right: Verified Pass Badge & Bell Notification */}
            <View style={styles.topRightRow}>
              <View style={styles.verifiedPassBadge}>
                <CheckCircle2 size={12} color="#059669" />
                <Text style={styles.verifiedPassText}>VERIFIED</Text>
              </View>

              <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
                <Bell size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Full-Width Search Input Bar */}
          <View style={styles.searchBarBox}>
            <Search size={18} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search experts, topics, or career guidance..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={loadFeed}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <SlidersHorizontal size={16} color={activeCategoryObj.accent} />
            </TouchableOpacity>
          </View>

          {/* Vertical Icon Category Horizontal Bar */}
          <View style={styles.categoryContainer}>
            <FlatList
              data={CATEGORY_ITEMS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => {
                const isSelected = selectedCategory === item.id;
                const IconComp = item.icon;
                return (
                  <TouchableOpacity
                    style={styles.categoryTab}
                    onPress={() => setSelectedCategory(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.categoryIconCircle, 
                      isSelected ? { backgroundColor: item.accent } : { backgroundColor: '#FFFFFF' }
                    ]}>
                      <IconComp size={18} color={isSelected ? '#FFFFFF' : '#475569'} />
                    </View>
                    <Text style={[
                      styles.categoryTabText, 
                      isSelected ? { color: item.accent, fontWeight: '800' } : { color: '#64748B' }
                    ]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {isSelected ? <View style={[styles.activeTabIndicator, { backgroundColor: item.accent }]} /> : null}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>

      {/* Main Scrollable Feed Content (Hero Banner + Session Cards Scroll Smoothly Together) */}
      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={activeCategoryObj.accent} />
          <Text style={styles.loadingText}>Fetching 1:1 Live Sessions...</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeaderComponent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[activeCategoryObj.accent]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Sparkles size={42} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Sessions Found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search query or category filter.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <LearnerSessionCard
              session={item}
              onPress={() => navigation.navigate('LearnerSessionBooking', { session: item })}
              onBookPress={() => navigation.navigate('LearnerSessionBooking', { session: item })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  pinnedHeaderContainer: {
    width: '100%',
    paddingBottom: 0,
  },
  headerPaddedContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  topProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  profileAvatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
  },
  locationCol: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  locationSubText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
    marginTop: 1,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedPassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verifiedPassText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  filterBtn: {
    padding: 4,
  },
  categoryContainer: {
    paddingTop: 4,
    marginBottom: 0,
  },
  categoryList: {
    gap: 16,
    paddingBottom: 2,
  },
  categoryTab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  categoryIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  categoryTabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  activeTabIndicator: {
    height: 2.5,
    borderRadius: 1.5,
    width: '100%',
    marginTop: 4,
  },
  feedHeaderBox: {
    marginTop: 0,
    marginBottom: 14,
    gap: 14,
    marginHorizontal: -16,
  },
  attachedHeroBannerCard: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    gap: 10,
  },
  heroBannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  heroBannerHeading: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 20,
    marginTop: 2,
  },
  stepsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionHeadingBadge: {
    fontSize: 12,
    fontWeight: '800',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '600',
  },
  feedList: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
});

export default LearnerSessionsFeedScreen;
