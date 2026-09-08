import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Briefcase } from 'lucide-react-native';

interface ExpertGateModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: () => void;
}

export const ExpertGateModal: React.FC<ExpertGateModalProps> = ({ visible, onClose, onAction }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          {/* Icon Circle */}
          <View style={styles.modalIconCircle}>
            <Briefcase size={32} color="#0D9488" strokeWidth={2.5} />
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>Activate Expert Mode</Text>

          {/* Description */}
          <Text style={styles.modalDescription}>
            Share your professional advice, set your own hourly rates, and help verify others. Sign in or create an account to unlock all expert features.
          </Text>

          {/* Actions */}
          <TouchableOpacity 
            style={styles.modalPrimaryBtn}
            onPress={onAction}
            activeOpacity={0.85}
          >
            <Text style={styles.modalPrimaryBtnText}>Log In / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.modalSecondaryBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.modalSecondaryBtnText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  modalPrimaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 28,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSecondaryBtn: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ExpertGateModal;
