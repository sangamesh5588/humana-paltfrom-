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
import useOnboardingState, { EducationItem } from '../hooks/useOnboardingState';
import SearchableDropdown from '../components/SearchableDropdown';
import StaticDropdown from '../components/StaticDropdown';
import EducationCard from '../components/EducationCard';
import ApiClient from '../../../../core/api/client';

const currentYear = new Date().getFullYear();
const YEARS_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const yr = (currentYear + 5 - i).toString();
  return { label: yr, value: yr };
});

interface Step2_EducationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const DEGREE_LEVELS = [
  { label: 'Lower Kindergarten (LKG)', value: 'LKG' },
  { label: 'Primary School (Class 1-5)', value: 'PRIMARY' },
  { label: 'Middle School (Class 6-8)', value: 'MIDDLE' },
  { label: 'High School (Class 10)', value: 'HIGH_SCHOOL' },
  { label: 'Senior Secondary (Class 12)', value: 'SENIOR_SECONDARY' },
  { label: 'Diploma', value: 'DIPLOMA' },
  { label: 'Bachelors Degree', value: 'BACHELORS' },
  { label: 'Masters Degree', value: 'MASTERS' },
  { label: 'Doctorate / PhD', value: 'DOCTORATE' },
  { label: 'Post-Doctorate', value: 'POST_DOCTORATE' },
  { label: 'Professional Certificate', value: 'CERTIFICATE' },
  { label: 'Self-Taught / Alternative Path', value: 'SELF_TAUGHT' },
];

