import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { ArrowLeft, MoreVertical, ShieldCheck } from 'lucide-react-native';

interface ExpertProfileHeroCardProps {
  fullName: string;
  expertTitle: string;
  expertBio: string;
  hourlyRate?: number;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  bannerColor?: string;
  avatarUrl?: string;
}

export const ExpertProfileHeroCard: React.FC<ExpertProfileHeroCardProps> = ({
  fullName,
  expertTitle,
  expertBio,
  onBackPress,
  onMenuPress,
  bannerColor = '#0F172A',
  avatarUrl,
}) => {
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

  return (
    <View style={[styles.heroSection, { backgroundColor: bannerColor }]}>
      {/* Floating Top Nav Bar with Back Arrow (Left) and Three-Dots Menu (Right) */}
      <View style={styles.floatingNav}>
        <TouchableOpacity style={styles.navBtn} onPress={onBackPress} activeOpacity={0.8}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={onMenuPress} activeOpacity={0.8}>
          <MoreVertical size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Big Generous Hero Row with Tall Height */}
      <View style={styles.heroContent}>
        {/* Left Column: Big Stacked Name + Headline + Bio */}
        <View style={styles.heroLeft}>
          <Text style={styles.userNameText} numberOfLines={2}>
            {firstName}{'\n'}{lastName}
          </Text>

          <Text style={styles.userHeadlineText} numberOfLines={2}>
            {expertTitle}
          </Text>

          {expertBio ? (
            <Text style={styles.userBioText} numberOfLines={3}>
              {expertBio}
            </Text>
          ) : null}
        </View>

        {/* Right Column: Tall Generous Portrait Photo Container */}
        <View style={styles.heroRight}>
          <View style={styles.portraitPhotoContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.portraitImage} />
            ) : (
              <Text style={styles.portraitAvatarText}>{getInitials(fullName)}</Text>
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
  );
};

const styles = StyleSheet.create({
  heroSection: {
    borderRadius: 0,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 32,
    width: '100%',
  },
  floatingNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 33,
    letterSpacing: -0.5,
  },
  userHeadlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BAE6FD',
    marginTop: 6,
    lineHeight: 18,
  },
  userBioText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    lineHeight: 16,
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitPhotoContainer: {
    width: 125,
    height: 155,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  portraitAvatarText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  editPencilBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusBadge: {
    position: 'absolute',
    bottom: -12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});

export default ExpertProfileHeroCard;
