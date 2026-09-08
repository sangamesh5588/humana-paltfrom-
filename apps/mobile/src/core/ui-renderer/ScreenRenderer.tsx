import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SDUIStep } from './types';
import FormRenderer from './FormRenderer';
import Theme from '../../app/theme';

interface ScreenRendererProps {
  step: SDUIStep;
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any> | null;
  currentStepIndex: number;
  totalSteps: number;
}

export const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  step,
  onSubmit,
  initialValues,
  currentStepIndex,
  totalSteps,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>
          STEP {currentStepIndex + 1} OF {totalSteps}
        </Text>
        <Text style={styles.stepTitle}>{step.name}</Text>
        {step.form?.description && (
          <Text style={styles.stepDesc}>{step.form.description}</Text>
        )}
      </View>

      <View style={styles.card}>
        {step.form ? (
          <FormRenderer
            form={step.form}
            onSubmit={onSubmit}
            initialValues={initialValues}
            submitLabel={currentStepIndex === totalSteps - 1 ? 'Finish Journey' : 'Save & Continue'}
          />
        ) : (
          <Text style={styles.noFormText}>No input fields configured for this step.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    flexGrow: 1,
  },
  header: {
    marginBottom: Theme.spacing.lg,
  },
  stepIndicator: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: Theme.spacing.xs,
  },
  stepTitle: {
    color: Theme.colors.textMain,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
  },
  stepDesc: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
  },
  noFormText: {
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Theme.spacing.xl,
  },
});

export default ScreenRenderer;
