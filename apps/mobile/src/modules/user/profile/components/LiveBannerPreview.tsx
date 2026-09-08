import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Camera } from 'lucide-react-native';

import { getInitials } from '../utils/profile.utils';

interface LiveBannerPreviewProps {
  bannerColor: string;
  bannerTextColor: string;
  firstName: string;
  lastName: string;
  selectedStatusLabel: string;
  avatar: string;
  isUploading: boolean;
  onPickImage: () => void;
}

export const LiveBannerPreview: React.FC<LiveBannerPreviewProps> = ({
  bannerColor,
  bannerTextColor,
  firstName,
  lastName,
  selectedStatusLabel,
  avatar,
  isUploading,
  onPickImage,
}) => {
  const initials = getInitials(firstName, lastName);

  return (
    <View style={styles.bannerPreviewWrapper}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: bannerColor }]} />

      <View style={styles.bannerLeft}>
        <Text style={[styles.bannerNameText, { color: bannerTextColor }]} numberOfLines={1}>
          {firstName || 'First'} {lastName || 'Last'}
        </Text>
        <Text style={[styles.bannerStatusText, { color: bannerTextColor, opacity: 0.85 }]}>
          {selectedStatusLabel}
        </Text>
      </View>
      
      {/* Avatar container */}
      <View style={styles.avatarWrapper}>
        <TouchableOpacity style={styles.avatarCard} onPress={onPickImage} disabled={isUploading}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarInitials}>{initials}</Text>
          )}
          {isUploading ? (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.cameraIconBadge}>
              <Camera size={10} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerPreviewWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerLeft: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerNameText: {
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  bannerStatusText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  avatarWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  avatarCard: {
    width: 60,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#0D9488',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});

export default LiveBannerPreview;
