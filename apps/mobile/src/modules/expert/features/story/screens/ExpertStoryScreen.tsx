import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StoryCarousel from '../components/StoryCarousel';
import useExpertStore from '../../../shared/store/expertStore';
import useAuthStore from '../../../../../core/auth/store';

import Storage from '../../../../../core/storage';

export const ExpertStoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { slides, fetchStorySlides } = useExpertStore();

  useEffect(() => {
    fetchStorySlides();
  }, []);

  // Failsafe auto-skip if user is already an onboarded expert
  useEffect(() => {
    if (isLoading) return;

    const checkOnboarded = async () => {
      const profile = user?.profile as any;
      const hasSeenStory = await Storage.getItem('hasSeenExpertStory');

      const isOnboarded = 
        hasSeenStory === 'true' ||
        profile?.onboardingDone === true ||
        profile?.identityStatus === 'VERIFIED' || 
        profile?.identityStatus === 'APPROVED' || 
        profile?.aadhaarVerified === true || 
        profile?.phoneVerified === true ||
        (profile?.experience && profile.experience.length > 0) ||
        (profile?.experiences && profile.experiences.length > 0) ||
        (profile?.education && profile.education.length > 0);

      if (isOnboarded) {
        navigation.replace('ExpertBottomTabs');
      }
    };

    checkOnboarded();
  }, [user, isLoading, navigation]);

  const handleApply = async () => {
    await Storage.setItem('hasSeenExpertStory', 'true');
    navigation.replace('ExpertBottomTabs');
  };

  const handleSkip = async () => {
    await Storage.setItem('hasSeenExpertStory', 'true');
    navigation.replace('ExpertBottomTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StoryCarousel slides={slides} onApply={handleApply} onSkip={handleSkip} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});

export default ExpertStoryScreen;
