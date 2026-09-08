import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Theme from '../../../../app/theme';
import useOnboardingState from '../hooks/useOnboardingState';
import ChipSelector from '../components/ChipSelector';
import ApiClient from '../../../../core/api/client';

interface Step5_InterestsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const PREDEFINED_INTERESTS = [
  '💻 Technology',
  '🔬 Science',
  '🎨 Design',
  '💼 Business',
  '🎭 Art & Culture',
  '✍️ Writing',
  '📚 Education',
  '🧘 Health & Wellness',
  '📢 Marketing',
  '📈 Finance',
];

export const Step5_InterestsScreen: React.FC<Step5_InterestsScreenProps> = ({ onNext, onBack }) => {
  const store = useOnboardingState();
  const [error, setError] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [localInterests, setLocalInterests] = useState<string[]>(
    store.interests.length > 0 ? store.interests : []
  );

  // Combine predefined with any custom interests that are selected but not in the list
  const [allOptions, setAllOptions] = useState<string[]>(() => {
    const combined = [...PREDEFINED_INTERESTS];
    localInterests.forEach((interest) => {
      if (!combined.includes(interest)) combined.push(interest);
    });
    return combined;
  });

  const handleAddCustom = () => {
    const val = customInterest.trim();
    if (!val) return;

    // Add prefix if not already having an emoji
    const formatted = val.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/u) ? val : `✨ ${val}`;

    // Add to options list
    if (!allOptions.includes(formatted)) {
      setAllOptions((prev) => [...prev, formatted]);
    }
    // Select it
    if (!localInterests.includes(formatted)) {
      setLocalInterests((prev) => [...prev, formatted]);
    }
    setCustomInterest('');
  };

  const handleNext = () => {
    setError('');
    if (localInterests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }

    // Commit to store
    store.setFields({
      interests: localInterests,
    });

    // Save in background silently
    ApiClient.put('/profile', {
      interests: localInterests,
      onboardingStep: 5,
    }).catch((err) => {
      console.warn('Background save for step 5 failed:', err);
    });

    onNext();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Interests</Text>
      <Text style={styles.subtitle}>
        Select topics you are interested in. This helps us customize your community experience.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ChipSelector
        label="Select interests *"
        options={allOptions}
        selectedValues={localInterests}
        onChange={setLocalInterests}
      />

      <View style={styles.customAddContainer}>
        <Text style={styles.customAddLabel}>Or add your own:</Text>
        <View style={styles.customAddRow}>
          <TextInput
            style={styles.customInput}
            placeholder="e.g. Philosophy, Gardening"
            placeholderTextColor={Theme.colors.textSecondary}
            value={customInterest}
            onChangeText={setCustomInterest}
            onSubmitEditing={handleAddCustom}
          />
          <TouchableOpacity style={styles.customAddBtn} onPress={handleAddCustom}>
            <Text style={styles.customAddBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  customAddContainer: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  customAddLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  customAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    fontSize: 15,
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textMain,
    marginRight: Theme.spacing.sm,
  },
  customAddBtn: {
    height: 48,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAddBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.lg,
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

export default Step5_InterestsScreen;
