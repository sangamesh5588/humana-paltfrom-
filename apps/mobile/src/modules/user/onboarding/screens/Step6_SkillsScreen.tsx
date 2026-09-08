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

interface Step6_SkillsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step6_SkillsScreen: React.FC<Step6_SkillsScreenProps> = ({ onNext, onBack }) => {
  const store = useOnboardingState();
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Local state to prevent re-renders on keystroke
  const [skills, setSkills] = useState<string[]>(store.skills);
  const [skillInput, setSkillInput] = useState('');
  const [passions, setPassions] = useState(store.passions.join(', '));

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Add skill on comma or enter
  const handleSkillInputChange = (val: string) => {
    if (val.endsWith(',')) {
      const trimmed = val.slice(0, -1).trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills((prev) => [...prev, trimmed]);
      }
      setSkillInput('');
    } else {
      setSkillInput(val);
    }
  };

  const handleNext = () => {
    setError('');

    // Add any remaining text in the input as a skill
    const trimmed = skillInput.trim();
    const finalSkills = trimmed && !skills.includes(trimmed) ? [...skills, trimmed] : skills;

    if (finalSkills.length === 0) {
      setError('Please add at least one skill.');
      return;
    }

    const parsedPassions = passions
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    // Commit to store
    store.setFields({
      skills: finalSkills,
      passions: parsedPassions,
    });

    // Save in background silently
    ApiClient.put('/profile', {
      skills: finalSkills,
      passions: parsedPassions,
      onboardingStep: 6,
    }).catch((err) => {
      console.warn('Background save for step 6 failed:', err);
    });

    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Skills & Passions</Text>
        <Text style={styles.subtitle}>
          Tell us about your professional skills and what drives you.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>What are your skills? *</Text>
          <Text style={styles.fieldHint}>Type a skill and press enter or comma to add</Text>

          <View style={styles.chipInputContainer}>
            {skills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={styles.selectedChip}
                onPress={() => handleRemoveSkill(skill)}
              >
                <Text style={styles.selectedChipText}>{skill} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.textInput, focusedField === 'skills' && styles.textInputFocused]}
            placeholder="e.g. React, Public Speaking, Data Analysis..."
            placeholderTextColor={Theme.colors.textSecondary}
            value={skillInput}
            onChangeText={handleSkillInputChange}
            onSubmitEditing={handleAddSkill}
            onFocus={() => setFocusedField('skills')}
            onBlur={() => {
              setFocusedField(null);
              // Auto-add whatever is typed when user taps away
              handleAddSkill();
            }}
            returnKeyType="done"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>What are you passionate about?</Text>
          <Text style={styles.fieldHint}>Separate multiple passions with commas</Text>
          <TextInput
            style={[styles.textInput, focusedField === 'passions' && styles.textInputFocused]}
            placeholder="e.g. teaching, solving complex problems"
            placeholderTextColor={Theme.colors.textSecondary}
            value={passions}
            onChangeText={setPassions}
            onFocus={() => setFocusedField('passions')}
            onBlur={() => setFocusedField(null)}
          />
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
    marginBottom: 2,
  },
  fieldHint: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
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
  chipInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.sm,
  },
  selectedChip: {
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    borderWidth: 1,
    borderColor: Theme.colors.accent,
    borderRadius: Theme.borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChipText: {
    color: Theme.colors.accent,
    fontSize: 13,
    fontWeight: '500',
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

export default Step6_SkillsScreen;
