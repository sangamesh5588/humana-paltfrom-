import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '../../../../app/theme';
import { ExperienceItem } from '../hooks/useOnboardingState';

interface ExperienceBadgeProps {
  experienceList: ExperienceItem[];
}

export const ExperienceBadge: React.FC<ExperienceBadgeProps> = ({ experienceList }) => {
  if (experienceList.length === 0) return null;

  let totalMonths = 0;

  experienceList.forEach((exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
    
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    
    const duration = yearDiff * 12 + monthDiff + 1; // inclusive of start month
    if (duration > 0) {
      totalMonths += duration;
    }
  });

  if (totalMonths <= 0) return null;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let badgeText = '';
  if (years > 0) {
    badgeText += `${years} yr${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    if (badgeText) badgeText += ' ';
    badgeText += `${months} mo${months > 1 ? 's' : ''}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.badgeLabel}>Total Experience</Text>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>💼 {badgeText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  badgeLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeContainer: {
    backgroundColor: '#0F766E', // brand accent color
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ExperienceBadge;
