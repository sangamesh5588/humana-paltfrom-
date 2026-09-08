import React, { useState, useEffect } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import Theme from '../../../../app/theme';
import useAuthStore from '../../../../core/auth/store';
import useOnboardingState, { ExperienceItem } from '../hooks/useOnboardingState';
import SearchableDropdown from '../components/SearchableDropdown';
import StaticDropdown from '../components/StaticDropdown';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceBadge from '../components/ExperienceBadge';
import ApiClient from '../../../../core/api/client';

const MONTHS_OPTIONS = [
  { label: '01 - January', value: '1' },
  { label: '02 - February', value: '2' },
  { label: '03 - March', value: '3' },
  { label: '04 - April', value: '4' },
  { label: '05 - May', value: '5' },
  { label: '06 - June', value: '6' },
  { label: '07 - July', value: '7' },
  { label: '08 - August', value: '8' },
  { label: '09 - September', value: '9' },
  { label: '10 - October', value: '10' },
  { label: '11 - November', value: '11' },
  { label: '12 - December', value: '12' },
];

const currentYear = new Date().getFullYear();
const YEARS_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const yr = (currentYear + 5 - i).toString();
  return { label: yr, value: yr };
});

interface Step3_ExperienceScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step3_ExperienceScreen: React.FC<Step3_ExperienceScreenProps> = ({ onNext, onBack }) => {
  const store = useOnboardingState();
  const authStore = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form local state
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load existing experience on mount
  useEffect(() => {
    if (authStore.user?.profile?.experience) {
      store.setField('experienceList', authStore.user.profile.experience);
    }
  }, [authStore.user]);

