import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react-native';
import Theme from '../../../../../app/theme';
import useJourneyStore from '../store/journeyStore';
import DynamicStepRenderer from '../components/DynamicStepRenderer';
import { ExpertApi } from '../../../shared/api/expert.api';

export const VerificationJourneyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const typeSlug = route.params?.typeSlug || 'career';
  const experienceId = route.params?.experienceId;
  const educationId = route.params?.educationId;
  const [checking, setChecking] = React.useState(true);

  const {
    journeyConfig,
    currentStepIndex,
    isSubmitting,
    declarationAccepted,
    initJourney,
    nextStep,
    prevStep,
    submitJourney,
    resetJourney,
  } = useJourneyStore();

  useEffect(() => {
    let isMounted = true;
    const startAndCheckStatus = async () => {
      setChecking(true);
      try {
        const statusRes = await ExpertApi.getStatus(typeSlug);
        if (statusRes && (statusRes.status === 'PENDING_REVIEW' || statusRes.status === 'PENDING_VERIFICATION')) {
          if (isMounted) navigation.replace('ExpertPending');
          return;
        }
      } catch {
        // Fallback
      }

      const session = await initJourney(typeSlug, experienceId, educationId);
      if (session && (session.status === 'PENDING_REVIEW' || session.status === 'PENDING_VERIFICATION')) {
        if (isMounted) navigation.replace('ExpertPending');
        return;
      }
      if (session && (session.status === 'APPROVED' || session.status === 'VERIFIED')) {
        if (isMounted) navigation.replace('ExpertApproved');
        return;
      }

      if (isMounted) setChecking(false);
    };

    startAndCheckStatus();

    return () => {
      isMounted = false;
      resetJourney();
    };
  }, [typeSlug]);

  if (checking || !journeyConfig || journeyConfig.steps.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const steps = journeyConfig.steps;
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const validateCurrentStep = (): boolean => {
    const { answers: currentAnswers, documents: currentDocs } = useJourneyStore.getState();

    switch (currentStep.type) {
      case 'TEXT_FIELD':
        if (typeSlug === 'career') {
          if (!currentAnswers.company || !currentAnswers.jobTitle) {
            Alert.alert('Incomplete Details', 'Please enter your Company Name and Job Title before continuing.');
            return false;
          }
        } else if (typeSlug === 'education') {
          if (!currentAnswers.institution || !currentAnswers.degree) {
            Alert.alert('Incomplete Details', 'Please enter your University Name and Degree before continuing.');
            return false;
          }
        } else if (typeSlug === 'skills') {
          if (!currentAnswers.primarySkill || !currentAnswers.portfolioUrl) {
            Alert.alert('Incomplete Details', 'Please enter your Primary Skill expertise and Portfolio/LinkedIn URL before continuing.');
            return false;
          }
        }
        break;

      case 'OTP_VERIFICATION':
        if (!currentAnswers.isEmailVerified) {
          Alert.alert('Email OTP Verification Required', 'Please enter your email and verify the OTP code before continuing.');
          return false;
        }
        break;

      case 'DOCUMENT_UPLOAD':
        if (!currentDocs || currentDocs.length === 0) {
          Alert.alert('Document Required', 'Please upload at least one proof document (Offer Letter, ID, Transcript, or Certificate) before continuing.');
          return false;
        }
        break;

      default:
        break;
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      if (!declarationAccepted) {
        Alert.alert('Declaration Required', 'Please accept the declaration before submitting.');
        return;
      }
      const success = await submitJourney();
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ExpertPending' }],
        });
      } else {
        Alert.alert('Submission Error', 'Failed to submit verification journey. Please check your network connection and try again.');
      }
    } else {
      await nextStep();
    }
  };

  return (
    <View style={styles.container}>
      {/* Super Clean & Minimal App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={currentStepIndex === 0 ? () => navigation.goBack() : prevStep}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Verification</Text>
        <Text style={styles.stepCounter}>
          {currentStepIndex + 1} / {totalSteps}
        </Text>
      </View>

      {/* Subtle Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      {/* Clean Step Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DynamicStepRenderer step={currentStep} />
      </ScrollView>

      {/* Minimal Bottom Bar */}
      <View style={styles.bottomBar}>
        {currentStepIndex > 0 && (
          <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
            <Text style={styles.prevBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, isLastStep && !declarationAccepted && styles.disabledBtn]}
          onPress={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>{isLastStep ? 'Submit' : 'Continue'}</Text>
              {isLastStep ? <Check size={18} color="#FFFFFF" /> : <ChevronRight size={18} color="#FFFFFF" />}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: Theme.colors.primary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  prevBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default VerificationJourneyScreen;
