import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Check, ShieldCheck, CheckSquare, Square } from 'lucide-react-native';
import Theme from '../../../../../app/theme';
import useJourneyStore from '../store/journeyStore';
import { ExpertApi } from '../../../shared/api/expert.api';
import { OTPVerificationStep } from '../components/steps/OTPVerificationStep';
import { DocumentUploadStep } from '../components/steps/DocumentUploadStep';

export const SimpleVerificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const typeSlug = route.params?.typeSlug || 'career';
  const experienceId = route.params?.experienceId;
  const educationId = route.params?.educationId;

  const [checking, setChecking] = useState(true);
  const [targetName, setTargetName] = useState('');

  const {
    answers,
    documents,
    isSubmitting,
    declarationAccepted,
    initJourney,
    submitJourney,
    resetJourney,
    setDeclarationAccepted,
  } = useJourneyStore();

  useEffect(() => {
    let isMounted = true;

    const startAndLoadDetails = async () => {
      setChecking(true);
      try {
        // Run status check, profile load, and journey init in parallel with timeout
        const [statusRes, profileData] = await Promise.all([
          ExpertApi.getStatus(typeSlug, experienceId, educationId).catch(() => ({ status: 'UNVERIFIED' })),
          ExpertApi.getProfile().catch(() => ({ experience: [], education: [] })),
        ]);

        const isPending = 
          statusRes?.status === 'PENDING' || 
          statusRes?.status === 'PENDING_REVIEW' || 
          statusRes?.status === 'PENDING_VERIFICATION' ||
          statusRes?.session?.status === 'PENDING';

        if (isPending) {
          if (isMounted) navigation.replace('ExpertPending', { typeSlug, targetName, experienceId, educationId });
          return;
        }

        if (typeSlug === 'career' && experienceId) {
          const exp = profileData.experience?.find((e: any) => e.id === experienceId);
          if (exp && isMounted) {
            setTargetName(`${exp.title} at ${exp.company}`);
          }
        } else if (typeSlug === 'education' && educationId) {
          const edu = profileData.education?.find((e: any) => e.id === educationId);
          if (edu && isMounted) {
            setTargetName(`${edu.degree} from ${edu.school}`);
          }
        }

        await initJourney(typeSlug, experienceId, educationId);
      } catch (err) {
        console.warn('Error starting simple verification:', err);
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    startAndLoadDetails();

    return () => {
      isMounted = false;
      resetJourney();
    };
  }, [typeSlug, experienceId, educationId]);

  const handleSubmit = async () => {
    if (!answers.isEmailVerified && (!documents || documents.length === 0)) {
      Alert.alert('Verification Required', 'Please verify your work/college email OR upload a proof document to proceed.');
      return;
    }

    if (!declarationAccepted) {
      Alert.alert('Declaration Required', 'Please accept the declaration to submit.');
      return;
    }

    const success = await submitJourney();
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ExpertPending' }],
      });
    } else {
      Alert.alert('Submission Error', 'Failed to submit verification request. Please check your network connection.');
    }
  };

  if (checking) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const isFormValid = (answers.isEmailVerified || (documents && documents.length > 0)) && declarationAccepted;

  return (
    <View style={styles.container}>
      {/* Super Clean App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Verify Profile Credential</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic header showing company/school info */}
        <View style={styles.headerSection}>
          <ShieldCheck size={32} color={Theme.colors.primary} />
          <Text style={styles.headerTitle}>Verify Credential</Text>
          <Text style={styles.targetNameText}>{targetName || (typeSlug === 'education' ? 'Educational Degree' : 'Professional Experience')}</Text>
          <Text style={styles.headerSub}>Select one of the fast-track validation options below to request instant verification from admin.</Text>
        </View>

        {/* Verification Options */}
        <View style={styles.cardContainer}>
          {/* Option 1: Official Email OTP */}
          <View style={styles.optionCard}>
            <OTPVerificationStep 
              config={{
                targetLabel: typeSlug === 'education' ? 'College/University Email' : 'Official Work Email',
                placeholder: typeSlug === 'education' ? 'student@university.edu' : 'name@company.com'
              }} 
            />
          </View>

          {/* Option 2: Upload Proof Documents */}
          <View style={styles.optionCard}>
            <DocumentUploadStep />
          </View>

          {/* Declaration Section */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setDeclarationAccepted(!declarationAccepted)}
            activeOpacity={0.8}
          >
            {declarationAccepted ? (
              <CheckSquare size={20} color={Theme.colors.primary} style={{ marginTop: 2 }} />
            ) : (
              <Square size={20} color="#94A3B8" style={{ marginTop: 2 }} />
            )}
            <Text style={styles.declarationText}>
              I declare that the information and documents uploaded are accurate and represent my genuine professional or academic experience.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom submit action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, (!isFormValid || isSubmitting) && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Submit Application</Text>
              <Check size={18} color="#FFFFFF" />
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
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  targetNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
  },
  cardContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 16,
  },
  declarationText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtn: {
    backgroundColor: '#0369A1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default SimpleVerificationScreen;
