import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Theme from '../../../../app/theme';
import useOnboardingState from '../hooks/useOnboardingState';
import ApiClient from '../../../../core/api/client';

interface Step7_GoalsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step7_GoalsScreen: React.FC<Step7_GoalsScreenProps> = ({ onNext, onBack }) => {
  const store = useOnboardingState();
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Local state to prevent re-renders on keystroke
  const [aspirations, setAspirations] = useState(store.aspirations);
  const [challenges, setChallenges] = useState(store.challenges);

  const handleComplete = () => {
    setError('');
    if (!aspirations.trim()) {
      setError('Please share what you want to become or your aspirations.');
      return;
    }

    const trimmedAspirations = aspirations.trim();
    const trimmedChallenges = challenges.trim();

    // Commit to store
    store.setFields({
      aspirations: trimmedAspirations,
      challenges: trimmedChallenges,
    });

    // Save in background silently
    ApiClient.put('/profile', {
      aspirations: trimmedAspirations,
      challenges: trimmedChallenges || undefined,
      onboardingStep: 7,
    }).catch((err) => {
      console.warn('Background save for step 7 failed:', err);
    });

    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Future Focus</Text>
        <Text style={styles.subtitle}>
          Share your career aspirations and any areas where you'd like guidance or support.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>What do you want to become? *</Text>
          <TextInput
            style={[
              styles.textInput,
              styles.textArea,
              focusedField === 'aspirations' && styles.textInputFocused,
            ]}
            placeholder="e.g. A principal backend engineer leading global systems"
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            value={aspirations}
            onChangeText={setAspirations}
            onFocus={() => setFocusedField('aspirations')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Where are you currently stuck? (Optional)</Text>
          <TextInput
            style={[
              styles.textInput,
              styles.textArea,
              focusedField === 'challenges' && styles.textInputFocused,
            ]}
            placeholder="e.g. Getting guidance on system design, career growth"
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            value={challenges}
            onChangeText={setChallenges}
            onFocus={() => setFocusedField('challenges')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleComplete}>
            <Text style={styles.nextButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
    lineHeight: 20,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 14,
    marginBottom: Theme.spacing.md,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: Theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    fontSize: 15,
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textMain,
  },
  textInputFocused: {
    borderColor: Theme.colors.primary,
  },
  textArea: {
    height: 100,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl * 2,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
  },
  backButtonText: {
    color: Theme.colors.textMain,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
    height: 50,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Step7_GoalsScreen;
