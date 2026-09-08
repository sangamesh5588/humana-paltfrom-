import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Plus, AlertTriangle } from 'lucide-react-native';

interface Experience {
  id: string;
  name: string;
  verified: boolean;
  verificationStatus?: string;
}

interface ChooseExperienceStepProps {
  selectedExperience: string;
  onSelectExperience: (id: string) => void;
  onAddNewExperience: () => void;
  onVerifyPress?: (id: string) => void;
  experiences: Experience[];
}

export const ChooseExperienceStep: React.FC<ChooseExperienceStepProps> = ({
  selectedExperience,
  onSelectExperience,
  onAddNewExperience,
  onVerifyPress,
  experiences,
}) => {
  const selectedItem = experiences.find((e) => e.id === selectedExperience);

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Choose Experience</Text>
      <Text style={styles.formSub}>Which work experience or background powers this session?</Text>

      <View style={styles.experienceList}>
        {experiences.map((exp) => {
          const status = exp.verificationStatus || (exp.verified ? 'VERIFIED' : 'UNVERIFIED');
          const isVerified = exp.verified || status === 'VERIFIED';
          const isPending = status === 'PENDING';
          const isRejected = status === 'REJECTED';

          return (
            <TouchableOpacity
              key={exp.id}
              style={[
                styles.experienceCard,
                !isVerified && { opacity: 0.65, backgroundColor: '#F8FAFC' },
                selectedExperience === exp.id && styles.selectedExperienceCard,
              ]}
              onPress={() => {
                if (!isVerified) {
                  onVerifyPress?.(exp.id);
                } else {
                  onSelectExperience(exp.id);
                }
              }}
            >
              <View style={styles.expInfo}>
                <Text
                  style={[
                    styles.expName,
                    selectedExperience === exp.id && styles.selectedExpName,
                  ]}
                >
                  {exp.name}
                </Text>
                {isVerified ? (
                  <View style={styles.verifiedBadge}>
                    <Check size={10} color="#059669" />
                    <Text style={styles.verifiedBadgeText}>Verified 🛡️</Text>
                  </View>
                ) : isPending ? (
                  <TouchableOpacity
                    style={[styles.verifiedBadge, { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' }]}
                    onPress={() => onVerifyPress?.(exp.id)}
                  >
                    <AlertTriangle size={10} color="#B45309" />
                    <Text style={[styles.verifiedBadgeText, { color: '#B45309' }]}>Under Review ⏳</Text>
                  </TouchableOpacity>
                ) : isRejected ? (
                  <TouchableOpacity
                    style={[styles.verifiedBadge, { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA' }]}
                    onPress={() => onVerifyPress?.(exp.id)}
                  >
                    <AlertTriangle size={10} color="#DC2626" />
                    <Text style={[styles.verifiedBadgeText, { color: '#DC2626' }]}>Re-submit Proof ❌</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.verifiedBadge, { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' }]}
                    onPress={() => onVerifyPress?.(exp.id)}
                  >
                    <AlertTriangle size={10} color="#B45309" />
                    <Text style={[styles.verifiedBadgeText, { color: '#B45309' }]}>Verify Now</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={[
                  styles.radioDot,
                  selectedExperience === exp.id && styles.radioDotSelected,
                ]}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addExperienceCard} onPress={onAddNewExperience}>
          <Plus size={16} color="#0369A1" />
          <Text style={styles.addExperienceText}>Add New Experience</Text>
        </TouchableOpacity>
      </View>

      {selectedItem && !(selectedItem.verified || selectedItem.verificationStatus === 'VERIFIED') ? (
        <View style={styles.unverifiedWarningBanner}>
          <AlertTriangle size={18} color="#D97706" />
          <View style={styles.bannerTextCol}>
            <Text style={styles.warningTitle}>
              {selectedItem.verificationStatus === 'PENDING'
                ? 'Verification Submitted (Under Admin Review)'
                : 'Experience is Unverified'}
            </Text>
            <Text style={styles.warningSub}>
              {selectedItem.verificationStatus === 'PENDING'
                ? 'Your verification documents are currently being reviewed by Admin. Tap Status to check progress.'
                : 'Verify this role to display a Verified Trust Badge 🛡️ on your marketplace session card.'}
            </Text>
          </View>
          {onVerifyPress ? (
            <TouchableOpacity style={styles.verifyNowBtn} onPress={() => onVerifyPress(selectedItem.id)}>
              <Text style={styles.verifyNowBtnText}>
                {selectedItem.verificationStatus === 'PENDING' ? 'Check Status' : 'Verify Now'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  formSub: {
    fontSize: 13,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 16,
    lineHeight: 18,
  },
  experienceList: {
    width: '100%',
    gap: 12,
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
  },
  selectedExperienceCard: {
    borderColor: '#0369A1',
    backgroundColor: '#F0F9FF',
  },
  expInfo: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-start',
  },
  expName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  selectedExpName: {
    color: '#0369A1',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  radioDotSelected: {
    borderColor: '#0369A1',
    backgroundColor: '#0369A1',
  },
  addExperienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#F0F9FF',
  },
  addExperienceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
  },
  unverifiedWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    gap: 10,
    width: '100%',
  },
  bannerTextCol: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  warningSub: {
    fontSize: 11.5,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16,
  },
  verifyNowBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  verifyNowBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
});

export default ChooseExperienceStep;