  const handleAddExperience = async () => {
    setError('');
    if (!jobTitle.trim()) return setError('Job Title is required.');
    if (!company.trim()) return setError('Company name is required.');
    if (!expLocation.trim()) return setError('Location is required.');
    
    const sM = parseInt(startMonth, 10);
    const sY = parseInt(startYear, 10);
    if (isNaN(sM) || sM < 1 || sM > 12) return setError('Please enter a valid start month (1-12).');
    if (isNaN(sY) || sY < 1900 || sY > new Date().getFullYear()) return setError('Please enter a valid start year.');

    let endISO = null;
    if (!current) {
      const eM = parseInt(endMonth, 10);
      const eY = parseInt(endYear, 10);
      if (isNaN(eM) || eM < 1 || eM > 12) return setError('Please enter a valid end month (1-12).');
      if (isNaN(eY) || eY < 1900 || eY > new Date().getFullYear() + 5) return setError('Please enter a valid end year.');
      if (eY < sY || (eY === sY && eM < sM)) {
        return setError('End date cannot be before start date.');
      }
      endISO = new Date(eY, eM - 1, 15).toISOString();
    }

    const startISO = new Date(sY, sM - 1, 1).toISOString();

    setIsLoading(true);
    try {
      const res = await ApiClient.post('/profile/experience', {
        company: company.trim(),
        title: jobTitle.trim(),
        location: expLocation.trim(),
        startDate: startISO,
        endDate: endISO,
        current,
        description: description.trim() || undefined,
      });

      // Update state
      const newItem: ExperienceItem = res.data;
      store.setField('experienceList', [...store.experienceList, newItem]);

      // Reset form
      setJobTitle('');
      setCompany('');
      setExpLocation('');
      setStartMonth('');
      setStartYear('');
      setEndMonth('');
      setEndYear('');
      setCurrent(false);
      setDescription('');
      setShowAddForm(false);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to add experience.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExperience = (id: string) => {
    Alert.alert('Delete Experience', 'Are you sure you want to delete this position?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await ApiClient.delete(`/profile/experience/${id}`);
            store.setField(
              'experienceList',
              store.experienceList.filter((item) => item.id !== id)
            );
          } catch (e) {
            setError('Failed to delete experience.');
          }
        },
      },
    ]);
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleNext = () => {
    setError('');
    if (!store.noExperience && store.experienceList.length === 0) {
      setError('Please add at least one work experience or check "I do not have any work experience".');
      return;
    }

    // Save in background silently
    ApiClient.put('/profile', {
      onboardingStep: 3,
    }).then(() => {
      authStore.initialize();
    }).catch((err) => {
      console.warn('Background save for step 3 failed:', err);
    });

    // Advance immediately
    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Professional Experience</Text>
        <Text style={styles.subtitle}>
          Add your work experience history. This helps build your profile and career timeline.
        </Text>

        <ExperienceBadge experienceList={store.experienceList} />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>I do not have work experience (Student / Fresher)</Text>
          <Switch
            value={store.noExperience}
            onValueChange={(val) => {
              store.setField('noExperience', val);
              if (val) {
                store.setField('experienceList', []);
                setShowAddForm(false);
              }
            }}
            trackColor={{ false: Theme.colors.border, true: Theme.colors.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        {!store.noExperience && (
          <View style={styles.listContainer}>
            {store.experienceList.map((item) => (
              <ExperienceCard
                key={item.id}
                item={item}
                onDelete={() => handleDeleteExperience(item.id!)}
              />
            ))}

            {!showAddForm ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.addButtonText}>+ Add Work Experience</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Add Position</Text>
                
                <SearchableDropdown
                  label="Job Title *"
                  placeholder="e.g. Software Engineer"
                  endpoint="job-titles"
                  selectedValue=""
                  selectedLabel={jobTitle}
                  onSelect={(item) => setJobTitle(item.name)}
                  labelKey="title"
                  allowCustom
                />

                <SearchableDropdown
                  label="Company Name *"
                  placeholder="e.g. Google, Tata Consultancy Services"
                  endpoint="companies"
                  selectedValue=""
                  selectedLabel={company}
                  onSelect={(item) => setCompany(item.name)}
                  allowCustom
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Location *</Text>
                  <TextInput
                    style={[styles.textInput, focusedField === 'location' && styles.textInputFocused]}
                    placeholder="e.g. Bangalore, Remote, Hybrid"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={expLocation}
                    onChangeText={setExpLocation}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                 <View style={styles.dateRow}>
                  <View style={{ flex: 1, marginRight: Theme.spacing.sm }}>
                    <StaticDropdown
                      label="Start Month *"
                      placeholder="Select month..."
                      options={MONTHS_OPTIONS}
                      selectedValue={startMonth}
                      onSelect={setStartMonth}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <StaticDropdown
                      label="Start Year *"
                      placeholder="Select year..."
                      options={YEARS_OPTIONS}
                      selectedValue={startYear}
                      onSelect={setStartYear}
                    />
                  </View>
                </View>

                {!current && (
                  <View style={styles.dateRow}>
                    <View style={{ flex: 1, marginRight: Theme.spacing.sm }}>
                      <StaticDropdown
                        label="End Month *"
                        placeholder="Select month..."
                        options={MONTHS_OPTIONS}
                        selectedValue={endMonth}
                        onSelect={setEndMonth}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <StaticDropdown
                        label="End Year *"
                        placeholder="Select year..."
                        options={YEARS_OPTIONS}
                        selectedValue={endYear}
                        onSelect={setEndYear}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>I currently work here</Text>
                  <Switch
                    value={current}
                    onValueChange={setCurrent}
                    trackColor={{ false: Theme.colors.border, true: Theme.colors.accent }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Role Description (Optional)</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea, focusedField === 'description' && styles.textInputFocused]}
                    placeholder="Describe your role and achievements..."
                    placeholderTextColor={Theme.colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    value={description}
                    onChangeText={setDescription}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <View style={styles.formButtonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAddForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddExperience}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>Add</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    flex: 1,
  },
  listContainer: {
    marginVertical: Theme.spacing.md,
  },
  addButton: {
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.accent,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    marginBottom: Theme.spacing.md,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  formCard: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.md,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: Theme.spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
  },
  formButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Theme.spacing.md,
  },
  cancelButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    marginRight: Theme.spacing.sm,
  },
  cancelButtonText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: Theme.colors.accent,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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

export default Step3_ExperienceScreen;
