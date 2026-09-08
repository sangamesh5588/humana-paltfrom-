import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerificationStepConfig } from '../../../shared/types/expert.types';
import ProfileReviewStep from './steps/ProfileReviewStep';
import TextFieldStep from './steps/TextFieldStep';
import OTPVerificationStep from './steps/OTPVerificationStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import DeclarationStep from './steps/DeclarationStep';

interface DynamicStepRendererProps {
  step: VerificationStepConfig;
}

export const DynamicStepRenderer: React.FC<DynamicStepRendererProps> = ({ step }) => {
  switch (step.type) {
    case 'PROFILE_REVIEW':
      return <ProfileReviewStep />;
    case 'TEXT_FIELD':
    case 'DROPDOWN':
      return <TextFieldStep fields={step.fields} />;
    case 'OTP_VERIFICATION':
      return <OTPVerificationStep config={step.config} />;
    case 'DOCUMENT_UPLOAD':
      return <DocumentUploadStep config={step.config} />;
    case 'DECLARATION':
    case 'REVIEW':
      return <DeclarationStep />;
    default:
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>{step.title}</Text>
          <Text style={styles.fallbackSubtitle}>{step.subtitle || 'Complete this step to proceed.'}</Text>
          <TextFieldStep fields={step.fields} />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  fallbackContainer: {
    paddingVertical: 12,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  fallbackSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
});

export default DynamicStepRenderer;
