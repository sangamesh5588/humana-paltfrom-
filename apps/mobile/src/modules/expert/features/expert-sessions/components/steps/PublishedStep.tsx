import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface PublishedStepProps {
  onReturn: () => void;
}

export const PublishedStep: React.FC<PublishedStepProps> = ({ onReturn }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
        <Check size={36} color="#059669" />
      </View>
      <Text style={styles.stepTitle}>Session Published & Live!</Text>
      <Text style={styles.stepSubtitle}>
        Your session is now indexable by our AI matching engine and is ready for booking!
      </Text>

      <TouchableOpacity style={styles.closeBtn} onPress={onReturn}>
        <Text style={styles.closeBtnText}>Return to My Sessions</Text>
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
  closeBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PublishedStep;
