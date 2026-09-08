import { useState, useCallback } from 'react';
import useExpertStore from '../../../shared/store/expertStore';
import useAuthStore from '../../../../../core/auth/store';
import { ExpertApi } from '../../../shared/api/expert.api';

export const useExpertProfile = () => {
  const { activeMode, setActiveMode, overview, fetchHomeOverview } = useExpertStore();
  const { user, initialize } = useAuthStore();

  const profile = user?.profile;
  const avatarUrl = profile?.avatar || undefined;

  const [hourlyRate, setHourlyRate] = useState(150);
  const [expertTitle, setExpertTitle] = useState(profile?.headline || 'Senior Solutions Architect');
  const [expertBio, setExpertBio] = useState(profile?.bio || 'Specialized in AI Systems, monorepo architectures, and NestJS/Supabase web & mobile backends.');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchHomeOverview(), initialize()]);
    } catch {
      // Graceful fallback
    }
    setRefreshing(false);
  }, [fetchHomeOverview, initialize]);

  const fullName = profile?.firstName && profile?.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email || 'Verified Expert Candidate';
    
  const badges = overview?.badges || [];
  const availableTypes = overview?.availableVerificationTypes || [
    {
      id: 'vt-career',
      slug: 'career',
      title: 'Corporate Career Verification',
      subtitle: 'Verify work experience at tech companies, startups, or corporations',
    },
    {
      id: 'vt-education',
      slug: 'education',
      title: 'Higher Education & Alumni',
      subtitle: 'Verify degree or student status at accredited universities',
    },
    {
      id: 'vt-skills',
      slug: 'skills',
      title: 'Specialized Skills & Advisory',
      subtitle: 'Verify domain expertise in UI/UX, Tech, or Product',
    },
  ];

  const handleSaveProfile = async (newRate: number, newTitle: string, newBio: string) => {
    setHourlyRate(newRate);
    if (newTitle) setExpertTitle(newTitle);
    if (newBio) setExpertBio(newBio);

    try {
      await ExpertApi.updateProfile({
        headline: newTitle,
        bio: newBio,
      });
      // Re-initialize auth store to sync global user profile state
      await initialize();
    } catch (err) {
      console.error('Failed to persist expert profile update:', err);
    }
  };

  return {
    activeMode,
    setActiveMode,
    profile,
    hourlyRate,
    expertTitle,
    expertBio,
    fullName,
    avatarUrl,
    badges,
    availableTypes,
    refreshing,
    onRefresh,
    isEditModalOpen,
    openEditModal: () => setIsEditModalOpen(true),
    closeEditModal: () => setIsEditModalOpen(false),
    handleSaveProfile,
  };
};

export default useExpertProfile;
