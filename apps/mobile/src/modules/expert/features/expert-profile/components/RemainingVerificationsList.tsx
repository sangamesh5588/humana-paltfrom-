import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Briefcase, GraduationCap, Zap, Plus, Sparkles, ChevronRight } from 'lucide-react-native';
import { VerificationTypeItem } from '../../../shared/types/expert.types';

interface RemainingVerificationsListProps {
  availableTypes: VerificationTypeItem[];
  activeBadges: Array<{ id: string; name: string }>;
  onStartVerification: (slug: string) => void;
}

export const RemainingVerificationsList: React.FC<RemainingVerificationsListProps> = ({
  availableTypes,
  activeBadges,
  onStartVerification,
}) => {
  const getSectorMeta = (slug: string) => {
    switch (slug) {
      case 'education':
        return {
          icon: <GraduationCap size={20} color="#4F46E5" />,
          title: 'Higher Education & Alumni',
          subtitle: 'Verify degree or alumni status via .edu email',
          bg: '#EEF2FF',
          accent: '#4F46E5',
          btnBg: '#E0E7FF',
        };
      case 'skills':
        return {
          icon: <Zap size={20} color="#D97706" />,
          title: 'Specialized Skills & Advisory',
          subtitle: 'Verify UI/UX, Tech, Growth, or Portfolio links',
          bg: '#FEF3C7',
          accent: '#D97706',
          btnBg: '#FDE68A',
        };
      default:
        return {
          icon: <Briefcase size={20} color="#0369A1" />,
          title: 'Corporate Career & Experience',
          subtitle: 'Verify MNC/Company role via work email',
          bg: '#E0F2FE',
          accent: '#0369A1',
          btnBg: '#BAE6FD',
        };
    }
  };

  // Filter out sectors that are already verified
  const remainingSectors = availableTypes.filter((type) => {
    const isAlreadyVerified = activeBadges.some(
      (b) => b.name.toLowerCase().includes(type.slug) || b.name.toLowerCase().includes(type.title.toLowerCase())
    );
    return !isAlreadyVerified;
  });

  const sectorsToDisplay = remainingSectors.length > 0 ? remainingSectors : availableTypes;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Sparkles size={18} color="#D97706" />
        <Text style={styles.sectionTitle}>Available Verification Sectors</Text>
      </View>

      <View style={styles.listCol}>
        {sectorsToDisplay.map((sector) => {
          const meta = getSectorMeta(sector.slug);
          return (
            <TouchableOpacity
              key={sector.id || sector.slug}
              style={styles.sectorCard}
              onPress={() => onStartVerification(sector.slug)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
                {meta.icon}
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.sectorTitle}>{sector.title || meta.title}</Text>
                <Text style={styles.sectorSub}>{sector.subtitle || meta.subtitle}</Text>
              </View>

              <View style={[styles.verifyBtn, { backgroundColor: meta.btnBg }]}>
                <Plus size={14} color={meta.accent} />
                <Text style={[styles.verifyBtnText, { color: meta.accent }]}>Verify</Text>
                <ChevronRight size={14} color={meta.accent} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  listCol: {
    gap: 10,
  },
  sectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  sectorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectorSub: {
    fontSize: 12,
    color: '#64748B',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});

export default RemainingVerificationsList;
