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
import SearchableDropdown from '../components/SearchableDropdown';
import ApiClient from '../../../../core/api/client';

interface Step4_CurrentLocationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const STATUS_OPTIONS = [
  { label: 'Working Professionally', value: 'WORKING' },
  { label: 'Studying / Student', value: 'STUDYING' },
  { label: 'Looking for Opportunities', value: 'LOOKING' },
  { label: 'Other', value: 'OTHER' },
];

export const Step4_CurrentLocationScreen: React.FC<Step4_CurrentLocationScreenProps> = ({
  onNext,
  onBack,
}) => {
  const store = useOnboardingState();
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Local state to prevent re-renders on keystroke
  const [currentState, setCurrentState] = useState(store.currentState);
  const [currentCity, setCurrentCity] = useState(store.currentCity);

  // Initialize status state, determining if the loaded status is custom
  const initialStatus = store.currentStatus;
  const isPredefined = ['WORKING', 'STUDYING', 'LOOKING'].includes(initialStatus || '');
  const [status, setStatus] = useState(
    initialStatus ? (isPredefined ? initialStatus : 'OTHER') : ''
  );
  const [otherStatus, setOtherStatus] = useState(
    initialStatus && !isPredefined ? initialStatus : ''
  );

  const handleNext = () => {
    setError('');
    if (!status) {
      setError('Please select your current status.');
      return;
    }
    if (status === 'OTHER' && !otherStatus.trim()) {
      setError('Please specify your current status.');
      return;
    }
    if (!store.currentCountryId) {
      setError('Please select your current country.');
      return;
    }
    if (!currentState.trim()) {
      setError('Please enter your current state or province.');
      return;
    }
    if (!currentCity.trim()) {
      setError('Please enter your current city or town.');
      return;
    }

    const finalStatus = status === 'OTHER' ? otherStatus.trim() : status;
    const trimmedState = currentState.trim();
    const trimmedCity = currentCity.trim();

    // Commit to store
    store.setFields({
      currentStatus: finalStatus,
      currentState: trimmedState,
      currentCity: trimmedCity,
    });

    // Save in background silently
    ApiClient.put('/profile', {
      currentCountryId: store.currentCountryId,
      currentState: trimmedState,
      currentCity: trimmedCity,
      currentStatus: finalStatus,
      onboardingStep: 4,
    }).catch((err) => {
      console.warn('Background save for step 4 failed:', err);
    });

    // Advance immediately
    onNext();
  };

  const isDifferentFromOrigin =
    store.originCountryId &&
    store.currentCountryId &&
    store.originCountryId !== store.currentCountryId;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Current Location</Text>
        <Text style={styles.subtitle}>
          Please share where you are currently located and your primary activity.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Current Status *</Text>
          <View style={styles.statusOptions}>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.statusCard,
                  status === opt.value && styles.statusCardSelected,
                ]}
                onPress={() => setStatus(opt.value)}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === opt.value && styles.statusTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {status === 'OTHER' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Specify Status *</Text>
            <TextInput
              style={[styles.textInput, focusedField === 'otherStatus' && styles.textInputFocused]}
              placeholder="e.g. Sabbatical, Homemaker"
              placeholderTextColor={Theme.colors.textSecondary}
              value={otherStatus}
              onChangeText={setOtherStatus}
              onFocus={() => setFocusedField('otherStatus')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}

        <SearchableDropdown
          label="Current Country *"
          placeholder="Type country name..."
          endpoint="countries"
          selectedValue={store.currentCountryId}
          selectedLabel={store.currentCountryName}
          onSelect={(item) => {
            store.setField('currentCountryId', item.id);
            store.setField('currentCountryName', item.name);
          }}
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Current State / Province *</Text>
          <TextInput
            style={[styles.textInput, focusedField === 'state' && styles.textInputFocused]}
            placeholder="e.g. California, Ontario"
            placeholderTextColor={Theme.colors.textSecondary}
            value={currentState}
            onChangeText={setCurrentState}
            onFocus={() => setFocusedField('state')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Current City *</Text>
          <TextInput
            style={[styles.textInput, focusedField === 'city' && styles.textInputFocused]}
            placeholder="e.g. San Francisco, Toronto"
            placeholderTextColor={Theme.colors.textSecondary}
            value={currentCity}
            onChangeText={setCurrentCity}
            onFocus={() => setFocusedField('city')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {isDifferentFromOrigin && (
          <View style={styles.travelCard}>
            <Text style={styles.travelCardText}>
              Note: You are currently located outside of your origin country ({store.originCountryName}).
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
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
    padding: Theme.spacing.md,
    flexGrow: 1,
    justifyContent: 'center',
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
    marginBottom: Theme.spacing.lg,
  },
  fieldContainer: {
    marginBottom: Theme.spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  statusOptions: {
    marginTop: 4,
  },
  statusCard: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
  },
  statusCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
  },
  statusText: {
    fontSize: 14,
    color: Theme.colors.textMain,
  },
  statusTextSelected: {
    fontWeight: 'bold',
    color: Theme.colors.primary,
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
  travelCard: {
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginVertical: Theme.spacing.md,
  },
  travelCardText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: Theme.spacing.lg,
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
  },
  nextButton: {
    flex: 2,
    height: 48,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
  },
});

export default Step4_CurrentLocationScreen;
