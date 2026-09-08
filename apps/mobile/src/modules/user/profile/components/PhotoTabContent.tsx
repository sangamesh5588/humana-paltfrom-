import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Camera } from 'lucide-react-native';

import { getInitials } from '../utils/profile.utils';

interface PhotoTabContentProps {
  avatar: string;
  firstName: string;
  lastName: string;
  isUploading: boolean;
  onPickImage: () => void;
}

export const PhotoTabContent: React.FC<PhotoTabContentProps> = ({
  avatar,
  firstName,
  lastName,
  isUploading,
  onPickImage,
}) => {
  const initials = getInitials(firstName, lastName);

  return (
    <View style={styles.animatedSection}>
      <Text style={styles.pickerLabel}>Profile Photo Upload</Text>
      
      <View style={styles.largeAvatarContainer}>
        <TouchableOpacity 
          style={styles.largeAvatarPickerCard} 
          onPress={onPickImage} 
          disabled={isUploading}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.largeAvatarImg} />
          ) : (
            <View style={styles.largeAvatarInitialsBg}>
              <Text style={styles.largeAvatarInitialsText}>{initials}</Text>
            </View>
          )}
          
          {isUploading ? (
            <View style={styles.largeUploadOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : (
            <View style={styles.largeCameraOverlay}>
              <Camera size={22} color="#FFFFFF" style={{ marginBottom: 4 }} />
              <Text style={styles.changePhotoText}>Tap to Select Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedSection: {
    width: '100%',
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  largeAvatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  largeAvatarPickerCard: {
    width: 150,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  largeAvatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  largeAvatarInitialsBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatarInitialsText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  largeUploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  largeCameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default PhotoTabContent;
