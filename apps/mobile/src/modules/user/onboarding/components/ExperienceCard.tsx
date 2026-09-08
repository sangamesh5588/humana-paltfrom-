import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../../../app/theme';
import { ExperienceItem } from '../hooks/useOnboardingState';

interface ExperienceCardProps {
  item: ExperienceItem;
  onDelete: () => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ item, onDelete }) => {
  const start = new Date(item.startDate);
  const end = item.current ? new Date() : item.endDate ? new Date(item.endDate) : new Date();

  const startFormatted = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endFormatted = item.current ? 'Present' : end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const status = item.verificationStatus || (item.verified ? 'VERIFIED' : 'UNVERIFIED');
  const isVerified = item.verified || status === 'VERIFIED';
  const isPending = status === 'PENDING';

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{item.title}</Text>
          {isVerified ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>Verified 🛡️</Text>
            </View>
          ) : isPending ? (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending ⏳</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.companyText}>{item.company}</Text>
        <Text style={styles.dateText}>
          {startFormatted} - {endFormatted} {item.current && '💼'}
        </Text>
        {item.officialEmail ? (
          <Text style={styles.emailText}>✉️ {item.officialEmail}</Text>
        ) : null}
        {item.documentUrl ? (
          <Text style={styles.docText}>📄 Proof Document Uploaded</Text>
        ) : null}
        {item.description ? (
          <Text style={styles.descText} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: 2,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  companyText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 2,
  },
  docText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  deleteText: {
    color: Theme.colors.error,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ExperienceCard;
