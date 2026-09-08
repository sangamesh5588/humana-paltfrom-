import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform, StatusBar } from 'react-native';
import { Search, Briefcase, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../app/theme';
import useAuthStore from '../../core/auth/store';

interface AppHeaderProps {
  showExpertToggle?: boolean;
  isExpertMode?: boolean;
  onExpertToggle?: () => void;
  onProfilePress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showExpertToggle = false,
  isExpertMode = false,
  onExpertToggle,
  onProfilePress,
}) => {
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : Math.max(insets.top, 20);

  const avatarUrl = user?.profile?.avatar;
  const userInitials = user?.profile?.firstName 
    ? user.profile.firstName.slice(0, 1).toUpperCase()
    : 'U';

  return (
    <View style={[styles.container, { paddingTop: topInset, height: 56 + topInset }]}>
      {/* Profile Avatar - Left */}
      <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress} activeOpacity={0.8}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
        )}
        <View style={styles.activeIndicator} />
      </TouchableOpacity>

      {/* Search Bar - Center */}
      <View style={styles.searchBarWrapper}>
        <Search size={16} color={Theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search niches, skills..."
          placeholderTextColor={Theme.colors.textSecondary}
        />
      </View>

      {/* Expert Toggle / Notifications - Right */}
      <View style={styles.rightActions}>
        {showExpertToggle ? (
          <TouchableOpacity 
            style={[styles.expertToggle, isExpertMode && styles.expertToggleActive]}
            onPress={onExpertToggle}
            activeOpacity={0.8}
          >
            <Briefcase size={18} color={isExpertMode ? '#FFFFFF' : Theme.colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Bell size={22} color={Theme.colors.textSecondary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#0369A1',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: Theme.borderRadius.full,
    marginHorizontal: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  searchIcon: {
    marginRight: Theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Theme.colors.textMain,
    paddingVertical: 0,
  },
  rightActions: {
    alignItems: 'center',
  },
  expertToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertToggleActive: {
    backgroundColor: Theme.colors.primary,
  },
  notificationButton: {
    position: 'relative',
    padding: Theme.spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});

export default AppHeader;
