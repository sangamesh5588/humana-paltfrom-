import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { 
  Check, 
  ArrowRight,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Shield
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../../../../core/auth/store';

interface OverviewTabProps {
  onNavigateToSkills: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToSkills }) => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const p = user?.profile;

  const isBioStepDone = !!(p?.firstName && p?.lastName);
  const isExperienceStepDone = !!(p?.experience && p?.experience.length > 0);
  const isEducationStepDone = !!(p?.education && p?.education.length > 0);
  const isSkillsStepDone = !!(p?.skills && p?.skills.length > 0);

  const totalSteps = 4;
  const completedStepsCount = [isBioStepDone, isExperienceStepDone, isEducationStepDone, isSkillsStepDone].filter(Boolean).length;
  const progressPercentage = Math.round((completedStepsCount / totalSteps) * 100);

  return (
    <View style={styles.container}>
      
      {/* Redesigned Profile Setup Roadmap Card */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Profile Setup Journey</Text>
        
        {/* Redesigned Premium Colorful Progress Tracker */}
        <View style={styles.progressCard}>
          <View style={styles.progressLeftRow}>
            <View style={styles.progressIconContainer}>
              <Shield size={16} color="#FFFFFF" />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressStrengthText}>Verification Status</Text>
              <Text style={styles.progressPercentage}>
                {progressPercentage}% Profile Strength
              </Text>
            </View>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* Stepper Timeline */}
        <View style={styles.stepperContainer}>
          
          {/* Step 1 */}
          <TouchableOpacity 
            style={styles.stepItem} 
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.7}
          >
            <View style={styles.stepIndicatorCol}>
              <View style={[
                styles.stepDot, 
                isBioStepDone 
                  ? { backgroundColor: '#0D9488', borderColor: '#0D9488' } 
                  : { backgroundColor: '#F8FAFC', borderColor: '#94A3B8', borderStyle: 'dashed' }
              ]}>
                {isBioStepDone ? (
                  <Check size={12} color="#FFFFFF" />
                ) : (
                  <Shield size={12} color="#94A3B8" />
                )}
              </View>
              <View style={[styles.stepLine, isBioStepDone && styles.stepLineActive]} />
            </View>
            <View style={styles.stepContentCol}>
              <View style={styles.actionTitleRow}>
                <Text style={[styles.stepTitle, !isBioStepDone && styles.stepTitlePending]}>Biographical Outline</Text>
                {!isBioStepDone && <ArrowRight size={14} color="#0284C7" />}
              </View>
              <Text style={!isBioStepDone ? styles.stepDescriptionPending : styles.stepDescription}>
                {isBioStepDone 
                  ? 'Your core personal information is successfully registered.' 
                  : 'Fill out your name, headline, location, and bio.'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Step 2 */}
          <TouchableOpacity 
            style={styles.stepItem} 
            onPress={() => navigation.navigate('EditExperience', {})}
            activeOpacity={0.7}
          >
            <View style={styles.stepIndicatorCol}>
              <View style={[
                styles.stepDot, 
                isExperienceStepDone 
                  ? { backgroundColor: '#0284C7', borderColor: '#0284C7' } 
                  : { backgroundColor: '#F8FAFC', borderColor: '#94A3B8', borderStyle: 'dashed' }
              ]}>
                {isExperienceStepDone ? (
                  <Check size={12} color="#FFFFFF" />
                ) : (
                  <Briefcase size={12} color="#94A3B8" />
                )}
              </View>
              <View style={[styles.stepLine, isExperienceStepDone && styles.stepLineActive]} />
            </View>
            <View style={styles.stepContentCol}>
              <View style={styles.actionTitleRow}>
                <Text style={[styles.stepTitle, !isExperienceStepDone && styles.stepTitlePending]}>Career Experience Timeline</Text>
                {!isExperienceStepDone && <ArrowRight size={14} color="#0284C7" />}
              </View>
              <Text style={!isExperienceStepDone ? styles.stepDescriptionPending : styles.stepDescription}>
                {isExperienceStepDone 
                  ? 'Professional work milestones are fully integrated into the database.' 
                  : 'Add your work experience to build your professional profile.'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Step 3 */}
          <TouchableOpacity 
            style={styles.stepItem} 
            onPress={() => navigation.navigate('EditEducation', {})}
            activeOpacity={0.7}
          >
            <View style={styles.stepIndicatorCol}>
              <View style={[
                styles.stepDot, 
                isEducationStepDone 
                  ? { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' } 
                  : { backgroundColor: '#F8FAFC', borderColor: '#94A3B8', borderStyle: 'dashed' }
              ]}>
                {isEducationStepDone ? (
                  <Check size={12} color="#FFFFFF" />
                ) : (
                  <GraduationCap size={12} color="#94A3B8" />
                )}
              </View>
              <View style={[styles.stepLine, isEducationStepDone && styles.stepLineActive]} />
            </View>
            <View style={styles.stepContentCol}>
              <View style={styles.actionTitleRow}>
                <Text style={[styles.stepTitle, !isEducationStepDone && styles.stepTitlePending]}>Academic Credentials</Text>
                {!isEducationStepDone && <ArrowRight size={14} color="#0284C7" />}
              </View>
              <Text style={!isEducationStepDone ? styles.stepDescriptionPending : styles.stepDescription}>
                {isEducationStepDone 
                  ? 'Education credentials verified and attached.' 
                  : 'Add your school, degree, or field of study.'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Step 4 (Action Needed) */}
          <TouchableOpacity style={styles.stepItem} onPress={onNavigateToSkills} activeOpacity={0.7}>
            <View style={styles.stepIndicatorCol}>
              <View style={[
                styles.stepDot, 
                isSkillsStepDone 
                  ? { backgroundColor: '#EC4899', borderColor: '#EC4899' } 
                  : { backgroundColor: '#F8FAFC', borderColor: '#94A3B8', borderStyle: 'dashed' }
              ]}>
                {isSkillsStepDone ? (
                  <Check size={12} color="#FFFFFF" />
                ) : (
                  <TrendingUp size={12} color="#94A3B8" />
                )}
              </View>
            </View>
            <View style={styles.stepContentCol}>
              <View style={styles.actionTitleRow}>
                <Text style={[styles.stepTitle, !isSkillsStepDone && styles.stepTitlePending]}>Core Skills Endorsements</Text>
                {!isSkillsStepDone && <ArrowRight size={14} color="#0284C7" />}
              </View>
              <Text style={!isSkillsStepDone ? styles.stepDescriptionPending : styles.stepDescription}>
                {isSkillsStepDone 
                  ? 'Skills and core competencies are successfully tagged.' 
                  : 'Tag your primary competencies to finish listing profile highlights.'}
              </Text>
            </View>
          </TouchableOpacity>

        </View>
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
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '100%',
    marginTop: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },

  progressLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressStrengthText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 1,
  },

  // Stepper timeline styles
  stepperContainer: {
    paddingLeft: 4,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  stepDotActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    borderColor: '#0D9488',
  },
  stepDotPending: {
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    borderColor: '#0284C7',
    borderStyle: 'dashed',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
    marginBottom: -22,
  },
  stepLineActive: {
    backgroundColor: '#0D9488',
  },
  stepContentCol: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepTitlePending: {
    color: '#0284C7',
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  stepDescriptionPending: {
    fontSize: 12,
    color: '#0284C7',
    lineHeight: 18,
  },
});

export default OverviewTab;
