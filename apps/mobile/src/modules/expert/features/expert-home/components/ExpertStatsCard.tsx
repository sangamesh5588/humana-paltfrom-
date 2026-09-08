import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign, CheckCircle2, ThumbsUp } from 'lucide-react-native';

interface ExpertStatsCardProps {
  earnings: number;
  completedSessions: number;
  rating: number;
}

export const ExpertStatsCard: React.FC<ExpertStatsCardProps> = ({
  earnings,
  completedSessions,
  rating,
}) => {
  // Compute appreciations percentage or score (e.g. 98%)
  const appreciationScore = rating ? Math.min(100, Math.round(rating * 20)) : 98;

  return (
    <View style={styles.gridContainer}>
      {/* Stat 1: Total Revenue - DollarSign (Solid Emerald) */}
      <View style={[styles.card, styles.fullWidthCard]}>
        <View style={[styles.iconWrapper, { backgroundColor: '#10B981' }]}>
          <DollarSign size={20} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.label}>Total Earned</Text>
        <Text style={styles.value}>${earnings.toLocaleString()}</Text>
      </View>

      {/* Stat 2: Sessions Completed - CheckCircle2 (Solid Royal Blue) */}
      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: '#2563EB' }]}>
          <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.label}>Sessions Done</Text>
        <Text style={styles.value}>{completedSessions}</Text>
      </View>

      {/* Stat 3: Appreciations - ThumbsUp (Appreciation Hand, Solid Rose Pink) */}
      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: '#EC4899' }]}>
          <ThumbsUp size={20} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.label}>Appreciations</Text>
        <Text style={styles.value}>{appreciationScore}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  fullWidthCard: {
    minWidth: '100%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
});

export default ExpertStatsCard;
