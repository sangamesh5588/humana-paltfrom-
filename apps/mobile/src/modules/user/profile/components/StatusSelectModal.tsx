import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

export const STATUS_OPTIONS = [
  { value: 'LKG', label: 'Kindergarten (LKG)' },
  { value: 'UKG', label: 'Kindergarten (UKG)' },
  { value: 'Class 1', label: 'Class 1' },
  { value: 'Class 2', label: 'Class 2' },
  { value: 'Class 3', label: 'Class 3' },
  { value: 'Class 4', label: 'Class 4' },
  { value: 'Class 5', label: 'Class 5' },
  { value: 'Class 6', label: 'Class 6' },
  { value: 'Class 7', label: 'Class 7' },
  { value: 'Class 8', label: 'Class 8' },
  { value: 'Class 9', label: 'Class 9' },
  { value: 'Class 10', label: 'Class 10' },
  { value: 'Class 11', label: 'Class 11' },
  { value: 'Class 12', label: 'Class 12' },
  { value: 'STUDYING', label: 'College / Studying' },
  { value: 'WORKING', label: 'Professional / Working' },
  { value: 'EXPLORING', label: 'Learning / Exploring' },
  { value: 'OTHER', label: 'Other' },
];

interface StatusSelectModalProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatusSelectModal: React.FC<StatusSelectModalProps> = ({
  visible,
  onClose,
  currentStatus,
  onSelectStatus,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Growth Stage Status</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = currentStatus === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.modalItem, isSelected && styles.modalItemAct]}
                  onPress={() => onSelectStatus(option.value)}
                >
                  <Text style={[styles.modalItemText, isSelected && styles.modalItemTextAct]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Check size={16} color="#0D9488" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalCloseText: {
    fontSize: 14,
    color: '#0D9488',
    fontWeight: 'bold',
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  modalItemAct: {
    backgroundColor: '#F0FDFA',
  },
  modalItemText: {
    fontSize: 15,
    color: '#334155',
  },
  modalItemTextAct: {
    color: '#0D9488',
    fontWeight: 'bold',
  },
});

export default StatusSelectModal;
