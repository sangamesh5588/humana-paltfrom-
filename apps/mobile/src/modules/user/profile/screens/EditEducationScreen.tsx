import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../../navigation/types';
import ApiClient from '../../../../core/api/client';
import useAuthStore from '../../../../core/auth/store';

import ProfileHeader from '../components/ProfileHeader';
import ProfileFormInput from '../components/ProfileFormInput';
import ProfileFormSwitch from '../components/ProfileFormSwitch';
import ProfileDateInput from '../components/ProfileDateInput';

type EditEducationScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditEducation'>;
type EditEducationScreenRouteProp = RouteProp<ProfileStackParamList, 'EditEducation'>;

export const EditEducationScreen: React.FC = () => {
  const navigation = useNavigation<EditEducationScreenNavigationProp>();
  const route = useRoute<EditEducationScreenRouteProp>();
  const { refreshUser } = useAuthStore();
  
  const { education } = route.params || {};

  // --- Form Fields State ---
  const [school, setSchool] = React.useState(education?.school || education?.institution || education?.university || '');
  const [degree, setDegree] = React.useState(education?.degree || education?.degree_name || '');
  const [fieldOfStudy, setFieldOfStudy] = React.useState(education?.fieldOfStudy || education?.field || education?.field_of_study || '');
  const [startDate, setStartDate] = React.useState(education?.startDate || education?.start_date ? (education.startDate || education.start_date).slice(0, 7) : '');
  const [endDate, setEndDate] = React.useState(education?.endDate || education?.end_date ? (education.endDate || education.end_date).slice(0, 7) : '');
  const [current, setCurrent] = React.useState(education?.current ?? education?.is_current ?? false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleSave = async () => {
    if (!startDate.trim()) {
      Alert.alert('Required Field', 'Please enter a valid Start Date.');
      return;
    }
    if (!current && !endDate.trim()) {
      Alert.alert('Required Field', 'Please enter an End Date.');
      return;
    }
    if (!school.trim() || !degree.trim() || !fieldOfStudy.trim()) {
      Alert.alert('Required Fields', 'Please fill in School Name, Degree, and Field of Study.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        school: school.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        startDate: `${startDate}-01`,
        endDate: current || !endDate.trim() ? null : `${endDate}-01`,
        current,
      };

      if (education) {
        // Edit Mode
        await ApiClient.put(`/profile/education/${education.id}`, payload);
      } else {
        // Create Mode
        await ApiClient.post('/profile/education', payload);
      }

      await refreshUser();
      navigation.goBack();
    } catch (e: any) {
      console.log('Error saving education:', e);
      Alert.alert('Error', e.response?.data?.message || 'Failed to save education details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!education) return;

    Alert.alert(
      'Delete Education',
      `Are you sure you want to delete your credential "${degree} in ${fieldOfStudy}" from "${school}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await ApiClient.delete(`/profile/education/${education.id}`);
              await refreshUser();
              navigation.goBack();
            } catch (e: any) {
              console.log('Error deleting education:', e);
              Alert.alert('Error', 'Failed to delete education.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <ProfileHeader 
        title={education ? 'Edit Academic Study' : 'Add Academic Study'} 
        onBack={() => navigation.goBack()} 
      />

      {/* Form Content */}
      <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* School Input */}
        <ProfileFormInput 
          label="School/University Name"
          placeholder="e.g. Stanford University"
          value={school}
          onChangeText={setSchool}
          required
        />

        {/* Degree Input */}
        <ProfileFormInput 
          label="Degree"
          placeholder="e.g. Bachelor of Science"
          value={degree}
          onChangeText={setDegree}
          required
        />

        {/* Field of Study Input */}
        <ProfileFormInput 
          label="Field of Study"
          placeholder="e.g. Computer Science"
          value={fieldOfStudy}
          onChangeText={setFieldOfStudy}
          required
        />

        {/* Start Date Select */}
        <ProfileDateInput 
          label="Start Date"
          placeholder="Select Start Month & Year"
          value={startDate}
          onChange={setStartDate}
          required
        />

        {/* Current Study Switch */}
        <ProfileFormSwitch 
          label="I currently study here"
          value={current}
          onValueChange={(val) => {
            setCurrent(val);
            if (val) setEndDate('');
          }}
        />

        {/* End Date Select */}
        {!current && (
          <ProfileDateInput 
            label="End Date"
            placeholder="Select End Month & Year"
            value={endDate}
            onChange={setEndDate}
            required
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Delete Button */}
          {education && (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Trash2 size={16} color="#FFFFFF" />
                  <Text style={styles.btnTextWhite}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.saveBtn, education && { flex: 1.2 }]}
            onPress={handleSave}
            disabled={isSubmitting || isDeleting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.btnTextWhite}>
                {education ? 'Save Changes' : 'Add Education'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    backgroundColor: '#0D9488',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default EditEducationScreen;
