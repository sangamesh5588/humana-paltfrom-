import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { 
  Sparkles, 
  ArrowRight,
  MapPin, 
  GraduationCap, 
  Languages,
  Rocket,
  Zap,
  CheckCircle2
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../../components/common/AppHeader';
import ExpertGateModal from '../../../../components/common/ExpertGateModal';
import Storage from '../../../../core/storage';
import useAuthStore from '../../../../core/auth/store';
import Theme from '../../../../app/theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const setProfileDrawerOpen = useAuthStore((state) => state.setProfileDrawerOpen);
  const setTabBarHidden = useAuthStore((state) => state.setTabBarHidden);
  const { user, isAuthenticated, setGuest } = useAuthStore();
  const [isExpertModalVisible, setExpertModalVisible] = useState(false);

  const lastOffset = useRef(0);

  const profile = (user?.profile || {}) as any;
  const userInitials = profile?.firstName ? profile.firstName.substring(0, 2).toUpperCase() : 'ME';
  const nativeDistrict = profile?.originDistrict || profile?.originVillage || profile?.originCity || 'Mandya';
  const collegeName = profile?.education?.[0]?.institution || profile?.education?.[0]?.school || 'RV College';
  const nativeLanguage = profile?.languages?.[0] || 'Kannada';

  // Orbit Nodes Definition
  const orbitNodes = [
    {
      id: 'DISTRICT',
      title: `${nativeDistrict} District`,
      subtitle: '3 Verified Experts Active',
      label: nativeDistrict,
      badge: '🌾 HOMETOWN',
      icon: MapPin,
      nodeColor: '#4F46E5',
      nodeBg: '#EEF2FF',
      goal: `Connect with verified experts from ${nativeDistrict}`,
      description: `Talk 1:1 with mentors and leaders born in ${nativeDistrict}.`,
    },
    {
      id: 'COLLEGE',
      title: `${collegeName} Network`,
      subtitle: '5 Alumni Active',
      label: collegeName,
      badge: '🎓 ALUMNI',
      icon: GraduationCap,
      nodeColor: '#16A34A',
      nodeBg: '#F0FDF4',
      goal: `Connect with alumni from ${collegeName}`,
      description: `Get career guidance from senior alumni who graduated from ${collegeName}.`,
    },
    {
      id: 'LANGUAGE',
      title: `${nativeLanguage} Mentorship`,
      subtitle: '6 Native Speakers',
      label: nativeLanguage,
      badge: '💬 NATIVE',
      icon: Languages,
      nodeColor: '#D97706',
      nodeBg: '#FEF3C7',
      goal: `Connect with experts who speak ${nativeLanguage}`,
      description: `Conduct 1:1 sessions comfortably in ${nativeLanguage}.`,
    },
    {
      id: 'AI_TECH',
      title: 'AI Engineering & Startups',
      subtitle: '4 Leaders Active',
      label: 'AI & Startups',
      badge: '🚀 TECH & FUNDING',
      icon: Rocket,
      nodeColor: '#9333EA',
      nodeBg: '#F3E8FF',
      goal: 'Looking for advice on pre-seed funding and AI Engineering',
      description: 'Direct strategy calls with founders and engineers building AI products.',
    },
  ];

  const [selectedNode, setSelectedNode] = useState(orbitNodes[0]);

  const handleProfilePress = () => {
    setProfileDrawerOpen(true);
  };

  const handleModalAction = () => {
    setExpertModalVisible(false);
    setGuest(false);
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    
    if (currentOffset <= 25) {
      setTabBarHidden(false);
      lastOffset.current = currentOffset;
      return;
    }

    const direction = currentOffset > lastOffset.current ? 'down' : 'up';
    const delta = Math.abs(currentOffset - lastOffset.current);

    if (delta > 20) {
      if (direction === 'down' && currentOffset > 120) {
        setTabBarHidden(true);
      } else if (direction === 'up') {
        setTabBarHidden(false);
      }
      lastOffset.current = currentOffset;
    }
  };

  const SelectedIcon = selectedNode.icon;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent />
      
      <AppHeader 
        showExpertToggle={true}
        isExpertMode={false}
        onExpertToggle={async () => {
          if (!isAuthenticated) {
            setExpertModalVisible(true);
          } else {
            const status = profile?.expertStatus || profile?.identityStatus || 'UNVERIFIED';
            const hasSeenStory = await Storage.getItem('hasSeenExpertStory');

            const isOnboardedExpert = 
              status === 'VERIFIED' ||
              status === 'APPROVED' ||
              status === 'PENDING' ||
              status === 'PENDING_REVIEW' ||
              hasSeenStory === 'true' ||
              profile?.onboardingDone === true ||
              profile?.aadhaarVerified === true || 
              profile?.phoneVerified === true ||
              (profile?.experience && profile.experience.length > 0) ||
              (profile?.experiences && profile.experiences.length > 0) ||
              (profile?.education && profile.education.length > 0);

            if (isOnboardedExpert) {
              (navigation as any).navigate('ExpertStack', {
                screen: 'ExpertBottomTabs',
              });
            } else {
              (navigation as any).navigate('ExpertStack', {
                screen: 'ExpertGuard',
              });
            }
          }
        }}
        onProfilePress={handleProfilePress}
      />

      <ScrollView 
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Title */}
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>Your Connection Orbit</Text>
          <Text style={styles.heroSubtitle}>Tap any orbiting node to explore 1:1 matches</Text>
        </View>

        {/* INTERACTIVE VISUAL NETWORK ORBIT CANVAS */}
        <View style={styles.orbitCanvas}>
          
          {/* Orbit Pulse Ring Background */}
          <View style={styles.orbitPulseRingOuter} />
          <View style={styles.orbitPulseRingInner} />

          {/* CENTRAL NODE (YOU) */}
          <View style={styles.centerNode}>
            <View style={styles.centerAvatar}>
              <Text style={styles.centerAvatarText}>{userInitials}</Text>
            </View>
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>YOU</Text>
            </View>
          </View>

          {/* TOP-LEFT NODE: HOMETOWN */}
          <TouchableOpacity 
            style={[
              styles.orbitNode, 
              styles.nodeTopLeft,
              selectedNode.id === 'DISTRICT' && styles.nodeSelected
            ]}
            onPress={() => setSelectedNode(orbitNodes[0])}
            activeOpacity={0.8}
          >
            <View style={[styles.nodeIconCircle, { backgroundColor: '#4F46E5' }]}>
              <MapPin size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.nodeLabel}>{nativeDistrict}</Text>
          </TouchableOpacity>

          {/* TOP-RIGHT NODE: COLLEGE */}
          <TouchableOpacity 
            style={[
              styles.orbitNode, 
              styles.nodeTopRight,
              selectedNode.id === 'COLLEGE' && styles.nodeSelected
            ]}
            onPress={() => setSelectedNode(orbitNodes[1])}
            activeOpacity={0.8}
          >
            <View style={[styles.nodeIconCircle, { backgroundColor: '#16A34A' }]}>
              <GraduationCap size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.nodeLabel}>{collegeName}</Text>
          </TouchableOpacity>

          {/* BOTTOM-LEFT NODE: LANGUAGE */}
          <TouchableOpacity 
            style={[
              styles.orbitNode, 
              styles.nodeBottomLeft,
              selectedNode.id === 'LANGUAGE' && styles.nodeSelected
            ]}
            onPress={() => setSelectedNode(orbitNodes[2])}
            activeOpacity={0.8}
          >
            <View style={[styles.nodeIconCircle, { backgroundColor: '#D97706' }]}>
              <Languages size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.nodeLabel}>{nativeLanguage}</Text>
          </TouchableOpacity>

          {/* BOTTOM-RIGHT NODE: TECH & STARTUPS */}
          <TouchableOpacity 
            style={[
              styles.orbitNode, 
              styles.nodeBottomRight,
              selectedNode.id === 'AI_TECH' && styles.nodeSelected
            ]}
            onPress={() => setSelectedNode(orbitNodes[3])}
            activeOpacity={0.8}
          >
            <View style={[styles.nodeIconCircle, { backgroundColor: '#9333EA' }]}>
              <Rocket size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.nodeLabel}>AI & Startups</Text>
          </TouchableOpacity>

        </View>

        {/* SELECTED ORBIT NODE EXPANSION CARD */}
        <View style={styles.expansionCard}>
          <View style={styles.cardTopRow}>
            <View style={[styles.cardIconBox, { backgroundColor: selectedNode.nodeBg }]}>
              <SelectedIcon size={22} color={selectedNode.nodeColor} />
            </View>

            <View style={styles.cardTitleCol}>
              <View style={styles.badgeRow}>
                <Text style={[styles.badgeText, { color: selectedNode.nodeColor }]}>{selectedNode.badge}</Text>
              </View>
              <Text style={styles.cardTitle}>{selectedNode.title}</Text>
            </View>
          </View>

          <Text style={styles.cardDesc}>{selectedNode.description}</Text>

          {/* Launch AI Guide Button */}
          <TouchableOpacity 
            style={[styles.launchBtn, { backgroundColor: selectedNode.nodeColor }]}
            onPress={() => navigation.navigate('AiGuide', { initialGoal: selectedNode.goal })}
            activeOpacity={0.88}
          >
            <Sparkles size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.launchBtnText}>Launch AI Match for {selectedNode.label}</Text>
            <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Floating Circular AI Guide Orb (Bottom Right) */}
      <TouchableOpacity 
        style={styles.aiGuideOrb}
        onPress={() => navigation.navigate('AiGuide')}
        activeOpacity={0.85}
      >
        <Sparkles size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Custom Expert Mode Modal */}
      <ExpertGateModal
        visible={isExpertModalVisible}
        onClose={() => setExpertModalVisible(false)}
        onAction={handleModalAction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 90,
  },
  heroHeader: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  orbitCanvas: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    height: 310,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  orbitPulseRingOuter: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  orbitPulseRingInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  centerNode: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primary || '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  centerAvatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  youBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  youBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
  orbitNode: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  nodeSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  nodeIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabel: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  nodeTopLeft: {
    top: 24,
    left: 16,
  },
  nodeTopRight: {
    top: 24,
    right: 16,
  },
  nodeBottomLeft: {
    bottom: 24,
    left: 16,
  },
  nodeBottomRight: {
    bottom: 24,
    right: 16,
  },
  expansionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleCol: {
    flex: 1,
  },
  badgeRow: {
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 16,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  aiGuideOrb: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Theme.colors.primary || '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.colors.primary || '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 99,
  },
});

export default HomeScreen;
