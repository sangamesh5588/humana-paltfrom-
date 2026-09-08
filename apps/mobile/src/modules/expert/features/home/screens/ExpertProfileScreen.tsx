import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ShieldCheck, Calendar } from 'lucide-react-native';
import Theme from '../../../../../app/theme';

export const ExpertProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Expert Profile Header */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>EX</Text>
            </View>
            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Verified Expert Profile</Text>
                <ShieldCheck size={18} color="#10B981" />
              </View>
              <Text style={styles.headline}>Senior Corporate Leader & Advisor</Text>
            </View>
          </View>

          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🎓 Verified Corporate Experience</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Expert</Text>
          <Text style={styles.bodyText}>
            Available for 1:1 career guidance, mock interviews, and resume reviews. Verified by platform trust & safety audit.
          </Text>
        </View>

        {/* Book Session CTA */}
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={() => Alert.alert('Book Session', '1:1 Advisory session booking flow coming in Phase 2!')}
        >
          <Calendar size={18} color="#FFFFFF" />
          <Text style={styles.ctaText}>Book 1:1 Advisory Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headline: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ExpertProfileScreen;
