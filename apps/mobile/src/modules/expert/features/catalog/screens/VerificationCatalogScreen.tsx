import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, AlertCircle, Building2, GraduationCap } from 'lucide-react-native';
import useExpertStore from '../../../shared/store/expertStore';
import { ExpertApi } from '../../../shared/api/expert.api';
import Theme from '../../../../../app/theme';

export const VerificationCatalogScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { fetchVerificationTypes } = useExpertStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSector, setExpandedSector] = useState<'career' | 'education' | null>(null);

  // Quick form states for inline creation
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      await fetchVerificationTypes();
      const profile = await ExpertApi.getProfile();
      setProfileData(profile);
    } catch (e) {
      console.warn('Error loading catalog profile details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExperience = async () => {
    if (!company.trim() || !jobTitle.trim()) {
      Alert.alert('Required Fields', 'Please enter both the Company Name and Job Title.');
      return;
    }

    setIsAdding(true);
    try {
      await ExpertApi.addExperience({
        company: company.trim(),
        title: jobTitle.trim(),
        startDate: new Date().toISOString(),
        current: true,
      });
      setCompany('');
      setJobTitle('');
      // Reload profile list
      const profile = await ExpertApi.getProfile();
      setProfileData(profile);
      Alert.alert('Experience Added', 'Experience added successfully! You can now verify it.');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add experience.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddEducation = async () => {
    if (!school.trim() || !degree.trim()) {
      Alert.alert('Required Fields', 'Please enter both the School/University and your Degree.');
      return;
    }

    setIsAdding(true);
    try {
      await ExpertApi.addEducation({
        school: school.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim() || 'General Study',
        startDate: new Date().toISOString(),
        current: true,
      });
      setSchool('');
      setDegree('');
      setFieldOfStudy('');
      // Reload profile list
      const profile = await ExpertApi.getProfile();
      setProfileData(profile);
      Alert.alert('Education Added', 'Education added successfully! You can now verify it.');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add education.');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const userExperiences = profileData?.experience || [];
  const userEducation = profileData?.education || [];

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => expandedSector ? setExpandedSector(null) : navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>
          {expandedSector === 'career' ? 'Corporate Career list' : expandedSector === 'education' ? 'Education degrees list' : 'Become an Expert'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {expandedSector === null ? (
          <>
            {/* Header */}
            <View style={styles.actionHeader}>
              <Text style={styles.mainTitle}>Where is your experience from?</Text>
              <Text style={styles.mainSubtitle}>
                Select the sector matching your credential history to begin instant verification.
              </Text>
            </View>

            {/* Sectors Grid */}
            <View style={styles.sectorList}>
              {/* Sector 1: Career */}
              <TouchableOpacity
                style={styles.sectorCard}
                onPress={() => setExpandedSector('career')}
                activeOpacity={0.88}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                  <Building2 size={24} color="#0369A1" />
                </View>
                <View style={styles.sectorInfo}>
                  <Text style={styles.sectorTitle}>Corporate Career & Work</Text>
                  <Text style={styles.sectorSubtitle}>Verify your employment history at startups or tech MNCs.</Text>
                </View>
              </TouchableOpacity>

              {/* Sector 2: Education */}
              <TouchableOpacity
                style={styles.sectorCard}
                onPress={() => setExpandedSector('education')}
                activeOpacity={0.88}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <GraduationCap size={24} color="#4F46E5" />
                </View>
                <View style={styles.sectorInfo}>
                  <Text style={styles.sectorTitle}>Education & Degrees</Text>
                  <Text style={styles.sectorSubtitle}>Verify your university credentials, degrees, or alumni status.</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : expandedSector === 'career' ? (
          <View style={styles.detailContainer}>
            {/* Career Items */}
            <Text style={styles.sectionHeading}>Your Work Experiences</Text>
            {userExperiences.length === 0 ? (
              <View style={styles.emptyCard}>
                <AlertCircle size={20} color="#64748B" />
                <Text style={styles.emptyText}>No work experiences listed in your profile yet.</Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {userExperiences.map((exp: any) => (
                  <View key={exp.id} style={styles.itemRow}>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemTitle}>{exp.title}</Text>
                      <Text style={styles.itemSub}>{exp.company}</Text>
                    </View>
                    {exp.verified ? (
                      <View style={styles.verifiedBadge}>
                        <Check size={12} color="#059669" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    ) : exp.verificationSessions?.some((s: any) => s.status === 'PENDING_REVIEW' || s.status === 'PENDING_VERIFICATION') ? (
                      <View style={[styles.verifiedBadge, { backgroundColor: '#FFEDD5' }]}>
                        <Text style={[styles.verifiedText, { color: '#C2410C' }]}>Pending</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.verifyBtn}
                        onPress={() => navigation.navigate('ExpertJourney', { typeSlug: 'career', experienceId: exp.id })}
                      >
                        <Text style={styles.verifyBtnText}>Verify</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Inline Add form */}
            <View style={styles.formCard}>
              <Text style={styles.formHeading}>+ Add New Experience</Text>
              
              <Text style={styles.inputLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Google"
                placeholderTextColor="#94A3B8"
                value={company}
                onChangeText={setCompany}
              />

              <Text style={styles.inputLabel}>Job Title / Role</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Software Engineer"
                placeholderTextColor="#94A3B8"
                value={jobTitle}
                onChangeText={setJobTitle}
              />

              <TouchableOpacity
                style={[styles.addBtn, isAdding && styles.disabledBtn]}
                onPress={handleAddExperience}
                disabled={isAdding}
              >
                {isAdding ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.addBtnText}>Add Experience</Text>}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.backSectorBtn} onPress={() => setExpandedSector(null)}>
              <Text style={styles.backSectorText}>Back to Sectors</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.detailContainer}>
            {/* Education Items */}
            <Text style={styles.sectionHeading}>Your Academic Degrees</Text>
            {userEducation.length === 0 ? (
              <View style={styles.emptyCard}>
                <AlertCircle size={20} color="#64748B" />
                <Text style={styles.emptyText}>No academic degrees listed in your profile yet.</Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {userEducation.map((edu: any) => (
                  <View key={edu.id} style={styles.itemRow}>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemTitle}>{edu.degree}</Text>
                      <Text style={styles.itemSub}>{edu.school}</Text>
                    </View>
                    {edu.verified ? (
                      <View style={styles.verifiedBadge}>
                        <Check size={12} color="#059669" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    ) : edu.verificationSessions?.some((s: any) => s.status === 'PENDING_REVIEW' || s.status === 'PENDING_VERIFICATION') ? (
                      <View style={[styles.verifiedBadge, { backgroundColor: '#FFEDD5' }]}>
                        <Text style={[styles.verifiedText, { color: '#C2410C' }]}>Pending</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.verifyBtn}
                        onPress={() => navigation.navigate('ExpertJourney', { typeSlug: 'education', educationId: edu.id })}
                      >
                        <Text style={styles.verifyBtnText}>Verify</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Inline Add form */}
            <View style={styles.formCard}>
              <Text style={styles.formHeading}>+ Add New Education</Text>
              
              <Text style={styles.inputLabel}>School / University</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. IIT Bombay"
                placeholderTextColor="#94A3B8"
                value={school}
                onChangeText={setSchool}
              />

              <Text style={styles.inputLabel}>Degree Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bachelor of Technology"
                placeholderTextColor="#94A3B8"
                value={degree}
                onChangeText={setDegree}
              />

              <Text style={styles.inputLabel}>Field of Study (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Computer Science"
                placeholderTextColor="#94A3B8"
                value={fieldOfStudy}
                onChangeText={setFieldOfStudy}
              />

              <TouchableOpacity
                style={[styles.addBtn, isAdding && styles.disabledBtn]}
                onPress={handleAddEducation}
                disabled={isAdding}
              >
                {isAdding ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.addBtnText}>Add Education</Text>}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.backSectorBtn} onPress={() => setExpandedSector(null)}>
              <Text style={styles.backSectorText}>Back to Sectors</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  actionHeader: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  sectorList: {
    gap: 14,
  },
  sectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectorInfo: {
    flex: 1,
    gap: 3,
  },
  sectorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectorSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  detailContainer: {
    gap: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  itemsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 10,
  },
  itemMeta: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemSub: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  verifyBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  formHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  addBtn: {
    backgroundColor: '#0369A1',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  backSectorBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backSectorText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default VerificationCatalogScreen;
