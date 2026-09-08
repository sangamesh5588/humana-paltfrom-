import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserCheck } from 'lucide-react-native';
import useAuthStore from '../../../../../../core/auth/store';
import Theme from '../../../../../../app/theme';

export const ProfileReviewStep: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const p = user?.profile;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <UserCheck size={28} color={Theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Confirm Your Identity</Text>
          <Text style={styles.subtitle}>
            Your verified badge will be attached to your public profile. Ensure legal details match your credentials.
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>
            {p?.firstName || 'User'} {p?.lastName || ''}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Email</Text>
          <Text style={styles.value}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Headline</Text>
          <Text style={styles.value}>{p?.headline || 'Member'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  },
  infoRow: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
});

export default ProfileReviewStep;
