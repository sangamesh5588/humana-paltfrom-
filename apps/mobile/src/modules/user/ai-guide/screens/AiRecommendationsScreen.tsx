import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react-native';
import { AiGuideApi, RecommendedExpert, AiSession } from '../api/aiGuide.api';
import ExpertRecommendationCard from '../components/ExpertRecommendationCard';
import Theme from '../../../../app/theme';

export const AiRecommendationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sessionId } = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<AiSession | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedExpert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch session details & matched experts in parallel
        const [sessionData, matches] = await Promise.all([
          AiGuideApi.getSession(sessionId),
          AiGuideApi.getRecommendations(sessionId),
        ]);

        setSession(sessionData);
        setRecommendations(matches);
      } catch (err) {
        console.error('Failed to load recommendations page:', err);
        setError('Unable to load connection recommendations.');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  const handleBookPress = (expert: RecommendedExpert) => {
    if (expert.session) {
      // Direct navigation to scheduling/booking screen in mobile app
      navigation.navigate('LearnerSessionBooking', { session: expert.session });
    }
  };

  const renderHeader = () => {
    if (!session) return null;
    const filters = session.structuredData || {};

    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryTitleRow}>
          <Sparkles size={16} color={Theme.colors.primary || '#0284C7'} />
          <Text style={styles.summaryTitle}>Your Matching Criteria</Text>
        </View>

        <View style={styles.tagsContainer}>
          {session.goal && (
            <View style={styles.tag}>
              <Text style={styles.tagLabel}>Goal: </Text>
              <Text style={styles.tagValue}>{session.goal}</Text>
            </View>
          )}
          {filters.stage && (
            <View style={styles.tag}>
              <Text style={styles.tagLabel}>Stage: </Text>
              <Text style={styles.tagValue}>{filters.stage}</Text>
            </View>
          )}
          {filters.industry && (
            <View style={styles.tag}>
              <Text style={styles.tagLabel}>Industry: </Text>
              <Text style={styles.tagValue}>{filters.industry}</Text>
            </View>
          )}
          {filters.region && (
            <View style={styles.tag}>
              <Text style={styles.tagLabel}>Market: </Text>
              <Text style={styles.tagValue}>{filters.region}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Recommended Connections</Text>
          <Text style={styles.headerSubtitle}>Verified matches with shared roots</Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Theme.colors.primary || '#0284C7'} />
          <Text style={styles.loadingText}>Scoring & matching roots...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerLoading}>
          <AlertCircle size={40} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Back to Guide</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <ExpertRecommendationCard 
              expert={item} 
              onBookPress={handleBookPress}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AlertCircle size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Perfect Matches Found</Text>
              <Text style={styles.emptyText}>
                No verified experts currently overlap with your specific combination of roots and goals. Try refining your goal in the chat.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    height: 56,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  headerRightPlaceholder: {
    width: 30,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  retryText: {
    fontSize: 13.5,
    color: '#475569',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#475569',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tagValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AiRecommendationsScreen;
