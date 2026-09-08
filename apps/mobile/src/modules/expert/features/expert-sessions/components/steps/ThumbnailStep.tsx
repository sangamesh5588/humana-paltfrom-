import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

interface ThumbnailStepProps {
  thumbnailFile: string | null;
  onUploadThumbnail: (file: string) => void;
}

export const ThumbnailStep: React.FC<ThumbnailStepProps> = ({
  thumbnailFile,
  onUploadThumbnail,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Thumbnail Image</Text>
      <Text style={styles.formSub}>Upload a preview image or banner for your session card.</Text>

      <View style={styles.mediaUploadBox}>
        <ImageIcon size={36} color="#64748B" />
        <Text style={styles.mediaUploadTitle}>Generate or Upload Thumbnail</Text>
        <Text style={styles.mediaUploadSub}>JPG, PNG format, 16:9 ratio</Text>

        <TouchableOpacity
          style={styles.mediaUploadBtn}
          onPress={() => {
            onUploadThumbnail('mock_thumbnail.png');
            Alert.alert('Success', 'Thumbnail uploaded successfully (Mock).');
          }}
        >
          <Text style={styles.mediaUploadBtnText}>{thumbnailFile ? 'Change Image' : 'Choose File'}</Text>
        </TouchableOpacity>
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
  mediaUploadBox: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  mediaUploadTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  mediaUploadSub: {
    fontSize: 12,
    color: '#64748B',
  },
  mediaUploadBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 4,
  },
  mediaUploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
});

export default ThumbnailStep;