export const Step2_EducationScreen: React.FC<Step2_EducationScreenProps> = ({ onNext, onBack }) => {
  const store = useOnboardingState();
  const authStore = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form local state
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('BACHELORS');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [current, setCurrent] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load existing education on mount
  useEffect(() => {
    if (authStore.user?.profile?.education) {
      // Map existing education from user profile into state
      store.setField('educationList', authStore.user.profile.education);
    }
  }, [authStore.user]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditEducation = (item: EducationItem) => {
    setEditingId(item.id || null);
    setSchool(item.school || '');
    setDegree(item.degree || '');
    setDegreeLevel(item.degreeLevel || 'BACHELORS');
    setFieldOfStudy(item.fieldOfStudy || '');
    const sYr = item.startDate ? new Date(item.startDate).getFullYear().toString() : '';
    const eYr = item.endDate ? new Date(item.endDate).getFullYear().toString() : '';
    setStartYear(sYr);
    setEndYear(eYr);
    setCurrent(!!item.current);
    setShowAddForm(true);
  };

  const handleAddEducation = async () => {
    setError('');
    if (!school.trim()) return setError('School/College/University name is required.');
    if (!degree.trim()) return setError('Degree or Class name is required (e.g. B.Tech, 12th Std).');
    if (!startYear.trim() || isNaN(parseInt(startYear, 10))) return setError('Valid Start Year is required.');
    if (!current && (!endYear.trim() || isNaN(parseInt(endYear, 10)))) return setError('Valid End Year is required.');
    if (!current && parseInt(endYear, 10) < parseInt(startYear, 10)) return setError('End Year cannot be earlier than Start Year.');

    const fieldVal = fieldOfStudy.trim() || 'General';
    const start = new Date(parseInt(startYear, 10), 0, 1).toISOString();
    const end = current ? undefined : new Date(parseInt(endYear, 10), 5, 30).toISOString();

    setIsLoading(true);

    if (editingId) {
      const updatedList = store.educationList.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            school: school.trim(),
            degree: degree.trim(),
            degreeLevel,
            fieldOfStudy: fieldVal,
            startDate: start,
            endDate: end,
            current,
          };
        }
        return item;
      });
      store.setField('educationList', updatedList);

      if (authStore.user?.profile) {
        authStore.updateUser({
          profile: {
            ...authStore.user.profile,
            education: updatedList,
          },
        });
      }

      try {
        if (editingId && !editingId.startsWith('temp-')) {
          await ApiClient.put(`/profile/education/${editingId}`, {
            school: school.trim(),
            degree: degree.trim(),
            degreeLevel,
            fieldOfStudy: fieldVal,
            startDate: start,
            endDate: end,
            current,
          });
          await authStore.refreshUser();
        }
      } catch (e) {
        console.warn('API education update error:', e);
      }

      setEditingId(null);
      setSchool('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setCurrent(false);
      setShowAddForm(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await ApiClient.post('/profile/education', {
        school: school.trim(),
        degree: degree.trim(),
        degreeLevel,
        fieldOfStudy: fieldVal,
        startDate: start,
        endDate: end,
        current,
      });

      const newItem: EducationItem = res.data;
      const newList = [...store.educationList, newItem];
      store.setField('educationList', newList);

      if (authStore.user?.profile) {
        authStore.updateUser({
          profile: {
            ...authStore.user.profile,
            education: newList,
          },
        });
      }
      await authStore.refreshUser();

      setSchool('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setCurrent(false);
      setShowAddForm(false);
    } catch (e: any) {
      const fallbackItem: EducationItem = {
        id: `temp-${Date.now()}`,
        school: school.trim(),
        degree: degree.trim(),
        degreeLevel,
        fieldOfStudy: fieldVal,
        startDate: start,
        endDate: end,
        current,
      };
      const newList = [...store.educationList, fallbackItem];
      store.setField('educationList', newList);

      if (authStore.user?.profile) {
        authStore.updateUser({
          profile: {
            ...authStore.user.profile,
            education: newList,
          },
        });
      }

      setSchool('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setCurrent(false);
      setShowAddForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEducation = (id: string) => {
    Alert.alert('Delete Education', 'Are you sure you want to delete this educational record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const newList = store.educationList.filter((item) => item.id !== id);
          store.setField('educationList', newList);

          if (authStore.user?.profile) {
            authStore.updateUser({
              profile: {
                ...authStore.user.profile,
                education: newList,
              },
            });
          }

          try {
            if (id && !id.startsWith('temp-') && !id.startsWith('demo-')) {
              await ApiClient.delete(`/profile/education/${id}`);
              await authStore.refreshUser();
            }
          } catch (e) {
            console.warn('Background delete warning:', e);
          }
        },
      },
    ]);
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleNext = () => {
    setError('');
    if (!store.noEducation && store.educationList.length === 0) {
      setError('Please add at least one education credential or select "I did not attend school".');
      return;
    }

    // Save in background silently
    ApiClient.put('/profile', {
      onboardingStep: 2,
    }).then(() => {
      authStore.initialize();
    }).catch((err) => {
      console.warn('Background save for step 2 failed:', err);
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
        <Text style={styles.title}>Education History</Text>
        <Text style={styles.subtitle}>
          Add your educational credentials to help build your professional background.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>I do not have formal education</Text>
          <Switch
            value={store.noEducation}
            onValueChange={(val) => {
              store.setField('noEducation', val);
              if (val) {
                store.setField('educationList', []);
                setShowAddForm(false);
              }
            }}
            trackColor={{ false: Theme.colors.border, true: Theme.colors.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        {!store.noEducation && (
          <View style={styles.listContainer}>
            {store.educationList.map((item) => (
              <EducationCard
                key={item.id}
                item={item}
                onDelete={() => handleDeleteEducation(item.id!)}
                onEdit={() => handleEditEducation(item)}
              />
            ))}

            {!showAddForm ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.addButtonText}>+ Add Education Record</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Add Educational Record</Text>
                
                <SearchableDropdown
                  label="School / College / University *"
                  placeholder="e.g. Stanford / DPS / IIT"
                  endpoint="universities"
                  selectedValue=""
                  selectedLabel={school}
                  onSelect={(item) => setSchool(item.name)}
                  allowCustom
                />

                <StaticDropdown
                  label="Degree / Education Level *"
                  placeholder="Select level..."
                  options={DEGREE_LEVELS}
                  selectedValue={degreeLevel}
                  onSelect={setDegreeLevel}
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Degree / Class / Program Name *</Text>
                  <TextInput
                    style={[styles.textInput, focusedField === 'degree' && styles.textInputFocused]}
                    placeholder="e.g. B.Tech / 12th Standard"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={degree}
                    onChangeText={setDegree}
                    onFocus={() => setFocusedField('degree')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Field of Study / Stream</Text>
                  <TextInput
                    style={[styles.textInput, focusedField === 'field' && styles.textInputFocused]}
                    placeholder="e.g. Computer Science / Science"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={fieldOfStudy}
                    onChangeText={setFieldOfStudy}
                    onFocus={() => setFocusedField('field')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                <View style={styles.dateRow}>
                  <View style={{ flex: 1, marginRight: Theme.spacing.sm }}>
                    <StaticDropdown
                      label="Start Year *"
                      placeholder="Select year..."
                      options={YEARS_OPTIONS}
                      selectedValue={startYear}
                      onSelect={setStartYear}
                    />
                  </View>
                  {!current && (
                    <View style={{ flex: 1 }}>
                      <StaticDropdown
                        label="End Year *"
                        placeholder="Select year..."
                        options={YEARS_OPTIONS}
                        selectedValue={endYear}
                        onSelect={setEndYear}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>I am currently studying here</Text>
                  <Switch
                    value={current}
                    onValueChange={setCurrent}
                    trackColor={{ false: Theme.colors.border, true: Theme.colors.accent }}
                    thumbColor="#FFFFFF"
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
                    onPress={handleAddEducation}
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
    minHeight: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textMain,
  },
  textInputFocused: {
    borderColor: Theme.colors.primary,
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  levelSelector: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.full,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: Theme.colors.surface,
  },
  levelSelectorSelected: {
    backgroundColor: Theme.colors.accent,
    borderColor: Theme.colors.accent,
  },
  levelSelectorText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  levelSelectorTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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

export default Step2_EducationScreen;
