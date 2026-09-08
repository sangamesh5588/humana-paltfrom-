import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Check, DollarSign, Briefcase, FileText } from 'lucide-react-native';

interface EditExpertProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentRate: number;
  currentTitle: string;
  currentBio: string;
  onSave: (rate: number, title: string, bio: string) => Promise<void>;
}

export const EditExpertProfileModal: React.FC<EditExpertProfileModalProps> = ({
  visible,
  onClose,
  currentRate,
  currentTitle,
  currentBio,
  onSave,
}) => {
  const [rateStr, setRateStr] = useState(currentRate > 0 ? currentRate.toString() : '');
  const [title, setTitle] = useState(currentTitle);
  const [bio, setBio] = useState(currentBio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setRateStr(currentRate > 0 ? currentRate.toString() : '');
      setTitle(currentTitle);
      setBio(currentBio);
    }
  }, [visible, currentRate, currentTitle, currentBio]);

  const handleSave = async () => {
    const parsedRate = parseFloat(rateStr) || 0;
    setSaving(true);
    try {
      await onSave(parsedRate, title, bio);
      onClose();
    } catch {
      // Graceful fallback
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Expert Credentials & Rate</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Input 1: Hourly Rate */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <DollarSign size={16} color="#059669" />
                <Text style={styles.label}>Hourly Consultation Rate ($/hr)</Text>
              </View>
              <TextInput
                style={styles.input}
                value={rateStr}
                onChangeText={setRateStr}
                placeholder="e.g. 150"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>

            {/* Input 2: Professional Headline */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Briefcase size={16} color="#0369A1" />
                <Text style={styles.label}>Professional Title / Headline</Text>
              </View>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Lead AI Systems Architect"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Input 3: Advisory Bio */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <FileText size={16} color="#4F46E5" />
                <Text style={styles.label}>Advisory Bio & Expertise Summary</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Describe your expertise, guidance topics, and experience..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 90,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#0369A1',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default EditExpertProfileModal;
