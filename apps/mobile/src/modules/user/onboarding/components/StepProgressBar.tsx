import React from 'react';
import { View, StyleSheet } from 'react-native';
import Theme from '../../../../app/theme';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  barBackground: {
    height: 4,
    backgroundColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.full,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.borderRadius.full,
  },
});

export default StepProgressBar;
