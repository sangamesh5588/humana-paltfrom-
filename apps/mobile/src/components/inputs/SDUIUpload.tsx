import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../../app/theme';

interface SDUIUploadProps {
  label: string;
  value: string; // contains mock file details
  onChange: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export const SDUIUpload: React.FC<SDUIUploadProps> = ({
  label,
  value,
  onChange,
  error,
  isRequired,
}) => {
  const handleSimulateUpload = () => {
    // Mock file upload completion
    const mockFile = `document_upload_${Date.now().toString().slice(-4)}.pdf`;
    onChange(mockFile);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity style={styles.uploadArea} onPress={handleSimulateUpload}>
        <Text style={styles.uploadTitle}>
          {value ? '✅ File Loaded' : '📤 Upload Document'}
        </Text>
        <Text style={styles.uploadSubtitle}>
          {value ? value : 'Tap to upload PDF, Word or Image file.'}
        </Text>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
    width: '100%',
  },
  label: {
    color: Theme.colors.textMain,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },
  required: {
    color: Theme.colors.error,
  },
  uploadArea: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadSubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 12,
    marginTop: Theme.spacing.xs,
  },
});

export default SDUIUpload;
