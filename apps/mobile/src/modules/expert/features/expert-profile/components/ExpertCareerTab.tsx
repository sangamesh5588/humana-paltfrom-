import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Briefcase, Building2, ShieldCheck, GraduationCap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../../../../core/auth/store';

// --- PURE FLAT LOGO BADGE ---
interface CompanyLogoProps {
  companyName: string;
  size?: number;
}

const CompanyLogoBadge: React.FC<CompanyLogoProps> = ({ companyName, size = 38 }) => {
  const [error, setError] = useState(false);

  const getLogoUrl = (name: string) => {
    const cleanName = name.toLowerCase().trim();
    if (cleanName.includes('dell')) return 'https://logo.clearbit.com/dell.com';
    if (cleanName.includes('teksystems')) return 'https://logo.clearbit.com/teksystems.com';
    if (cleanName.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (cleanName.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
    if (cleanName.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (cleanName.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    
    const formatted = cleanName.replace(/[^a-z0-9]/g, '');
    return `https://logo.clearbit.com/${formatted}.com`;
  };

  if (error || !companyName) {
    return (
      <View style={[styles.initialsLogoBox, { width: size, height: size }]}>
        <Building2 size={16} color="#0369A1" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: getLogoUrl(companyName) }}
      style={[styles.logoImage, { width: size, height: size }]}
      onError={() => setError(true)}
      resizeMode="contain"
    />
  );
};

// --- HELPER DATE FORMATTER ---
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Present';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

// --- EXPERT CAREER TAB COMPONENT (READ-ONLY VIEW OF USER CAREER DATA) ---
export const ExpertCareerTab: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const profile = user?.profile;
  const rawExperience = profile?.experiences || profile?.experience || [];
  const rawEducation = profile?.education || [];

  // Fallback demo data if user profile has no experiences yet
  const displayExperiences = rawExperience.length > 0 ? rawExperience : [
    {
      id: 'demo-1',
      role: 'Principal Advisory Architect',
      company: 'Global Tech Corp',
      startDate: '2023-01-01',
      endDate: undefined,
      current: true,
      description: 'Leading enterprise monorepo architecture, microservices scaling, and mobile platform engines.',
      verified: true,
    },
    {
      id: 'demo-2',
      role: 'Senior Staff Engineer',
      company: 'Enterprise Scale Labs',
      startDate: '2020-03-01',
      endDate: '2023-12-01',
      current: false,
      description: 'Architected high-throughput API gateways and React Native cross-platform applications.',
      verified: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header (Read-Only Title) */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Briefcase size={16} color="#0369A1" />
          <Text style={styles.sectionTitle}>Career Experience</Text>
        </View>
        <Text style={styles.readOnlyTag}>Synced from Profile</Text>
      </View>

      {/* 2. Read-Only Experience Rows Synced from User Profile */}
      <View style={styles.flatContainer}>
        {displayExperiences.map((exp: any, index: number) => {
          const cardId = exp.id || `exp-${index}`;
          const roleTitle = exp.title || exp.role || exp.role_title || exp.position || exp.roleTitle || 'Senior Advisory Partner';
          const companyName = exp.company || exp.company_name || exp.companyName || 'Technology Enterprise';
          const startDateVal = exp.start_date || exp.startDate;
          const endDateVal = exp.end_date || exp.endDate;
          const startStr = formatDate(startDateVal);
          const endStr = (exp.current || exp.is_current) ? 'Present' : formatDate(endDateVal);
          const dateRange = `${startStr} - ${endStr}`;
          const desc = exp.description;
          const isLast = index === displayExperiences.length - 1;

          return (
            <View key={cardId} style={[styles.flatRow, !isLast && styles.rowDivider]}>
              <CompanyLogoBadge companyName={companyName} size={38} />

              <View style={styles.infoCol}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleTitle} numberOfLines={1}>{roleTitle}</Text>
                  {(exp.verified === true || exp.emailVerified === true || exp.verificationStatus === 'VERIFIED') ? (
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={10} color="#059669" />
                      <Text style={styles.verifiedBadgeText}>Verified</Text>
                    </View>
                  ) : exp.verificationStatus === 'PENDING_REVIEW' ? (
                    <View style={[styles.verifiedBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1 }]}>
                      <Text style={[styles.verifiedBadgeText, { color: '#1D4ED8' }]}>Pending Review</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ExpertJourney', { typeSlug: 'career', experienceId: exp.id })}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.verifiedBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1 }]}>
                        <Text style={[styles.verifiedBadgeText, { color: '#B45309' }]}>Verify Now</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.companySub}>
                  {companyName} • <Text style={styles.datesText}>{dateRange}</Text>
                </Text>

                {desc ? (
                  <Text style={styles.descText} numberOfLines={2}>
                    {desc}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      {/* 3. Read-Only Education Section Synced from User Profile */}
      {rawEducation.length > 0 && (
        <View style={styles.educationSection}>
          <View style={styles.titleRow}>
            <GraduationCap size={16} color="#0369A1" />
            <Text style={styles.sectionTitle}>Education</Text>
          </View>

          <View style={styles.flatContainer}>
            {rawEducation.map((edu: any, index: number) => {
              const isLast = index === rawEducation.length - 1;
              const degreeTitle = edu.degree || edu.field || edu.field_of_study || edu.degree_name || 'Bachelor of Science';
              const schoolName = edu.institution || edu.school || edu.university || edu.institution_name || 'Accredited University';
              const startYr = edu.start_year || edu.startYear || (edu.start_date ? formatDate(edu.start_date) : '2016');
              const endYr = (edu.current || edu.is_current) ? 'Present' : (edu.end_year || edu.endYear || (edu.end_date ? formatDate(edu.end_date) : '2020'));

              return (
                <View key={edu.id || index} style={[styles.flatRow, !isLast && styles.rowDivider]}>
                  <View style={styles.initialsLogoBox}>
                    <GraduationCap size={16} color="#0369A1" />
                  </View>
                  <View style={styles.infoCol}>
                    <View style={styles.roleTitleRow}>
                      <Text style={styles.roleTitle} numberOfLines={1}>{degreeTitle}</Text>
                      {(edu.verified === true || edu.emailVerified === true || edu.verificationStatus === 'VERIFIED') ? (
                        <View style={styles.verifiedBadge}>
                          <ShieldCheck size={10} color="#059669" />
                          <Text style={styles.verifiedBadgeText}>Verified</Text>
                        </View>
                      ) : edu.verificationStatus === 'PENDING_REVIEW' ? (
                        <View style={[styles.verifiedBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1 }]}>
                          <Text style={[styles.verifiedBadgeText, { color: '#1D4ED8' }]}>Pending Review</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('ExpertJourney', { typeSlug: 'education', educationId: edu.id })}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.verifiedBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1 }]}>
                            <Text style={[styles.verifiedBadgeText, { color: '#B45309' }]}>Verify Now</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.companySub}>
                      {schoolName} • <Text style={styles.datesText}>{startYr} - {endYr}</Text>
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  readOnlyTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  flatContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  flatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  initialsLogoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  companySub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  datesText: {
    fontWeight: '500',
    color: '#64748B',
  },
  descText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
  educationSection: {
    gap: 10,
    marginTop: 4,
  },
});

export default ExpertCareerTab;
