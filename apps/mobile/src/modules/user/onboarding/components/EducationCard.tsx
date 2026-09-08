import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../../../app/theme';
import { EducationItem } from '../hooks/useOnboardingState';

import { Edit3, Trash2 } from 'lucide-react-native';

interface EducationCardProps {
  item: EducationItem;
  onDelete: () => void;
  onEdit?: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({ item, onDelete, onEdit }) => {
  const startYear = item.startDate ? new Date(item.startDate).getFullYear() : '';
  const endYear = item.current ? 'Present' : item.endDate ? new Date(item.endDate).getFullYear() : 'N/A';

  const status = (item as any).verificationStatus || (item.verified ? 'VERIFIED' : 'UNVERIFIED');
  const isVerified = item.verified || status === 'VERIFIED';
  const isPending = status === 'PENDING';
  const officialEmail = (item as any).officialEmail;
  const documentUrl = (item as any).documentUrl;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.schoolName}>{item.school}</Text>
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
        <Text style={styles.degreeText}>
          {item.degree} • {item.fieldOfStudy}
        </Text>
        <Text style={styles.dateText}>
          {startYear} - {endYear} {item.current && '🎓'}
        </Text>
        {officialEmail ? (
          <Text style={styles.emailText}>✉️ {officialEmail}</Text>
        ) : null}
        {documentUrl ? (
          <Text style={styles.docText}>📄 Proof Document Uploaded</Text>
        ) : null}
      </View>

      <View style={styles.actionBtnRow}>
        {onEdit ? (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Edit3 size={14} color="#0369A1" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={14} color="#DC2626" />
        </TouchableOpacity>
      </View>
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
  schoolName: {
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
  degreeText: {
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
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
});

export default EducationCard;
