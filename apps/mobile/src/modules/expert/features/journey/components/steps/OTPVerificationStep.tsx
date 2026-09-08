import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Mail, CheckCircle, ShieldCheck } from 'lucide-react-native';
import Theme from '../../../../../../app/theme';
import useJourneyStore from '../../store/journeyStore';
import { ExpertApi } from '../../../../shared/api/expert.api';

interface OTPVerificationStepProps {
  config?: Record<string, any>;
}

export const OTPVerificationStep: React.FC<OTPVerificationStepProps> = ({ config }) => {
  const { answers, updateAnswer } = useJourneyStore();
  
  const targetEmail = answers.verificationEmail || '';
  const [code, setCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(answers.isEmailVerified || false);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!targetEmail || !targetEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid work or university email address.');
      return;
    }

    setIsSending(true);
    try {
      const res = await ExpertApi.sendOtp(targetEmail);
      setIsOtpSent(true);
      if (res.debugCode) {
        setDebugCode(res.debugCode);
      }
      Alert.alert('OTP Sent', `Verification code sent to ${targetEmail}`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send OTP code.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length < 4) {
      Alert.alert('Validation Error', 'Please enter the 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);
    try {
      await ExpertApi.verifyOtp(targetEmail, code, answers.experienceId, answers.educationId);
      setIsVerified(true);
      updateAnswer('isEmailVerified', true);
      updateAnswer('verifiedWorkEmail', targetEmail);
      Alert.alert('Email Verified!', 'Your work/university email address has been verified.');
    } catch (e: any) {
      Alert.alert('Verification Failed', e.message || 'Incorrect OTP code.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ShieldCheck size={28} color={Theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{config?.targetLabel || 'Official Email Verification'}</Text>
          <Text style={styles.subtitle}>
            Instantly verify your affiliation by entering your official organization email.
          </Text>
        </View>
      </View>

      {!isVerified ? (
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Official Email Address</Text>
          <View style={styles.inputRow}>
            <Mail size={18} color="#64748B" style={styles.icon} />
            <TextInput
              style={styles.emailInput}
              placeholder={config?.placeholder || 'name@company.com'}
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={targetEmail}
              onChangeText={(val) => updateAnswer('verificationEmail', val)}
              editable={!isOtpSent}
            />
            {!isOtpSent && (
              <TouchableOpacity style={styles.sendButton} onPress={handleSendOtp} disabled={isSending}>
                {isSending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.sendText}>Send OTP</Text>}
              </TouchableOpacity>
            )}
          </View>

          {isOtpSent && (
            <View style={styles.otpSection}>
              <Text style={styles.inputLabel}>Enter 6-Digit Code</Text>
              {debugCode && <Text style={styles.debugHint}>[Dev Mode Code: {debugCode}]</Text>}
              <View style={styles.otpRow}>
                <TextInput
                  style={styles.otpInput}
                  placeholder="123456"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                />
                <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp} disabled={isVerifying}>
                  {isVerifying ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.verifyText}>Verify Code</Text>}
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSendOtp} style={styles.resendBtn}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.verifiedCard}>
          <CheckCircle size={36} color="#10B981" />
          <Text style={styles.verifiedTitle}>Email Address Verified</Text>
          <Text style={styles.verifiedSubtitle}>{targetEmail}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  emailInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  sendButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  otpSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  debugHint: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 6,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  otpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
    letterSpacing: 4,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 12,
  },
  verifyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resendBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  resendText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  verifiedCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 8,
  },
  verifiedSubtitle: {
    fontSize: 14,
    color: '#047857',
    marginTop: 2,
  },
});

export default OTPVerificationStep;
