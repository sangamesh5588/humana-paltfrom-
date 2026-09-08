import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../../core/auth/store';

import Storage from '../../../core/storage';
import { ExpertApi } from '../shared/api/expert.api';

export const ExpertGuardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    let isMounted = true;

    const checkVerificationStatus = async () => {
      if (isLoading) return;

      const profile = user?.profile as any;
      const statusFromProfile = profile?.expertStatus || profile?.identityStatus || 'UNVERIFIED';
      const hasSeenStory = await Storage.getItem('hasSeenExpertStory');

      const isOnboarded = 
        statusFromProfile === 'VERIFIED' ||
        statusFromProfile === 'APPROVED' ||
        statusFromProfile === 'PENDING' ||
        statusFromProfile === 'PENDING_REVIEW' ||
        hasSeenStory === 'true' ||
        profile?.onboardingDone === true ||
        profile?.aadhaarVerified === true || 
        profile?.phoneVerified === true ||
        (profile?.experience && profile.experience.length > 0) ||
        (profile?.experiences && profile.experiences.length > 0) ||
        (profile?.education && profile.education.length > 0);

      if (isOnboarded) {
        if (isMounted) navigation.replace('ExpertBottomTabs');
        return;
      }

      try {
        const overview = await ExpertApi.getHomeOverview();
        if (!isMounted) return;

        const status = (overview?.status as string) || 'UNVERIFIED';

        if (status === 'APPROVED' || status === 'VERIFIED' || status === 'PENDING' || status === 'PENDING_REVIEW') {
          navigation.replace('ExpertBottomTabs');
        } else {
          navigation.replace('ExpertStory');
        }
      } catch (err) {
        if (!isMounted) return;
        navigation.replace('ExpertStory');
      }
    };

    checkVerificationStatus();

    return () => {
      isMounted = false;
    };
  }, [navigation, user, isLoading]);

  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#0369A1" />
      <Text style={styles.loadingText}>Authenticating identity status...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default ExpertGuardScreen;
