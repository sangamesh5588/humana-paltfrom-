import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Theme from '../../../../app/theme';
import useOnboardingState from '../hooks/useOnboardingState';
import SearchableDropdown from '../components/SearchableDropdown';
import ApiClient from '../../../../core/api/client';

interface Step1_OriginScreenProps {
  onNext: () => void;
  onBack?: () => void;
}

export const Step1_OriginScreen: React.FC<Step1_OriginScreenProps> = ({ onNext, onBack }) => {
  const store = useOnboardingState();
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Local state for text fields to prevent re-renders on every keystroke
  const [state, setState] = useState(store.originState);
  const [district, setDistrict] = useState(store.originDistrict);
  const [city, setCity] = useState(store.originCity);
  const [village, setVillage] = useState(store.originVillage);

  const handleNext = () => {
    setError('');
    if (!store.originCountryId) {
      setError('Please select your country of origin.');
      return;
    }
    if (!state.trim()) {
      setError('Please enter your home state or province.');
      return;
    }
    if (!city.trim()) {
      setError('Please enter your home city or town.');
      return;
    }
    if (store.grewUpInVillage && !village.trim()) {
      setError('Please enter your village name.');
      return;
    }

    const trimmedState = state.trim();
    const trimmedDistrict = district.trim();
    const trimmedCity = city.trim();
    const trimmedVillage = store.grewUpInVillage ? village.trim() : '';

    // Commit to Zustand store
    store.setFields({
      originState: trimmedState,
      originDistrict: trimmedDistrict,
      originCity: trimmedCity,
      originVillage: trimmedVillage,
    });

    // Save in background silently
    ApiClient.put('/profile', {
      originCountryId: store.originCountryId,
      originState: trimmedState,
      originDistrict: trimmedDistrict || undefined,
      originCity: trimmedCity,
      originVillage: store.grewUpInVillage ? trimmedVillage : undefined,
      onboardingStep: 1,
    }).catch((err) => {
      console.warn('Background save for step 1 failed:', err);
    });

    // Advance to next screen immediately
    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Country of Origin</Text>
        <Text style={styles.subtitle}>
          Please share where you grew up. This helps customize your community experiences.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <SearchableDropdown
          label="Country of Origin *"
          placeholder="Type country name..."
          endpoint="countries"
          selectedValue={store.originCountryId}
          selectedLabel={store.originCountryName}
          onSelect={(item) => {
            store.setField('originCountryId', item.id);
            store.setField('originCountryName', item.name);
          }}
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>State / Province *</Text>
          <TextInput
            style={[styles.textInput, focusedField === 'state' && styles.textInputFocused]}
            placeholder="e.g. Maharashtra, California"
            placeholderTextColor={Theme.colors.textSecondary}
            value={state}
            onChangeText={setState}
            onFocus={() => setFocusedField('state')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>District (Optional)</Text>
          <TextInput
            style={[styles.textInput, focusedField === 'district' && styles.textInputFocused]}
            placeholder="e.g. Thane, Orange County"
            placeholderTextColor={Theme.colors.textSecondary}
            value={district}
            onChangeText={setDistrict}
            onFocus={() => setFocusedField('district')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>City / Town *</Text>
          <TextInput
            style={[styles.textInput, focusedField === 'city' && styles.textInputFocused]}
            placeholder="e.g. Mumbai, Los Angeles"
            placeholderTextColor={Theme.colors.textSecondary}
            value={city}
            onChangeText={setCity}
            onFocus={() => setFocusedField('city')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>I grew up in a village</Text>
          <Switch
            value={store.grewUpInVillage}
            onValueChange={(val) => store.setField('grewUpInVillage', val)}
            trackColor={{ false: Theme.colors.border, true: Theme.colors.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        {store.grewUpInVillage && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Village Name *</Text>
            <TextInput
              style={[styles.textInput, focusedField === 'village' && styles.textInputFocused]}
              placeholder="Enter village name..."
              placeholderTextColor={Theme.colors.textSecondary}
              value={village}
              onChangeText={setVillage}
              onFocus={() => setFocusedField('village')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
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

export default Step1_OriginScreen;
