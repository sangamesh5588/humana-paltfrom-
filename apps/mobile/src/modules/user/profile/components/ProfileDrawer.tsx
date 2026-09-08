import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  Animated, 
  Dimensions, 
  Easing, 
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Settings, 
  User, 
  Bookmark, 
  LogOut, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react-native';
import useAuthStore from '../../../../core/auth/store';
import Theme from '../../../../app/theme';
import { getInitials, getStatusBadgeConfig } from '../utils/profile.utils';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.82; // 82% of screen width (like LinkedIn)

export const ProfileDrawer: React.FC = () => {
  const { isProfileDrawerOpen, setProfileDrawerOpen, user, clearSession } = useAuthStore();
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isProfileDrawerOpen) {
      // Slide in from left & Fade in backdrop
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isProfileDrawerOpen]);

  if (!isProfileDrawerOpen) return null;

  const handleClose = (callback?: () => void) => {
    // Animate out before changing state
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setProfileDrawerOpen(false);
      if (callback) callback();
    });
  };

  const p = user?.profile;
  const avatarUrl = p?.avatar;
  const userInitials = getInitials(p?.firstName, p?.lastName);

  const navigateToProfile = () => {
    handleClose(() => {
      navigation.navigate('ProfileStack' as any);
    });
  };

  const handleLogout = async () => {
    handleClose(async () => {
      await clearSession();
    });
  };

  return (
    <Modal
      transparent
      visible={isProfileDrawerOpen}
      onRequestClose={() => handleClose()}
      animationType="none"
    >
      <View style={styles.container}>
        {/* Backdrop overlay (dimmed) */}
        <TouchableWithoutFeedback onPress={() => handleClose()}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        {/* Sliding Panel */}
        <Animated.View 
          style={[
            styles.drawerPanel, 
            { 
              width: DRAWER_WIDTH,
              transform: [{ translateX: slideAnim }] 
            }
          ]}
        >
          <View style={styles.drawerContent}>
            
            {/* Top Mini Profile Card */}
            <TouchableOpacity style={styles.profileHeaderCard} onPress={navigateToProfile} activeOpacity={0.8}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{userInitials}</Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {p?.firstName} {p?.lastName}
                </Text>
                <Text style={styles.profileHeadline} numberOfLines={1}>
                  {getStatusBadgeConfig(p?.currentStatus).label}
                </Text>
                <Text style={styles.viewProfileLink}>View Profile</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Menu List Items */}
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={navigateToProfile}>
                <View style={styles.menuLeft}>
                  <User size={20} color="#475569" style={styles.menuIcon} />
                  <Text style={styles.menuLabel}>View Full Profile</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Bookmark size={20} color="#475569" style={styles.menuIcon} />
                  <Text style={styles.menuLabel}>Saved Posts & Items</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <ShieldAlert size={20} color="#475569" style={styles.menuIcon} />
                  <Text style={styles.menuLabel}>Verification Badges</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Settings size={20} color="#475569" style={styles.menuIcon} />
                  <Text style={styles.menuLabel}>Settings & Privacy</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Footer Logout Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={18} color={Theme.colors.error} style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Dimmed overlay
  },
  drawerPanel: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 16,
  },
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 56 : 24, // Align below Status Bar
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#0369A1',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileHeadline: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  viewProfileLink: {
    fontSize: 13,
    color: Theme.colors.accent,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.error,
  },
});

export default ProfileDrawer;

