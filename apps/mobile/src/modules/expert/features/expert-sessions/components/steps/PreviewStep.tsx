import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ImageIcon, Clock } from 'lucide-react-native';

interface PreviewStepProps {
  thumbnailFile: string | null;
  category: string;
  title: string;
  description: string;
  duration: number;
  price: string;
  topics: string[];
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  thumbnailFile,
  category,
  title,
  description,
  duration,
  price,
  topics,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Preview Session Info</Text>
      <Text style={styles.formSub}>This is exactly what users will see on your profile.</Text>

      <View style={styles.previewBox}>
        {thumbnailFile ? (
          <View style={styles.previewThumbnailPlaceholder}>
            <Text style={styles.previewThumbnailText}>Thumbnail Uploaded</Text>
          </View>
        ) : (
          <View style={[styles.previewThumbnailPlaceholder, { backgroundColor: '#E2E8F0' }]}>
            <ImageIcon size={24} color="#94A3B8" />
            <Text style={{ color: '#94A3B8', marginTop: 4 }}>No Thumbnail</Text>
          </View>
        )}

        <View style={styles.previewDetails}>
          <Text style={styles.previewCategory}>{category}</Text>
          <Text style={styles.previewTitle}>{title || 'Untitled Session'}</Text>
          <Text style={styles.previewDesc}>{description || 'No description provided.'}</Text>

          <View style={styles.previewMeta}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.previewMetaText}>{duration} mins</Text>
            <View style={styles.dividerDot} />
            <Text style={styles.previewPrice}>₹{price}</Text>
          </View>

          <Text style={styles.previewSubheading}>Topics we will cover:</Text>
          {topics.map((t, idx) => (
            <Text key={idx} style={styles.previewBullet}>
              • {t}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  formSub: {
    fontSize: 13,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 16,
    lineHeight: 18,
  },
  previewBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewThumbnailPlaceholder: {
    height: 140,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewThumbnailText: {
    color: '#475569',
    fontWeight: '700',
  },
  previewDetails: {
    padding: 16,
    alignItems: 'flex-start',
  },
  previewCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369A1',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  previewDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    marginBottom: 14,
  },
  previewMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
  previewPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  previewSubheading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  previewBullet: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 3,
  },
});

export default PreviewStep;
