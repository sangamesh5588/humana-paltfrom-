import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { UploadCloud, FileText, CheckCircle2, Trash2, Camera, Image as ImageIcon } from 'lucide-react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Theme from '../../../../../../app/theme';
import useJourneyStore from '../../store/journeyStore';
import { ExpertApi } from '../../../../shared/api/expert.api';

interface DocumentUploadStepProps {
  config?: Record<string, any>;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ config: _config }) => {
  const { documents, addDocument, removeDocument } = useJourneyStore();

  const formatFileSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return '148 KB (WebP)';
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB (WebP)`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB (WebP)`;
  };

  const processAndAddImage = async (image: any) => {
    if (image && image.path) {
      const fileName = image.path.split('/').pop() || 'verification_document.jpg';
      const rawSize = image.size;
      const localPath = image.path;

      // Upload to server bucket storage
      const uploaded = await ExpertApi.uploadDocument(image.path, fileName, image.mime);
      const fileUrl = uploaded?.url || uploaded?.fileUrl || image.path;

      addDocument({
        id: `doc-${Date.now()}`,
        name: fileName,
        url: fileUrl,
        fileUrl,
        localUri: localPath,
        sizeBytes: rawSize,
        mime: image.mime || 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      });
    }
  };

  const handlePickDocument = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.85,
        compressImageMaxWidth: 1400,
        compressImageMaxHeight: 1400,
      });

      await processAndAddImage(image);
    } catch (e: any) {
      if (e?.code === 'E_PICKER_CANCELLED') return;
      console.warn('Document picker error:', e?.message || e);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        mediaType: 'photo',
        useFrontCamera: false, // Forces Back Camera
        compressImageQuality: 0.85,
        compressImageMaxWidth: 1400,
        compressImageMaxHeight: 1400,
      });

      await processAndAddImage(image);
    } catch (e: any) {
      if (e?.code === 'E_PICKER_CANCELLED') return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UploadCloud size={28} color={Theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Upload Proof Document</Text>
          <Text style={styles.subtitle}>
            Take a clear photo using your camera or select a PDF/image of your Offer Letter, Employee ID, or Certificate.
          </Text>
        </View>
      </View>

      {/* Dual Upload Options */}
      <View style={styles.optionsRow}>
        <TouchableOpacity style={styles.uploadCardOption} onPress={handleCameraCapture} activeOpacity={0.8}>
          <View style={[styles.uploadIconCircle, { backgroundColor: '#F0FDF4' }]}>
            <Camera size={24} color="#16A34A" />
          </View>
          <Text style={styles.uploadTitle}>Back Camera</Text>
          <Text style={styles.uploadHint}>Take Document Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCardOption} onPress={handlePickDocument} activeOpacity={0.8}>
          <View style={styles.uploadIconCircle}>
            <ImageIcon size={24} color={Theme.colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Photo Gallery</Text>
          <Text style={styles.uploadHint}>Select Document File</Text>
        </TouchableOpacity>
      </View>

      {/* Uploaded List */}
      {documents.length > 0 && (
        <View style={styles.docList}>
          <Text style={styles.listHeader}>Uploaded Documents ({documents.length})</Text>
          {documents.map((doc, idx) => {
            const imageUri = doc.localUri || doc.url || doc.fileUrl;
            const isImage = imageUri && (imageUri.startsWith('file:') || imageUri.startsWith('http') || imageUri.includes('.webp') || imageUri.includes('.jpg') || imageUri.includes('.png'));

            return (
              <View key={doc.id || idx} style={styles.docCard}>
                {/* Image Preview Thumbnail */}
                {isImage ? (
                  <Image source={{ uri: imageUri }} style={styles.thumbnailPreview} resizeMode="cover" />
                ) : (
                  <View style={styles.pdfIconContainer}>
                    <FileText size={22} color={Theme.colors.primary} />
                  </View>
                )}

                <View style={styles.docInfo}>
                  <Text style={styles.docName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.docSize}>{formatFileSize(doc.sizeBytes)}</Text>
                    <Text style={styles.docStatus}>Ready for review</Text>
                  </View>
                </View>

                <CheckCircle2 size={18} color="#10B981" />
                <TouchableOpacity style={styles.deleteBtn} onPress={() => removeDocument(idx)}>
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  uploadCardOption: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: '#94A3B8',
  },
  docList: {
    marginTop: 20,
    gap: 10,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  thumbnailPreview: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  pdfIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docSize: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  docStatus: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
});

export default DocumentUploadStep;
