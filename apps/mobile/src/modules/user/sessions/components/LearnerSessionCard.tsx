import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, Sparkles, ChevronRight, Check } from 'lucide-react-native';
import { ApprovedSession } from '../api/learnerSessions.api';

interface LearnerSessionCardProps {
  session: ApprovedSession;
  onPress: () => void;
  onBookPress: () => void;
}

export const LearnerSessionCard: React.FC<LearnerSessionCardProps> = ({
  session,
  onPress,
  onBookPress,
}) => {
  const navigation = useNavigation<any>();
  const duration = session.durationMinutes || 60;
  const price = session.priceAmount || 1499;

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      {/* 16:9 Full Thumbnail Banner Container */}
      <View style={styles.thumbnailBox}>
        {session.thumbnailUrl ? (
          <Image 
            source={{ uri: session.thumbnailUrl }} 
            style={styles.thumbnailImage} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.thumbnailFallback}>
            <Sparkles size={32} color="#0284C7" />
            <Text style={styles.thumbnailFallbackText}>Human Platform Session</Text>
          </View>
        )}
      </View>

      {/* Card Content Details */}
      <View style={styles.contentBody}>
        {/* Expert Profile Row (Clickable to open Public Expert Profile) */}
        <TouchableOpacity 
          style={styles.expertRow}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate('PublicExpertProfile', { expertId: session.expertId, session });
          }}
        >
          <Image 
            source={{ uri: session.expertAvatar }} 
            style={styles.expertAvatar} 
          />
          <View style={styles.expertInfoCol}>
            <View style={styles.expertNameRow}>
              <Text style={styles.expertName} numberOfLines={1}>{session.expertName}</Text>
              <View style={styles.solidVerifiedCircle}>
                <Check size={10} color="#FFFFFF" strokeWidth={3.5} />
              </View>
            </View>
            <Text style={styles.expertHeadline} numberOfLines={1}>
              {session.expertHeadline} • {session.expertCompany}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Session Title */}
        <Text style={styles.title} numberOfLines={2}>{session.title}</Text>

        {/* Tags & Metadata Row */}
        <View style={styles.tagsRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{session.category || 'Career Strategy'}</Text>
          </View>
          <View style={styles.metaInfoBadge}>
            <Clock size={11} color="#64748B" />
            <Text style={styles.metaInfoText}>{duration} Mins Call</Text>
          </View>
          <Text style={styles.languageText}>🌐 {session.language || 'English'}</Text>
        </View>

        {/* Footer Booking Bar */}
        <View style={styles.footerRow}>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>Session Fee</Text>
            <Text style={styles.priceText}>₹{price}</Text>
          </View>

          <TouchableOpacity 
            style={styles.bookBtn} 
            activeOpacity={0.8}
            onPress={onBookPress}
          >
            <Text style={styles.bookBtnText}>Connect 1:1 Live</Text>
            <ChevronRight size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  thumbnailBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  thumbnailFallbackText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  contentBody: {
    padding: 16,
    gap: 10,
  },
  expertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expertAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expertInfoCol: {
    flex: 1,
  },
  expertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expertName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedGreenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  solidVerifiedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertHeadline: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 21,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  metaInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaInfoText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  languageText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 2,
  },
  priceCol: {
    gap: 1,
  },
  priceLabel: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default LearnerSessionCard;
