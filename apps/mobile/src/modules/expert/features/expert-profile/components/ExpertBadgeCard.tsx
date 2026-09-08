import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, GraduationCap, Zap, Briefcase } from 'lucide-react-native';

interface ExpertBadgeCardProps {
  name: string;
  category: string;
  earnedDate: string;
}

export const ExpertBadgeCard: React.FC<ExpertBadgeCardProps> = ({
  name,
  category,
  earnedDate,
}) => {
  const getBadgeTheme = () => {
    const text = (name + ' ' + category).toLowerCase();
    if (text.includes('education') || text.includes('scholar') || text.includes('alumni')) {
      return {
        icon: <GraduationCap size={22} color="#4F46E5" />,
        color: '#4F46E5',
        bg: '#EEF2FF',
      };
    }
    if (text.includes('skill') || text.includes('advisor') || text.includes('consulting')) {
      return {
        icon: <Zap size={22} color="#D97706" />,
        color: '#D97706',
        bg: '#FEF3C7',
      };
    }
    return {
      icon: <Briefcase size={22} color="#0369A1" />,
      color: '#0369A1',
      bg: '#E0F2FE',
    };
  };

  const theme = getBadgeTheme();

  return (
    <View style={styles.card}>
      <View style={[styles.badgeIconBox, { backgroundColor: theme.bg }]}>
        {theme.icon}
      </View>

      <View style={styles.infoCol}>
        <Text style={styles.badgeName}>{name}</Text>
        <Text style={styles.categoryText}>{category} • {earnedDate}</Text>
      </View>

      <View style={styles.verifiedTag}>
        <Award size={13} color="#059669" />
        <Text style={styles.verifiedText}>VERIFIED</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
});

export default ExpertBadgeCard;
