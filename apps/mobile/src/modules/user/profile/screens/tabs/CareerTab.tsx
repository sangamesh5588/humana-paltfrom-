import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Plus, Edit2, Gem } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../../../navigation/types';
import useAuthStore from '../../../../../core/auth/store';

type CareerTabNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

// --- DYNAMIC LOGO COMPONENT ---
interface CompanyLogoProps {
  companyName: string;
  size?: number;
  theme: { bg: string; border: string; text: string };
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ companyName, size = 48, theme }) => {
  const [error, setError] = useState(false);

  const getLogoUrl = (name: string) => {
    const cleanName = name.toLowerCase().trim();
    if (cleanName.includes('dell')) return 'https://logo.clearbit.com/dell.com';
    if (cleanName.includes('teksystems')) return 'https://logo.clearbit.com/teksystems.com';
    if (cleanName.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (cleanName.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
    if (cleanName.includes('meta') || cleanName.includes('facebook')) return 'https://logo.clearbit.com/meta.com';
    if (cleanName.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (cleanName.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
    if (cleanName.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    
    // Auto guess domain by stripping non-alphanumeric chars
    const formatted = cleanName.replace(/[^a-z0-9]/g, '');
    return `https://logo.clearbit.com/${formatted}.com`;
  };

  if (error || !companyName) {
    return (
      <View style={[styles.logoBadge, { width: size, height: size, borderRadius: 12, backgroundColor: theme.bg, borderColor: theme.border }]}>
        <Text style={[styles.logoText, { color: theme.text, fontSize: size * 0.4 }]}>
          {companyName ? companyName.slice(0, 1).toUpperCase() : 'W'}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: getLogoUrl(companyName) }}
      style={[styles.logoImage, { width: size, height: size, borderRadius: 12 }]}
      onError={() => setError(true)}
      resizeMode="contain"
    />
  );
};

// --- EXPANDABLE DESCRIPTION ---
const ExpandableDescription: React.FC<{ description: string }> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 110;
  
  if (description.length <= maxLength) {
    return <Text style={styles.roleDescriptionText}>{description}</Text>;
  }
  
  return (
    <View style={styles.descriptionContainer}>
      <Text style={styles.roleDescriptionText}>
        {expanded ? description : `${description.slice(0, maxLength)}... `}
        {!expanded && (
          <Text style={styles.moreText} onPress={() => setExpanded(true)}>
             more
          </Text>
        )}
      </Text>
    </View>
  );
};

// --- CAREER TAB MAIN EXPORT ---
export const CareerTab: React.FC = () => {
  const navigation = useNavigation<CareerTabNavigationProp>();
  const { user } = useAuthStore();
  const p = user?.profile;
  const experience = p?.experience;
  const education = p?.education;

  const [expandedCompanies, setExpandedCompanies] = useState<{ [key: string]: boolean }>({});

  const toggleCompanyExpanded = (companyKey: string) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyKey]: !prev[companyKey]
    }));
  };

  // Helper date formatter
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Present';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Helper experience duration calculator
  const calculateDuration = (startDateStr: string, endDateStr?: string, current?: boolean) => {
    try {
      const start = new Date(startDateStr);
      const end = current || !endDateStr ? new Date() : new Date(endDateStr);
      
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth() + 1; // inclusive
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      const yearsText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
      const monthsText = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';
      
      return [yearsText, monthsText].filter(Boolean).join(' ');
    } catch {
      return '';
    }
  };

  // Calculate total duration for a grouped company
  const calculateTotalDuration = (roles: any[]) => {
    let totalMonths = 0;
    roles.forEach(role => {
      try {
        const start = new Date(role.startDate);
        const end = role.current || !role.endDate ? new Date() : new Date(role.endDate);
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        totalMonths += diffMonths;
      } catch {
        // ignore
      }
    });
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    const yearsText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
    const monthsText = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';
    
    return [yearsText, monthsText].filter(Boolean).join(' ');
  };

  // Group experiences by company name
  const groupExperiences = (expList: any[]) => {
    const groups: { [key: string]: any } = {};
    const orderedCompanies: string[] = [];
    
    expList.forEach((exp) => {
      const companyKey = (exp.company || 'Unknown').trim().toLowerCase();
      if (!groups[companyKey]) {
        groups[companyKey] = {
          company: exp.company || 'Unknown',
          location: exp.location,
          roles: []
        };
        orderedCompanies.push(companyKey);
      }
      groups[companyKey].roles.push(exp);
    });
    
    orderedCompanies.forEach((key) => {
      groups[key].roles.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    });
    
    return orderedCompanies.map(key => groups[key]).sort((a, b) => {
      const aLatest = new Date(a.roles[0].startDate).getTime();
      const bLatest = new Date(b.roles[0].startDate).getTime();
      return bLatest - aLatest;
    });
  };

  // Helper company / school logo color theme selector
  const getBrandTheme = (name: string, index: number) => {
    const themes = [
      { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' }, // Mint Green
      { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' }, // Cool Blue
      { bg: '#FFFBEB', border: '#FDE047', text: '#D97706' }, // Warm Gold
      { bg: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED' }, // Soft Purple
    ];
    const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : index;
    return themes[hash % themes.length];
  };

  // Parses job type (employment type) from title/description
  const parseJobType = (title: string, desc: string) => {
    const combined = `${title} ${desc}`.toLowerCase();
    if (combined.includes('part-time') || combined.includes('part time')) return 'Part-time';
    if (combined.includes('intern') || combined.includes('internship')) return 'Internship';
    if (combined.includes('contract')) return 'Contract';
    if (combined.includes('freelance')) return 'Freelance';
    return 'Full-time';
  };

  // Parses location type (hybrid/remote/on-site)
  const parseLocationType = (loc: string, desc: string) => {
    const combined = `${loc} ${desc}`.toLowerCase();
    if (combined.includes('remote')) return 'Remote';
    if (combined.includes('hybrid')) return 'Hybrid';
    return 'On-site';
  };

  // Extract relevant matching skills from profile skills list
  const getRoleSkills = (title: string, desc: string, profileSkills?: string[]) => {
    if (!profileSkills || profileSkills.length === 0) {
      return { display: 'Problem Solving, Team Collaboration', count: 0 };
    }

    const matched = profileSkills.filter(skill => {
      const s = skill.toLowerCase();
      return title.toLowerCase().includes(s) || desc.toLowerCase().includes(s);
    });

    const baseSkills = matched.length > 0 ? matched : profileSkills.slice(0, 2);
    const extraCount = profileSkills.length - baseSkills.length;

    return {
      display: baseSkills.join(', '),
      count: extraCount > 0 ? extraCount : 0
    };
  };

  // --- Navigation Triggers ---
  const navigateToAddExperience = () => {
    (navigation as any).navigate('EditExperience', { lockCompany: false });
  };

  const navigateToEditExperience = (role: any) => {
    (navigation as any).navigate('EditExperience', { experience: role });
  };

  const navigateToAddEducation = () => {
    (navigation as any).navigate('EditEducation', {});
  };

  const navigateToEditEducation = (edu: any) => {
    (navigation as any).navigate('EditEducation', { education: edu });
  };

  return (
    <View style={styles.container}>
      {/* Experience block */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Experience history</Text>
          <TouchableOpacity style={styles.addBtn} onPress={navigateToAddExperience}>
            <Plus size={14} color="#0D9488" />
            <Text style={styles.addBtnText}>Add role</Text>
          </TouchableOpacity>
        </View>

        {experience && experience.length > 0 ? (
          groupExperiences(experience).map((group: any, index: number) => {
            const theme = getBrandTheme(group.company || '', index);
            const totalDuration = calculateTotalDuration(group.roles);
            const hasMultipleRoles = group.roles.length > 1;
            const companyKey = (group.company || 'Unknown').trim().toLowerCase();
            const isExpanded = !!expandedCompanies[companyKey];
            const visibleRoles = isExpanded ? group.roles : [group.roles[0]];

            return (
              <View key={index} style={styles.careerCard}>
                {hasMultipleRoles ? (
                  /* GROUPED ROLES TIMELINE LAYOUT (LinkedIn style) */
                  <View style={styles.groupedContainer}>
                    {/* Header Row */}
                    <View style={styles.companyHeaderRow}>
                      <CompanyLogo companyName={group.company} size={48} theme={theme} />
                      <View style={styles.companyHeaderDetails}>
                        <Text style={styles.companyGroupTitle}>{group.company}</Text>
                        <Text style={styles.totalDurationText}>{totalDuration}</Text>
                      </View>
                    </View>

                    {/* Timeline elements */}
                    <View style={styles.rolesTimeline}>
                      {visibleRoles.map((role: any, rIdx: number) => {
                        const rDuration = calculateDuration(role.startDate, role.endDate, role.current);
                        const jobType = parseJobType(role.title, role.description || '');
                        const locType = parseLocationType(role.location || '', role.description || '');
                        const skillsInfo = getRoleSkills(role.title, role.description || '', p?.skills);

                        return (
                          <View key={role.id || rIdx} style={styles.roleTimelineItem}>
                            {/* Left Column: Timeline Line and Dot (aligned with logo) */}
                            <View style={styles.timelineIndicatorCol}>
                              {isExpanded && rIdx < group.roles.length - 1 && <View style={styles.timelineLine} />}
                              <View style={styles.timelineDot} />
                            </View>

                            {/* Right Column: Role Details */}
                            <View style={styles.roleDetailsCol}>
                              <View style={styles.roleTitleRow}>
                                <Text style={styles.roleTitle}>{role.title}</Text>
                                <TouchableOpacity onPress={() => navigateToEditExperience(role)}>
                                  <Edit2 size={12} color="#94A3B8" style={styles.editIcon} />
                                </TouchableOpacity>
                              </View>
                              
                              <Text style={styles.jobTypeLabel}>{jobType}</Text>
                              
                              <Text style={styles.datesText}>
                                {formatDate(role.startDate)} – {role.current ? 'Present' : formatDate(role.endDate)} · {rDuration}
                              </Text>

                              {role.location && (
                                <Text style={styles.locationText}>
                                  {role.location} · {locType}
                                </Text>
                              )}

                              {role.description && (
                                <ExpandableDescription description={role.description} />
                              )}

                              <View style={styles.skillsRow}>
                                <Gem size={12} color="#475569" style={styles.skillsIcon} />
                                <Text style={styles.skillsText}>
                                  {skillsInfo.display}
                                  {skillsInfo.count > 0 ? ` and +${skillsInfo.count} skill${skillsInfo.count > 1 ? 's' : ''}` : ''}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {/* Show More / Show Less Toggle Button */}
                    <TouchableOpacity 
                      style={styles.toggleExpandBtn} 
                      onPress={() => toggleCompanyExpanded(companyKey)}
                    >
                      <Text style={styles.toggleExpandText}>
                        {isExpanded 
                          ? 'See less' 
                          : `See more (+${group.roles.length - 1} role${group.roles.length - 1 > 1 ? 's' : ''})`
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* SINGLE ROLE LAYOUT (Clean, minimalist layout) */
                  <View style={styles.singleRoleContainer}>
                    <CompanyLogo companyName={group.company} size={48} theme={theme} />
                    
                    <View style={styles.singleRoleDetails}>
                      <View style={styles.roleTitleRow}>
                        <Text style={styles.roleTitle}>{group.roles[0].title}</Text>
                        <TouchableOpacity onPress={() => navigateToEditExperience(group.roles[0])}>
                          <Edit2 size={12} color="#94A3B8" style={styles.editIcon} />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.companyText}>
                        {group.company} · {parseJobType(group.roles[0].title, group.roles[0].description || '')}
                      </Text>

                      <Text style={styles.datesText}>
                        {formatDate(group.roles[0].startDate)} – {group.roles[0].current ? 'Present' : formatDate(group.roles[0].endDate)} · {totalDuration}
                      </Text>

                      {group.roles[0].location && (
                        <Text style={styles.locationText}>
                          {group.roles[0].location} · {parseLocationType(group.roles[0].location, group.roles[0].description || '')}
                        </Text>
                      )}

                      {group.roles[0].description && (
                        <ExpandableDescription description={group.roles[0].description} />
                      )}

                      <View style={styles.skillsRow}>
                        <Gem size={12} color="#475569" style={styles.skillsIcon} />
                        <Text style={styles.skillsText}>
                          {getRoleSkills(group.roles[0].title, group.roles[0].description || '', p?.skills).display}
                          {getRoleSkills(group.roles[0].title, group.roles[0].description || '', p?.skills).count > 0 
                            ? ` and +${getRoleSkills(group.roles[0].title, group.roles[0].description || '', p?.skills).count} skill${getRoleSkills(group.roles[0].title, group.roles[0].description || '', p?.skills).count > 1 ? 's' : ''}` 
                            : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No experience history added yet.</Text>
        )}
      </View>

      <View style={styles.blockDivider} />

      {/* Education block */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Education credentials</Text>
          <TouchableOpacity style={styles.addBtn} onPress={navigateToAddEducation}>
            <Plus size={14} color="#0D9488" />
            <Text style={styles.addBtnText}>Add study</Text>
          </TouchableOpacity>
        </View>
        
        {education && education.length > 0 ? (
          education.map((edu: any, index: number) => {
            const theme = getBrandTheme(edu.school || '', index + 2);
            return (
              <View key={edu.id || index} style={styles.careerCard}>
                <View style={styles.singleRoleContainer}>
                  <CompanyLogo companyName={edu.school} size={48} theme={theme} />
                  
                  <View style={styles.singleRoleDetails}>
                    <View style={styles.roleTitleRow}>
                      <Text style={styles.roleTitle}>{edu.degree} in {edu.fieldOfStudy}</Text>
                      <TouchableOpacity onPress={() => navigateToEditEducation(edu)}>
                        <Edit2 size={12} color="#94A3B8" style={styles.editIcon} />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.companyText}>{edu.school}</Text>
                    
                    <Text style={styles.datesText}>
                      {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No education history added yet.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  sectionBlock: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.2)',
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D9488',
    marginLeft: 4,
  },
  blockDivider: {
    height: 4,
    backgroundColor: '#F1F5F9',
  },
  // Minimalist Custom flat career cards
  careerCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
  },
  logoBadge: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  logoImage: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  logoText: {
    fontWeight: 'bold',
  },
  editIcon: {
    padding: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginVertical: 4,
  },
  
  // Single Role container layout
  singleRoleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  singleRoleDetails: {
    flex: 1,
    marginLeft: 16,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    flex: 1,
    paddingRight: 8,
  },
  companyText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginTop: 3,
  },
  datesText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  roleDescriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginTop: 8,
  },
  descriptionContainer: {
    marginTop: 4,
  },
  moreText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Skills Row
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  skillsIcon: {
    marginRight: 6,
  },
  skillsText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },

  // Grouped Roles (LinkedIn style)
  groupedContainer: {
    width: '100%',
  },
  companyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  companyHeaderDetails: {
    flex: 1,
    marginLeft: 16,
  },
  companyGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalDurationText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 1,
  },
  
  // Timeline styles
  rolesTimeline: {
    marginTop: 16,
  },
  roleTimelineItem: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 22,
  },
  timelineIndicatorCol: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: 6,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    position: 'absolute',
    top: 10,
    bottom: -22,
    backgroundColor: '#E2E8F0',
    left: 23,
    zIndex: 1,
  },
  roleDetailsCol: {
    flex: 1,
    marginLeft: 16,
  },
  jobTypeLabel: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  toggleExpandBtn: {
    marginLeft: 64,
    marginTop: -4,
    paddingVertical: 6,
  },
  toggleExpandText: {
    color: '#0D9488',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default CareerTab;
