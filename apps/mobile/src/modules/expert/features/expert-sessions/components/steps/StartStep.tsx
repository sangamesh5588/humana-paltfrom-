import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface StartStepProps {
  onStart: () => void;
}

export const StartStep: React.FC<StartStepProps> = ({ onStart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Plus size={36} color="#0369A1" />
      </View>
      <Text style={styles.stepTitle}>Start Session Creation</Text>
      <Text style={styles.stepSubtitle}>
        Design a structured 1:1 consultation session built around your verified experiences.
      </Text>
      <TouchableOpacity style={styles.startBtn} onPress={onStart}>
        <Text style={styles.startBtnText}>+ Create Session</Text>
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
  startBtn: {
    backgroundColor: '#0369A1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default StartStep;
