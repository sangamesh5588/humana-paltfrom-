import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  ScrollView,
  Image,
  Modal,
  Alert,
  Pressable,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  ArrowLeft, 
  MapPin,
  Pencil,
  Award,
  Zap,
  Check,
  MoreVertical,
  Settings,
  Info,
  FileText,
  LogOut,
  Eye,
  Camera,
  X
} from 'lucide-react-native';
import Theme from '../../../../app/theme';
import useAuthStore from '../../../../core/auth/store';
import { getInitials, isDarkColor, getStatusBadgeConfig } from '../utils/profile.utils';

// Import Tab Components from separate files
import OverviewTab from './tabs/OverviewTab';
import CareerTab from './tabs/CareerTab';
import SkillsTab from './tabs/SkillsTab';
import GoalsTab from './tabs/GoalsTab';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  
  // States
  const [activeTab, setActiveTab] = useState<'profile' | 'career' | 'skills' | 'goals'>('profile');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isPhotoMenuVisible, setIsPhotoMenuVisible] = useState(false);
  const [isFullPhotoVisible, setIsFullPhotoVisible] = useState(false);
  const { clearSession } = useAuthStore();

  const handleLogout = () => {
    setIsMenuVisible(false);
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
        },
      },
    ]);
  };

  React.useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);

  const p = user?.profile;
  const userInitials = getInitials(p?.firstName, p?.lastName);
  // Determine if banner is dark to auto-switch status bar icons
  const bannerColor = p?.bannerColor || '#F8FAFC';
  const isDarkBanner = useMemo(() => isDarkColor(bannerColor), [bannerColor]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkBanner ? 'light-content' : 'dark-content'}
      />
      <ScrollView 
        style={styles.scrollContainer} 
        bounces={true} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section — full cover with floating nav */}
        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.heroSection}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: p?.bannerColor || '#F8FAFC' }]} />

          {/* Floating nav row on top of banner */}
          <View style={styles.floatingNav}>
            <TouchableOpacity 
              style={[
                styles.navBtn,
                {
                  backgroundColor: isDarkBanner ? 'rgba(255, 255, 255, 0.18)' : 'rgba(15, 23, 42, 0.06)',
                  borderColor: isDarkBanner ? 'rgba(255, 255, 255, 0.25)' : 'rgba(15, 23, 42, 0.12)',
                }
              ]} 
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={18} color={p?.bannerTextColor || (isDarkBanner ? '#FFFFFF' : '#0F172A')} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.navBtn,
                {
                  backgroundColor: isDarkBanner ? 'rgba(255, 255, 255, 0.18)' : 'rgba(15, 23, 42, 0.06)',
                  borderColor: isDarkBanner ? 'rgba(255, 255, 255, 0.25)' : 'rgba(15, 23, 42, 0.12)',
                }
              ]} 
              onPress={() => setIsMenuVisible(true)}
            >
              <MoreVertical size={18} color={p?.bannerTextColor || (isDarkBanner ? '#FFFFFF' : '#0F172A')} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={[styles.userNameText, { color: p?.bannerTextColor || '#0F172A' }]} numberOfLines={2}>
                {p?.firstName ? p.firstName : 'Sangu'}{'\n'}{p?.lastName ? p.lastName : 'Karsanga'}
              </Text>
              
              <Text style={[styles.userHeadlineText, { color: p?.bannerTextColor || '#475569', opacity: 0.85 }]}>
                {p?.currentStatus ? p.currentStatus : 'Developer / Lead Designer'}
              </Text>

              {(p?.currentCity || p?.currentCountry?.name) && (
                <View style={styles.locationContainer}>
                  <MapPin size={13} color={p?.bannerTextColor || '#64748B'} style={{ marginRight: 4, opacity: 0.7 }} />
                  <Text style={[styles.locationText, { color: p?.bannerTextColor || '#64748B', opacity: 0.7 }]}>
                    {p?.currentCity && `${p.currentCity}, `}
                    {p?.currentCountry?.name || 'Local Niche'}
                  </Text>
                </View>
              )}
            </View>

            {/* Hero Portrait Photo */}
            <View style={styles.heroRight}>
              <TouchableOpacity 
                style={styles.portraitPhotoContainer}
                activeOpacity={0.88}
                onPress={() => setIsPhotoMenuVisible(true)}
              >
                {p?.avatar ? (
                  <Image source={{ uri: p.avatar }} style={styles.portraitImage} />
                ) : (
                  <Text style={styles.portraitAvatarText}>{userInitials}</Text>
                )}
                
                {/* Edit Pencil icon in the corner */}
                <TouchableOpacity 
                  style={styles.editPencilBtn}
                  onPress={() => setIsPhotoMenuVisible(true)}
                >
                  <Pencil size={12} color="#1E293B" />
                </TouchableOpacity>

                {/* Overlapping status badge */}
                {(() => {
                  const badgeConfig = getStatusBadgeConfig(p?.currentStatus);
                  return (
                    <View style={[styles.statusBadge, { backgroundColor: badgeConfig.bgColor }]}>
                      <Text style={styles.statusBadgeText}>{badgeConfig.label}</Text>
                    </View>
                  );
                })()}
              </TouchableOpacity>
            </View>
          </View>

        </TouchableOpacity>

        {/* 3. Professional Credentials / Achievements Block */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionHeading}>Professional Credentials</Text>
          
          <View style={styles.statsGrid}>
            {/* Card 1: Verified Expert */}
            <View style={styles.statCard}>
              <View style={[styles.cardIconBg, { backgroundColor: '#F59E0B' }]}>
                <Award size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.statNumber}>Verified</Text>
              <Text style={styles.statLabel}>Expert Tier</Text>
            </View>

            {/* Card 2: Senior */}
            <View style={styles.statCard}>
              <View style={[styles.cardIconBg, { backgroundColor: '#0284C7' }]}>
                <Zap size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.statNumber}>Senior</Text>
              <Text style={styles.statLabel}>Developer</Text>
            </View>

            {/* Card 3: Identity */}
            <View style={styles.statCard}>
              <View style={[styles.cardIconBg, { backgroundColor: '#0D9488' }]}>
                <Check size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.statNumber}>Identity</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
          </View>
        </View>

        {/* 4. Tab selection switcher */}
        <View style={styles.tabBar}>
          {(['profile', 'career', 'skills', 'goals'] as const).map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'profile' ? 'Overview' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. Separate Modular Tab Views */}
        <View style={styles.tabContentContainer}>
          {activeTab === 'profile' && (
            <OverviewTab onNavigateToSkills={() => setActiveTab('skills')} />
          )}
          {activeTab === 'career' && <CareerTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'goals' && <GoalsTab />}
        </View>

      </ScrollView>

      {/* Bottom Sheet Menu */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setIsMenuVisible(false)}>
          <Pressable style={styles.menuSheet}>
            {/* Drag handle */}
            <View style={styles.menuHandle} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setIsMenuVisible(false); /* navigate to Settings */ }}
            >
              <Settings size={20} color="#334155" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setIsMenuVisible(false); /* navigate to Know More */ }}
            >
              <Info size={20} color="#334155" />
              <Text style={styles.menuItemText}>Know More</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setIsMenuVisible(false); /* navigate to Legal */ }}
            >
              <FileText size={20} color="#334155" />
              <Text style={styles.menuItemText}>Legal</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItemLogout} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.menuItemLogoutText}>Log Out</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Photo Options Bottom Sheet */}
      <Modal
        visible={isPhotoMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPhotoMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setIsPhotoMenuVisible(false)}>
          <Pressable style={styles.menuSheet}>
            <View style={styles.menuHandle} />

            {p?.avatar && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsPhotoMenuVisible(false);
                  setIsFullPhotoVisible(true);
                }}
              >
                <Eye size={20} color="#334155" />
                <Text style={styles.menuItemText}>View Profile Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsPhotoMenuVisible(false);
                navigation.navigate('EditProfile');
              }}
            >
              <Camera size={20} color="#334155" />
              <Text style={styles.menuItemText}>Change Photo</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItemCancel} onPress={() => setIsPhotoMenuVisible(false)}>
              <Text style={styles.menuItemCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Fullscreen Photo Viewer Modal */}
      <Modal
        visible={isFullPhotoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFullPhotoVisible(false)}
      >
        <View style={styles.fullViewerContainer}>
          <TouchableOpacity 
            style={styles.fullViewerCloseBtn} 
            onPress={() => setIsFullPhotoVisible(false)}
          >
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>
          
          {p?.avatar ? (
            <Image 
              source={{ uri: p.avatar }} 
              style={styles.fullViewerImage} 
              resizeMode="contain"
            />
          ) : (
            <View style={styles.fullViewerInitials}>
              <Text style={styles.fullViewerInitialsText}>{userInitials}</Text>
            </View>
          )}
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  // Hero section — full cover
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  floatingNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 10,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  userNameText: {
    fontSize: 28,
    fontWeight: '900', // Massive bold condensed style
    color: '#0F172A',
    lineHeight: 32,
    textTransform: 'uppercase', // Uppercase name style like reference
    letterSpacing: -0.5,
  },
  userHeadlineText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
  },
  heroRight: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  portraitPhotoContainer: {
    width: 106,
    height: 128,
    borderRadius: 18,
    backgroundColor: '#334155', // Rich slate dark fallback
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  portraitAvatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 5,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  editPencilBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  // Categories/Stats section (from Andy Rowland's mockup in white style)
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background stats cards
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  // Tab Bar switcher
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.accent,
  },
  tabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  tabTextActive: {
    color: Theme.colors.accent,
    fontWeight: 'bold',
  },
  tabContentContainer: {
    backgroundColor: '#FFFFFF',
  },
  // Bottom Sheet Menu
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  menuHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  menuItemLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  menuItemLogoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  menuItemCancel: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  // Fullscreen Photo Viewer
  fullViewerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullViewerCloseBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 28,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  fullViewerImage: {
    width: '90%',
    height: '75%',
    borderRadius: 16,
  },
  fullViewerInitials: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullViewerInitialsText: {
    fontSize: 54,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
