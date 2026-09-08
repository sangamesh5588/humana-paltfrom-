import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sparkles, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react-native';
import Theme from '../../../../../app/theme';
import useExpertStore from '../../../shared/store/expertStore';
import VerificationTypeCard from '../../catalog/components/VerificationTypeCard';

import { ExpertApi } from '../../../shared/api/expert.api';

export const ExpertHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { overview, isLoading, fetchHomeOverview } = useExpertStore();

  useEffect(() => {
    fetchHomeOverview();
  }, []);

  const handleSelectCard = async (typeItem: any) => {
    try {
      const statusRes = await ExpertApi.getStatus();
      if (statusRes && (statusRes.status === 'PENDING_REVIEW' || statusRes.status === 'PENDING_VERIFICATION')) {
        navigation.navigate('ExpertPending');
        return;
      }
      if (statusRes && (statusRes.status === 'APPROVED' || statusRes.status === 'VERIFIED')) {
        navigation.navigate('ExpertApproved');
        return;
      }
    } catch {
      // Fallback
    }
    navigation.navigate('ExpertJourney', { typeSlug: typeItem.slug });
  };

  const handleStartFlow = () => {
    if (overview?.status === 'APPROVED') {
      navigation.navigate('ExpertApproved');
    } else if (overview?.status === 'PENDING_REVIEW') {
      navigation.navigate('ExpertPending');
    } else {
      navigation.navigate('ExpertStory');
    }
  };

  if (isLoading && !overview) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const status = overview?.status || 'UNVERIFIED';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Sparkles size={14} color="#FFFFFF" />
            <Text style={styles.heroBadgeText}>Expert Platform</Text>
          </View>
          <Text style={styles.heroTitle}>Become a Verified Expert</Text>
          <Text style={styles.heroSubtitle}>
            Guide peers, host 1:1 career & interview sessions, and earn income with full platform credibility.
          </Text>

          <TouchableOpacity style={styles.heroCta} onPress={handleStartFlow}>
            <Text style={styles.heroCtaText}>
              {status === 'APPROVED'
                ? 'View Approved Badge'
                : status === 'PENDING_REVIEW'
                ? 'Check Application Status'
                : 'Start Verification'}
            </Text>
            <ArrowRight size={18} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Verification Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <ShieldCheck size={16} color={status === 'APPROVED' ? '#10B981' : '#F59E0B'} />
              <Text style={styles.statusText}>{status.replace('_', ' ')}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ExpertCatalog')}>
              <Text style={styles.viewCatalogText}>View Catalog</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Verification Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verification Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ExpertCatalog')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {overview?.availableVerificationTypes.map((item) => (
            <VerificationTypeCard
              key={item.id}
              item={item}
              onSelect={handleSelectCard}
            />
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqCard}>
          <View style={styles.faqHeader}>
            <HelpCircle size={20} color={Theme.colors.primary} />
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          </View>
          <Text style={styles.faqQuestion}>Q: How long does verification take?</Text>
          <Text style={styles.faqAnswer}>A: Most applications are reviewed by our team within 24 hours.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroBanner: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 24,
    padding: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroCta: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroCtaText: {
    color: Theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  viewCatalogText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  faqTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default ExpertHomeScreen;
