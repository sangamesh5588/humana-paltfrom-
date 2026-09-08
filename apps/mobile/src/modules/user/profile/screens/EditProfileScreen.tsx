import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle } from 'lucide-react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ApiClient from '../../../../core/api/client';
import useAuthStore from '../../../../core/auth/store';
import Config from '../../../../app/config';
import Theme from '../../../../app/theme';

import LiveBannerPreview from '../components/LiveBannerPreview';
import EditProfileTabSelector from '../components/EditProfileTabSelector';
import ThemeTabContent from '../components/ThemeTabContent';
import PhotoTabContent from '../components/PhotoTabContent';
import DetailsTabContent from '../components/DetailsTabContent';
import StatusSelectModal, { STATUS_OPTIONS } from '../components/StatusSelectModal';
import ThemePresetsModal from '../components/ThemePresetsModal';

type FormTabType = 'appearance' | 'image' | 'details';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, refreshUser } = useAuthStore();
  const p = user?.profile;

  // Active section tab: 'appearance' (Themes) vs 'image' (Avatar upload) vs 'details' (Content fields)
  const [activeFormTab, setActiveFormTab] = useState<FormTabType>('appearance');

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [currentCountryId, setCurrentCountryId] = useState('');
  const [currentCountryName, setCurrentCountryName] = useState('');
  
  // Customization States
  const [avatar, setAvatar] = useState('');
  const [bannerColor, setBannerColor] = useState('#F8FAFC');
  const [bannerTextColor, setBannerTextColor] = useState('#0F172A');
  const [currentStatus, setCurrentStatus] = useState('STUDYING');

  // Custom Badge States
  const [badgeText, setBadgeText] = useState('');
  const [badgeBgColor, setBadgeBgColor] = useState('#3B82F6');
  const [badgeTextColor, setBadgeTextColor] = useState('#FFFFFF');
  const [badgeIcon, setBadgeIcon] = useState('🎓');

  // Loading / Modal States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isPresetsModalVisible, setIsPresetsModalVisible] = useState(false);

  // Success Toast
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(-120)).current;
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSuccessToast = useCallback((message: string, goBack?: boolean) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToastMessage(message);
    Animated.spring(toastAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
    toastTimeout.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: -120,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToastMessage('');
        if (goBack) navigation.goBack();
      });
    }, 2200);
  }, [toastAnim, navigation]);

  // Sync state on mount or when user updates
  useEffect(() => {
    if (p) {
      const emailNameParts = (user?.email?.split('@')[0] || '').split('.');
      setFirstName(p.firstName || emailNameParts[0] || '');
      setLastName(p.lastName || (emailNameParts.length > 1 ? emailNameParts[1] : ''));
      setHeadline(p.headline || '');
      setBio(p.bio || '');

      const parsedCity = p.currentCity || (p.location ? p.location.split(',')[0]?.trim() : '') || '';
      const parsedCountry = p.currentCountry?.name || (p.location && p.location.includes(',') ? p.location.split(',')[1]?.trim() : '') || p.currentCountryId || '';

      setCurrentCity(parsedCity);
      setCurrentCountryId(p.currentCountryId || parsedCountry);
      setCurrentCountryName(parsedCountry);
      setAvatar(p.avatar || '');
      
      const colorStr = p.bannerColor || '#F8FAFC';
      if (colorStr.includes(',')) {
        setBannerColor(colorStr.split(',')[0]);
      } else {
        setBannerColor(colorStr);
      }
      
      setBannerTextColor(p.bannerTextColor || '#0F172A');
      setCurrentStatus(p.currentStatus || 'STUDYING');

      setBadgeText(p.badgeText || '');
      setBadgeBgColor(p.badgeBgColor || '#3B82F6');
      setBadgeTextColor(p.badgeTextColor || '#FFFFFF');
      setBadgeIcon(p.badgeIcon || '🎓');
    }
  }, [p, user]);

  const handlePickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        compressImageQuality: 0.85,
        cropperToolbarTitle: 'Crop Profile Photo',
        freeStyleCropEnabled: false,
      });

      if (!image || !image.path) return;

      setIsUploading(true);
      const formData = new FormData();
      const fileName = image.path.split('/').pop() || 'avatar.jpg';
      formData.append('file', {
        uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
        type: image.mime || 'image/jpeg',
        name: fileName,
      } as any);

      const res = await ApiClient.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: Config.UPLOAD_TIMEOUT,
      });
      // Use the cache-busted URL returned by server to immediately show new image
      const freshUrl = res.data.avatarUrl || '';
      setAvatar(freshUrl);
      await refreshUser();
      showSuccessToast('Photo updated');
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') return;
      console.log('Error uploading profile image:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First Name and Last Name are required.');
      return;
    }

    const effectiveCountry = (currentCountryId || currentCountryName).trim();
    if (!effectiveCountry || !currentCity.trim()) {
      Alert.alert('Validation Error', 'Current Country and Current City are mandatory. Please fill them under Details tab.');
      return;
    }

    setIsSaving(true);
    try {
      const countryLabel = currentCountryName.trim() || effectiveCountry;
      const locationText = countryLabel
        ? `${currentCity.trim()}, ${countryLabel}`
        : currentCity.trim();

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        location: locationText,
        currentCity: currentCity.trim(),
        currentCountryId: effectiveCountry,
        currentStatus,
        bannerColor: bannerColor.trim(),
        bannerTextColor: bannerTextColor.trim(),
        badgeText: badgeText.trim() || null,
        badgeBgColor: badgeBgColor.trim() || null,
        badgeTextColor: badgeTextColor.trim() || null,
        badgeIcon: badgeIcon.trim() || null,
        avatar: avatar || null,
      };

      await ApiClient.put('/profile', payload);
      await refreshUser();
      showSuccessToast('Profile saved', true);
    } catch (error: any) {
      console.log('Error saving profile changes:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label || currentStatus;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Live Banner Preview */}
        <LiveBannerPreview
          bannerColor={bannerColor}
          bannerTextColor={bannerTextColor}
          firstName={firstName}
          lastName={lastName}
          selectedStatusLabel={selectedStatusLabel}
          avatar={avatar}
          isUploading={isUploading}
          onPickImage={handlePickImage}
        />

        {/* Section Segment Tabs Switcher */}
        <EditProfileTabSelector
          activeTab={activeFormTab}
          onTabChange={setActiveFormTab}
        />

        {/* Tab Content Render */}
        {activeFormTab === 'appearance' && (
          <ThemeTabContent
            bannerColor={bannerColor}
            bannerTextColor={bannerTextColor}
            onSelectPreset={(color, textColor) => {
              setBannerColor(color);
              setBannerTextColor(textColor);
            }}
            selectedStatusLabel={selectedStatusLabel}
            onOpenStatusModal={() => setIsStatusModalVisible(true)}
            onOpenPresetsModal={() => setIsPresetsModalVisible(true)}
          />
        )}

        {activeFormTab === 'image' && (
          <PhotoTabContent
            avatar={avatar}
            firstName={firstName}
            lastName={lastName}
            isUploading={isUploading}
            onPickImage={handlePickImage}
          />
        )}

        {activeFormTab === 'details' && (
          <DetailsTabContent
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            headline={headline}
            setHeadline={setHeadline}
            bio={bio}
            setBio={setBio}
            currentCountryId={currentCountryId}
            currentCountryName={currentCountryName}
            onSelectCountry={(id, name) => {
              setCurrentCountryId(id);
              setCurrentCountryName(name);
            }}
            currentCity={currentCity}
            setCurrentCity={setCurrentCity}
          />
        )}

        {/* Bottom Save & Cancel Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveBtnBottom} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnTextBottom}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <StatusSelectModal
        visible={isStatusModalVisible}
        onClose={() => setIsStatusModalVisible(false)}
        currentStatus={currentStatus}
        onSelectStatus={(status) => {
          setCurrentStatus(status);
          setIsStatusModalVisible(false);
        }}
      />

      <ThemePresetsModal
        visible={isPresetsModalVisible}
        onClose={() => setIsPresetsModalVisible(false)}
        bannerColor={bannerColor}
        bannerTextColor={bannerTextColor}
        onSelectPreset={(color, textColor) => {
          setBannerColor(color);
          setBannerTextColor(textColor);
          setIsPresetsModalVisible(false);
        }}
      />

      {/* Success Toast */}
      {toastMessage !== '' && (
        <Animated.View
          style={[
            styles.toastContainer,
            { transform: [{ translateY: toastAnim }] },
          ]}
        >
          <View style={styles.toastPill}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    paddingBottom: 60,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 14.5,
  },
  saveBtnBottom: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnTextBottom: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14.5,
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
    gap: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#065F46',
    letterSpacing: 0.2,
  },
});

export default EditProfileScreen;
