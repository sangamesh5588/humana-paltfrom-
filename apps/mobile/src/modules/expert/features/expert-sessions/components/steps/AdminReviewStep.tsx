import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';

interface AdminReviewStepProps {
  sessionId?: string | null;
  onSimulateApprove: () => void;
}

export const AdminReviewStep: React.FC<AdminReviewStepProps> = ({ onSimulateApprove }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
        <Clock size={36} color="#D97706" />
      </View>
      <Text style={styles.stepTitle}>Session Submitted for Verification</Text>
      <Text style={styles.stepSubtitle}>
        Our team will verify your session details, intro video, and credentials. We may contact you for a brief verification call prior to activating your session live on your profile.
      </Text>

      <TouchableOpacity style={styles.adminActionBtn} onPress={onSimulateApprove}>
        <Text style={styles.adminActionBtnText}>Go to My Sessions Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  adminActionBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
  },
  adminActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default AdminReviewStep;
