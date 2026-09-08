import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { LogOut } from 'lucide-react-native';
import Theme from '../../../app/theme';
import useAuthStore from '../../../core/auth/store';
import useOnboardingState from './hooks/useOnboardingState';
import StepProgressBar from './components/StepProgressBar';
import Step1_OriginScreen from './screens/Step1_OriginScreen';
import Step2_EducationScreen from './screens/Step2_EducationScreen';
import Step3_ExperienceScreen from './screens/Step3_ExperienceScreen';
import Step4_CurrentLocationScreen from './screens/Step4_CurrentLocationScreen';
import Step5_InterestsScreen from './screens/Step5_InterestsScreen';
import Step6_SkillsScreen from './screens/Step6_SkillsScreen';
import Step7_GoalsScreen from './screens/Step7_GoalsScreen';
import Step8_CompletionScreen from './screens/Step8_CompletionScreen';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const authStore = useAuthStore();
  const onboardingStore = useOnboardingState();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const totalSteps = 8;

  const handleLogoutPress = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to go back? This will log you out of your current session.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive', 
          onPress: async () => {
            await authStore.clearSession();
          } 
        }
      ]
    );
  };

  const handleNext = () => {
    if (currentStep !== null) {
      setCurrentStep((prev) => Math.min(totalSteps, prev ? prev + 1 : 1));
    }
  };

  const handleBack = () => {
    if (currentStep !== null) {
      setCurrentStep((prev) => Math.max(1, prev ? prev - 1 : 1));
    }
  };

  // 1. Android hardware back press interception
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep === null) return false;
      
      if (currentStep > 1 && currentStep < 8) {
        handleBack();
        return true;
      } else if (currentStep === 1) {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the application?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
            { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      }
      return true; // Lock back action on completion screen (step 8)
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [currentStep]);

  // 1. Populate store with existing profile details on mount
  useEffect(() => {
    if (authStore.user?.profile) {
      const p = authStore.user.profile;
      onboardingStore.setFields({
        originCountryId: p.originCountryId || '',
        originCountryName: p.originCountry?.name || '',
        originState: p.originState || '',
        originDistrict: p.originDistrict || '',
        originCity: p.originCity || '',
        originVillage: p.originVillage || '',
        grewUpInVillage: !!p.originVillage,
        educationList: p.education || [],
        experienceList: p.experience || [],
        currentCountryId: p.currentCountryId || '',
        currentCountryName: p.currentCountry?.name || '',
        currentState: p.currentState || '',
        currentCity: p.currentCity || '',
        currentStatus: p.currentStatus || '',
        interests: p.interests || [],
        skills: p.skills || [],
        passions: p.passions || [],
        aspirations: p.aspirations || '',
        challenges: p.challenges || '',
      });
    }
  }, [authStore.user]);

  // 2. Dynamically determine starting step based on last completed database step
  useEffect(() => {
    if (authStore.user && currentStep === null) {
      const dbStep = authStore.user.profile?.onboardingStep || 0;
      // Start user at the next incomplete step (or Step 1)
      const nextStep = Math.min(8, dbStep + 1);
      setCurrentStep(nextStep);
    }
  }, [authStore.user, currentStep]);


  if (currentStep === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Onboarding Header */}
      {currentStep < 8 && (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogoutPress}
            activeOpacity={0.7}
          >
            <LogOut size={14} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Progress Bar */}
      {currentStep < 8 && (
        <StepProgressBar currentStep={currentStep} totalSteps={totalSteps - 1} />
      )}

      {/* Main step container */}
      <View style={styles.stepContainer}>
        {currentStep === 1 && (
          <Step1_OriginScreen onNext={handleNext} />
        )}
        {currentStep === 2 && (
          <Step2_EducationScreen onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <Step3_ExperienceScreen onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 4 && (
          <Step4_CurrentLocationScreen onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 5 && (
          <Step5_InterestsScreen onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 6 && (
          <Step6_SkillsScreen onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 7 && (
          <Step7_GoalsScreen onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 8 && (
          <Step8_CompletionScreen onComplete={onComplete} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // safe area top margin for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#F1F5F9',
  },
  logoutText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingNavigator;
