import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Video, Image as ImageIcon, Camera, CheckCircle2, Trash2 } from 'lucide-react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ExpertApi } from '../../../../shared/api/expert.api';

interface IntroVideoStepProps {
  videoFile: string | null;
  onUploadVideo: (file: string | null) => void;
  thumbnailFile: string | null;
  onUploadThumbnail: (file: string | null) => void;
}

export const IntroVideoStep: React.FC<IntroVideoStepProps> = ({
  videoFile,
  onUploadVideo,
  thumbnailFile,
  onUploadThumbnail,
}) => {
  const [thumbLoading, setThumbLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const handlePickThumbnailFromGallery = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 1280,
        height: 720,
      });

      if (image && image.path) {
        setThumbLoading(true);
        const fileName = `thumb_${Date.now()}.webp`;
        const res = await ExpertApi.uploadDocument(image.path, fileName, image.mime);
        const uploadedUrl = res?.url || res?.fileUrl;
        if (uploadedUrl && (uploadedUrl.startsWith('http://') || uploadedUrl.startsWith('https://'))) {
          onUploadThumbnail(uploadedUrl);
        } else {
          Alert.alert('Upload Error', 'Failed to generate public Supabase thumbnail URL.');
        }
      }
    } catch (e: any) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Upload Error', e?.message || 'Failed to pick thumbnail image.');
      }
    } finally {
      setThumbLoading(false);
    }
  };

  const handleCaptureThumbnailFromCamera = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        useFrontCamera: false,
        mediaType: 'photo',
        cropping: true,
        width: 1280,
        height: 720,
      });

      if (image && image.path) {
        setThumbLoading(true);
        const fileName = `thumb_${Date.now()}.webp`;
        const res = await ExpertApi.uploadDocument(image.path, fileName, image.mime);
        const uploadedUrl = res?.url || res?.fileUrl;
        if (uploadedUrl && (uploadedUrl.startsWith('http://') || uploadedUrl.startsWith('https://'))) {
          onUploadThumbnail(uploadedUrl);
        } else {
          Alert.alert('Upload Error', 'Failed to generate public Supabase thumbnail URL.');
        }
      }
    } catch (e: any) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Camera Error', e?.message || 'Failed to capture photo from back camera.');
      }
    } finally {
      setThumbLoading(false);
    }
  };

  const handlePickVideoFromGallery = async () => {
    try {
      const video = await ImageCropPicker.openPicker({
        mediaType: 'video',
      });

      if (video && video.path) {
        setVideoLoading(true);
        const fileName = `video_${Date.now()}.mp4`;
        const res = await ExpertApi.uploadDocument(video.path, fileName, video.mime || 'video/mp4');
        const uploadedUrl = res?.url || res?.fileUrl;
        if (uploadedUrl && (uploadedUrl.startsWith('http://') || uploadedUrl.startsWith('https://'))) {
          onUploadVideo(uploadedUrl);
        } else {
          Alert.alert('Upload Error', 'Failed to generate public Supabase video URL. Please try again.');
        }
      }
    } catch (e: any) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Upload Error', e?.message || 'Failed to upload video to Supabase Storage.');
      }
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Media Upload</Text>
      <Text style={styles.formSub}>Upload your mandatory Session Thumbnail and an optional 30-sec Video pitch.</Text>

      {/* 1. Thumbnail Upload Card (MANDATORY) */}
      <View style={[styles.sectionBox, !thumbnailFile && styles.mandatoryBorder]}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.badgeMandatory}>
            <Text style={styles.badgeMandatoryText}>MANDATORY</Text>
          </View>
          <Text style={styles.sectionTitle}>Session Thumbnail Image</Text>
        </View>

        {thumbnailFile ? (
          <View style={styles.previewRow}>
            <Image source={{ uri: thumbnailFile }} style={styles.thumbImage} />
            <View style={styles.previewInfo}>
              <View style={styles.uploadedTag}>
                <CheckCircle2 size={14} color="#059669" />
                <Text style={styles.uploadedTagText}>WebP Compressed</Text>
              </View>
              <Text style={styles.fileNameText} numberOfLines={1}>thumbnail.webp</Text>
            </View>
            <TouchableOpacity onPress={() => onUploadThumbnail(null)}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionSub}>Pick a 16:9 banner image for your session card.</Text>
            {thumbLoading ? (
              <ActivityIndicator size="small" color="#0284C7" style={{ marginVertical: 12 }} />
            ) : (
              <View style={styles.actionBtnRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={handlePickThumbnailFromGallery}>
                  <ImageIcon size={16} color="#0284C7" />
                  <Text style={styles.actionBtnText}>Photo Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={handleCaptureThumbnailFromCamera}>
                  <Camera size={16} color="#0284C7" />
                  <Text style={styles.actionBtnText}>Back Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* 2. Video Upload Card (OPTIONAL) */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.badgeOptional}>
            <Text style={styles.badgeOptionalText}>OPTIONAL</Text>
          </View>
          <Text style={styles.sectionTitle}>Introduction Pitch Video</Text>
        </View>

        {videoFile ? (
          <View style={styles.previewRow}>
            <Video size={24} color="#0284C7" />
            <View style={styles.previewInfo}>
              <View style={styles.uploadedTag}>
                <CheckCircle2 size={14} color="#059669" />
                <Text style={styles.uploadedTagText}>MP4 Uploaded</Text>
              </View>
              <Text style={styles.fileNameText} numberOfLines={1}>intro_pitch.mp4</Text>
            </View>
            <TouchableOpacity onPress={() => onUploadVideo(null)}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionSub}>Record or upload a 30-sec pitch to increase learner bookings.</Text>
            {videoLoading ? (
              <ActivityIndicator size="small" color="#0284C7" style={{ marginVertical: 12 }} />
            ) : (
              <TouchableOpacity style={styles.actionBtnSingle} onPress={handlePickVideoFromGallery}>
                <Video size={16} color="#0284C7" />
                <Text style={styles.actionBtnText}>Choose MP4 Video File</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  formSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  mandatoryBorder: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  badgeMandatory: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeMandatoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  badgeOptional: {
    backgroundColor: '#94A3B8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOptionalText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 12,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  actionBtnSingle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  thumbImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
  },
  previewInfo: {
    flex: 1,
    gap: 2,
  },
  uploadedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadedTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  fileNameText: {
    fontSize: 11.5,
    color: '#64748B',
  },
});

export default IntroVideoStep;
