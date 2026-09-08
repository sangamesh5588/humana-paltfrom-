import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { RecommendedExpert } from '../api/aiGuide.api';
import { CheckCircle2, MapPin, GraduationCap, Briefcase, Languages, Calendar } from 'lucide-react-native';
import Theme from '../../../../app/theme';

interface ExpertRecommendationCardProps {
  expert: RecommendedExpert;
  onBookPress: (expert: RecommendedExpert) => void;
}

export const ExpertRecommendationCard: React.FC<ExpertRecommendationCardProps> = ({
  expert,
  onBookPress,
}) => {
  const avatarUrl = expert.avatar;
  const initials = expert.firstName.charAt(0).toUpperCase();

  return (
    <View style={styles.card}>
      {/* Top Header: Profile Info */}
      <View style={styles.header}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{expert.firstName} {expert.lastName}</Text>
            <CheckCircle2 size={16} color="#059669" />
          </View>
          <Text style={styles.headline} numberOfLines={2}>{expert.headline}</Text>
        </View>
      </View>

      {/* Shared Roots & Background Badges */}
      {expert.matchedAspects && expert.matchedAspects.length > 0 && (
        <View style={styles.badgeRow}>
          {expert.matchedAspects.map((aspect, idx) => {
            let Icon = MapPin;
            let bg = '#F0FDF4';
            let color = '#15803D';
            
            if (aspect.includes('School')) {
              Icon = GraduationCap;
              bg = '#EFF6FF';
              color = '#1D4ED8';
            } else if (aspect.includes('Employer')) {
              Icon = Briefcase;
              bg = '#FAF5FF';
              color = '#7E22CE';
            } else if (aspect.includes('Language')) {
              Icon = Languages;
              bg = '#FFF7ED';
              color = '#C2410C';
            }

            return (
              <View key={idx} style={[styles.badge, { backgroundColor: bg }]}>
                <Icon size={12} color={color} style={styles.badgeIcon} />
                <Text style={[styles.badgeText, { color }]}>{aspect}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Custom LLM Match Reason */}
      <View style={styles.reasonContainer}>
        <Text style={styles.reasonTitle}>Why you should connect:</Text>
        <Text style={styles.reasonText}>{expert.matchReason}</Text>
      </View>

      {/* Direct Booking CTA */}
      {expert.session ? (
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => onBookPress(expert)}
          activeOpacity={0.85}
        >
          <Calendar size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.bookButtonText}>Book 1:1 Live Call (₹{expert.session.priceAmount})</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.noSessionBadge}>
          <Text style={styles.noSessionText}>No slots available currently</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.accent || '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headline: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  reasonContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reasonTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  bookButton: {
    backgroundColor: Theme.colors.primary || '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  noSessionBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  noSessionText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default ExpertRecommendationCard;
