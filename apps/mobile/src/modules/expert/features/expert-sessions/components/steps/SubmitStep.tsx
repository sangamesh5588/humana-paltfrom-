import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';

export const SubmitStep: React.FC = () => {
  return (
    <View style={styles.container}>
      <FileText size={48} color="#0369A1" style={{ marginBottom: 12 }} />
      <Text style={styles.stepTitle}>Submit Session</Text>
      <Text style={styles.stepSubtitle}>
        Submit this session draft to platform administrators. It will be validated and approved shortly.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
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
});

export default SubmitStep;
