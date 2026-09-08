import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Briefcase, GraduationCap, Zap, Clock, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { VerificationTypeItem } from '../../../shared/types/expert.types';

interface VerificationTypeCardProps {
  item: VerificationTypeItem;
  onSelect: (item: VerificationTypeItem) => void;
}

export const VerificationTypeCard: React.FC<VerificationTypeCardProps> = ({ item, onSelect }) => {
  const getSectorMeta = () => {
    switch (item.slug) {
      case 'education':
        return {
          icon: <GraduationCap size={24} color="#4F46E5" />,
          accentColor: '#4F46E5',
          lightBg: '#EEF2FF',
          tagPill: 'University (.edu) Email',
          tagPillBg: '#E0E7FF',
          highlights: ['Accredited Universities', 'Degrees & Alumni', 'Student IDs'],
        };
      case 'skills':
        return {
          icon: <Zap size={24} color="#D97706" />,
          accentColor: '#D97706',
          lightBg: '#FEF3C7',
          tagPill: 'Personal / Portfolio Email',
          tagPillBg: '#FDE68A',
          highlights: ['UI/UX & Engineering', 'Growth & Advisory', 'Certifications'],
        };
      default:
        return {
          icon: <Briefcase size={24} color="#0369A1" />,
          accentColor: '#0369A1',
          lightBg: '#E0F2FE',
          tagPill: 'Corporate Work Email',
          tagPillBg: '#BAE6FD',
          highlights: ['Tech Companies & MNCs', 'Startup Leaders', 'Offer Letters'],
        };
    }
  };

  const meta = getSectorMeta();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onSelect(item)}
      activeOpacity={0.88}
    >
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: meta.lightBg }]}>
          {meta.icon}
        </View>

        <View style={styles.titleCol}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.emailTag, { backgroundColor: meta.tagPillBg }]}>
            <ShieldCheck size={12} color={meta.accentColor} />
            <Text style={[styles.emailTagText, { color: meta.accentColor }]}>{meta.tagPill}</Text>
          </View>
        </View>
      </View>

      {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}

      {/* Feature Bullet Highlights */}
      <View style={styles.highlightsContainer}>
        {meta.highlights.map((h, i) => (
          <View key={i} style={styles.highlightPill}>
            <CheckCircle2 size={12} color="#64748B" />
            <Text style={styles.highlightText}>{h}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Footer Row */}
      <View style={styles.footerRow}>
        <View style={styles.timeTag}>
          <Clock size={13} color="#64748B" />
          <Text style={styles.timeText}>Est. {item.estimatedTime || '3 mins'}</Text>
        </View>

        <View style={styles.selectActionRow}>
          <Text style={[styles.selectActionText, { color: meta.accentColor }]}>Continue</Text>
          <ChevronRight size={18} color={meta.accentColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emailTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  emailTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highlightText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  selectActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default VerificationTypeCard;
