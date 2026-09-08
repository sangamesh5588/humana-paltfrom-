import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck, Plus } from 'lucide-react-native';
import ExpertBadgeCard from './ExpertBadgeCard';

interface VerifiedCredentialsListProps {
  badges: Array<{ id: string; name: string; description?: string }>;
  onAddCredentialPress: () => void;
}

export const VerifiedCredentialsList: React.FC<VerifiedCredentialsListProps> = ({
  badges,
  onAddCredentialPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <ShieldCheck size={18} color="#059669" />
          <Text style={styles.sectionTitle}>Verified Credentials ({badges.length})</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddCredentialPress} activeOpacity={0.8}>
          <Plus size={14} color="#0369A1" />
          <Text style={styles.addBtnText}>Add More</Text>
        </TouchableOpacity>
      </View>

      {badges.length > 0 ? (
        <View style={styles.listCol}>
          {badges.map((badge) => (
            <ExpertBadgeCard
              key={badge.id}
              name={badge.name}
              category={badge.description || 'Verified Credential'}
              earnedDate="Verified"
            />
          ))}
        </View>
      ) : (
        <TouchableOpacity style={styles.emptyCard} onPress={onAddCredentialPress} activeOpacity={0.88}>
          <View style={styles.emptyIconCircle}>
            <Plus size={20} color="#0369A1" />
          </View>
          <Text style={styles.emptyTitle}>No Active Badges Yet</Text>
          <Text style={styles.emptySub}>
            Submit your corporate work or university verification to display your verified badge.
          </Text>
        </TouchableOpacity>
      )}
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
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  listCol: {
    gap: 10,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
    gap: 6,
  },
  emptyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default VerifiedCredentialsList;
