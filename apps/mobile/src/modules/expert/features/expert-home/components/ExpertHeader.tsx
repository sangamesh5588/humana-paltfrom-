import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, Image } from 'react-native';
import { Bell, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../../../../core/auth/store';

interface ExpertHeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const ExpertHeader: React.FC<ExpertHeaderProps> = ({
  onNotificationPress,
  onProfilePress,
}) => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();

  const firstName = user?.profile?.firstName || 'Expert';
  const avatarUrl = user?.profile?.avatar;
  const initial = firstName.charAt(0).toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleNotification = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate('InboxTab');
    }
  };

  const handleProfile = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('ExpertProfileTab');
    }
  };

  const topInset = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 28) 
    : Math.max(insets.top, 20);

  return (
    <View style={[styles.headerContainer, { paddingTop: topInset + 6 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0369A1" translucent />

      {/* Profile Avatar Image Touchable */}
      <TouchableOpacity 
        style={styles.avatarTouch} 
        onPress={handleProfile}
        activeOpacity={0.8}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Dynamic Time Greeting & User Name */}
      <View style={styles.greetingCol}>
        <Text style={styles.greetingSub}>{getGreeting()} 👋</Text>
        <Text style={styles.nameTitle} numberOfLines={1}>{firstName}</Text>
      </View>

      {/* Top Notifications & Verified Badge */}
      <View style={styles.rightActions}>
        <TouchableOpacity 
          style={styles.notificationBtn} 
          onPress={handleNotification}
          activeOpacity={0.7}
        >
          <Bell size={17} color="#FFFFFF" />
          <View style={styles.notificationBadgeDot} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.verifiedBadge} 
          onPress={handleProfile}
          activeOpacity={0.8}
        >
          <ShieldCheck size={13} color="#6EE7B7" />
          <Text style={styles.verifiedBadgeText}>Verified</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0369A1',
    borderBottomWidth: 1,
    borderBottomColor: '#0284C7',
    gap: 12,
    zIndex: 99,
  },
  avatarTouch: {
    position: 'relative',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingCol: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0F2FE',
    lineHeight: 15,
  },
  nameTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7.5,
    height: 7.5,
    borderRadius: 4,
    backgroundColor: '#F43F5E',
    borderWidth: 1.5,
    borderColor: '#0369A1',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  verifiedBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
});

export default ExpertHeader;
