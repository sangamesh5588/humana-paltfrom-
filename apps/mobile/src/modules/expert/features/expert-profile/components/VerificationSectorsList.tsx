import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Briefcase, GraduationCap, Zap, Plus, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { VerificationTypeItem } from '../../../shared/types/expert.types';

interface VerificationSectorsListProps {
  availableTypes: VerificationTypeItem[];
  activeBadges: Array<{ id: string; name: string }>;
  onStartVerification: (slug: string) => void;
}

export const VerificationSectorsList: React.FC<VerificationSectorsListProps> = ({
  availableTypes,
  activeBadges,
  onStartVerification,
}) => {
  const getSectorMeta = (slug: string) => {
    switch (slug) {
      case 'education':
        return {
          icon: <GraduationCap size={18} color="#0369A1" />,
          title: 'Higher Education & Alumni',
        };
      case 'skills':
        return {
          icon: <Zap size={18} color="#0369A1" />,
          title: 'Specialized Skills & Advisory',
        };
      default:
        return {
          icon: <Briefcase size={18} color="#0369A1" />,
          title: 'Corporate Career & Experience',
        };
    }
  };

  const isSectorVerified = (slug: string, title: string) => {
    if (activeBadges && activeBadges.length > 0) {
      return activeBadges.some(
        (b) => b.name.toLowerCase().includes(slug) || b.name.toLowerCase().includes(title.toLowerCase())
      );
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ShieldCheck size={16} color="#0369A1" />
        <Text style={styles.sectionTitle}>Verification Sectors</Text>
      </View>

      <View style={styles.flatCardContainer}>
        {availableTypes.map((sector, index) => {
          const meta = getSectorMeta(sector.slug);
          const verified = isSectorVerified(sector.slug, sector.title || meta.title);
          const isLast = index === availableTypes.length - 1;

          return (
            <View 
              key={sector.id || sector.slug} 
              style={[styles.flatRow, !isLast && styles.flatRowBorder]}
            >
              <View style={styles.flatIconCircle}>
                {meta.icon}
              </View>

              <Text style={styles.flatTitle}>{sector.title || meta.title}</Text>

              {verified ? (
                <View style={styles.flatVerifiedBadge}>
                  <CheckCircle2 size={12} color="#059669" />
                  <Text style={styles.flatVerifiedText}>Verified</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.flatVerifyBtn}
                  onPress={() => onStartVerification(sector.slug)}
                  activeOpacity={0.75}
                >
                  <Plus size={12} color="#0369A1" />
                  <Text style={styles.flatVerifyBtnText}>Verify</Text>
                  <ChevronRight size={12} color="#0369A1" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  flatCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 14,
  },
  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  flatRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  flatIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  flatVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  flatVerifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  flatVerifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  flatVerifyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369A1',
  },
});

export default VerificationSectorsList;
