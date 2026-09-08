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
import { Trash2, Plus } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../../navigation/types';
import ApiClient from '../../../../core/api/client';
import useAuthStore from '../../../../core/auth/store';
import SearchableDropdown from '../../onboarding/components/SearchableDropdown';

import ProfileHeader from '../components/ProfileHeader';
import ProfileFormInput from '../components/ProfileFormInput';
import ProfileFormSwitch from '../components/ProfileFormSwitch';
import ProfileDateInput from '../components/ProfileDateInput';

type EditExperienceScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditExperience'>;
type EditExperienceScreenRouteProp = RouteProp<ProfileStackParamList, 'EditExperience'>;

export const EditExperienceScreen: React.FC = () => {
  const navigation = useNavigation<EditExperienceScreenNavigationProp>();
  const route = useRoute<EditExperienceScreenRouteProp>();
  const { refreshUser } = useAuthStore();
  
  const { experience, lockCompany, companyName, location: routeLocation } = route.params || {};

  // --- Form Fields State ---
  const [company, setCompany] = React.useState(experience?.company || experience?.company_name || companyName || '');
  const [isCompanyLocked, setIsCompanyLocked] = React.useState(lockCompany || false);
  const [isEditingExisting, setIsEditingExisting] = React.useState(!!experience);
  
  const [title, setTitle] = React.useState(experience?.title || experience?.role || experience?.role_title || experience?.position || '');
  const [location, setLocation] = React.useState(experience?.location || routeLocation || '');
  const [startDate, setStartDate] = React.useState(experience?.startDate || experience?.start_date ? (experience.startDate || experience.start_date).slice(0, 7) : '');
  const [endDate, setEndDate] = React.useState(experience?.endDate || experience?.end_date ? (experience.endDate || experience.end_date).slice(0, 7) : '');
  const [current, setCurrent] = React.useState(experience?.current ?? experience?.is_current ?? false);
  const [description, setDescription] = React.useState(experience?.description || '');
  const [documentUrl, setDocumentUrl] = React.useState<string | null>(experience?.documentUrl || experience?.document_url || null);
  const [_isUploadingDoc, _setIsUploadingDoc] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleSave = async () => {
    if (!company.trim() || !title.trim()) {
      Alert.alert('Required Fields', 'Please enter Company Name and Role Title.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Required Field', 'Please enter Location.');
      return;
    }
    if (!startDate.trim()) {
      Alert.alert('Required Field', 'Please enter a valid Start Date.');
      return;
    }
    if (!current && !endDate.trim()) {
      Alert.alert('Required Field', 'Please enter an End Date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        company: company.trim(),
        title: title.trim(),
        location: location.trim(),
        startDate: `${startDate}-01`,
        endDate: current || !endDate.trim() ? null : `${endDate}-01`,
        current,
        description: description.trim() || null,
        documentUrl,
        verificationStatus: documentUrl ? 'PENDING' : (experience?.verificationStatus || 'UNVERIFIED'),
      };

      if (isEditingExisting && experience) {
        await ApiClient.put(`/profile/experience/${experience.id}`, payload);
      } else {
        await ApiClient.post('/profile/experience', payload);
      }

      await refreshUser();
      navigation.goBack();
    } catch (e: any) {
      console.log('Error saving experience:', e);
      Alert.alert('Error', e.response?.data?.message || 'Failed to save experience details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!experience) return;

    Alert.alert(
      'Delete Role',
      `Are you sure you want to delete your role as "${title}" at "${company}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await ApiClient.delete(`/profile/experience/${experience.id}`);
              await refreshUser();
              navigation.goBack();
            } catch (e: any) {
              console.log('Error deleting experience:', e);
              Alert.alert('Error', 'Failed to delete experience.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const handleAddAnotherRole = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setCurrent(false);
    setDescription('');
    
    setIsEditingExisting(false);
    setIsCompanyLocked(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <ProfileHeader 
        title={isEditingExisting 
          ? 'Edit Role Details' 
          : (isCompanyLocked ? `Add Role at ${company}` : 'Add New Role')
        } 
        onBack={() => navigation.goBack()} 
      />

      {/* Form Content */}
      <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Add Another Role Banner */}
        {isEditingExisting && (
          <TouchableOpacity style={styles.addAnotherBtn} onPress={handleAddAnotherRole}>
            <Plus size={14} color="#0D9488" />
            <Text style={styles.addAnotherBtnText}>Add another role at {company}</Text>
          </TouchableOpacity>
        )}

        {/* Company Input */}
        <View style={[styles.inputGroup, { zIndex: 10, position: 'relative' }]}>
          <SearchableDropdown
            label="Company Name *"
            placeholder="e.g. Google, Tata Consultancy Services"
            endpoint="companies"
            selectedValue=""
            selectedLabel={company}
            onSelect={(item) => setCompany(item.name)}
            allowCustom
            disabled={isCompanyLocked}
          />
        </View>

        {/* Title Input */}
        <View style={[styles.inputGroup, { zIndex: 9, position: 'relative' }]}>
          <SearchableDropdown
            label="Role Title *"
            placeholder="e.g. Senior Recruiter, Frontend Engineer"
            endpoint="job-titles"
            selectedValue=""
            selectedLabel={title}
            onSelect={(item) => setTitle(item.name)}
            labelKey="title"
            allowCustom
          />
        </View>

        {/* Location Input */}
        <ProfileFormInput 
          label="Location"
          placeholder="e.g. Bangalore, Hybrid, Remote"
          value={location}
          onChangeText={setLocation}
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

        {/* Current Role Switch */}
        <ProfileFormSwitch 
          label="I currently work in this role"
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

        {/* Description Input */}
        <ProfileFormInput 
          label="Description (Optional)"
          placeholder="Summarize key responsibilities, projects, and achievements in this role..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Verification Document Proof */}
        <View style={styles.inputGroup}>
          <Text style={styles.docLabel}>Proof of Experience Document (Offer Letter / Payslip / ID Card)</Text>
          <Text style={styles.docSub}>Attaching document proof will submit your experience for Admin Verification 🛡️</Text>
          <TouchableOpacity
            style={styles.uploadDocBox}
            onPress={() => {
              Alert.alert(
                'Attach Document Proof',
                'Enter document URL or attach file proof for admin review:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Attach Sample Proof',
                    onPress: () => {
                      setDocumentUrl('https://xfgdxcekwizpqwzzctit.supabase.co/storage/v1/object/public/documents/experience_proof.pdf');
                      Alert.alert('Document Attached', 'Document proof attached! Save role to submit for verification.');
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.uploadDocText}>
              {documentUrl ? '✓ Document Proof Attached (Tap to Change)' : '+ Attach Proof Document (PDF/JPG)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Delete Button */}
          {isEditingExisting && (
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
                  <Text style={styles.btnTextWhite}>Delete Role</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.saveBtn, isEditingExisting && { flex: 1.2 }]}
            onPress={handleSave}
            disabled={isSubmitting || isDeleting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.btnTextWhite}>
                {isEditingExisting ? 'Save Changes' : 'Add Experience'}
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
  addAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0D9488',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  addAnotherBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D9488',
    marginLeft: 6,
  },
  inputGroup: {
    marginBottom: 18,
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
  docLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  docSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 8,
  },
  uploadDocBox: {
    borderWidth: 1.5,
    borderColor: '#0D9488',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadDocText: {
    color: '#0D9488',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default EditExperienceScreen;
