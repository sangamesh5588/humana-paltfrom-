import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { BANNER_PRESETS } from './ThemeTabContent';

interface ThemePresetsModalProps {
  visible: boolean;
  onClose: () => void;
  bannerColor: string;
  bannerTextColor: string;
  onSelectPreset: (color: string, textColor: string) => void;
}

export const ThemePresetsModal: React.FC<ThemePresetsModalProps> = ({
  visible,
  onClose,
  bannerColor,
  bannerTextColor,
  onSelectPreset,
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
            <Text style={styles.modalTitle}>Select Profile Color Theme</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalColorGrid}>
              {BANNER_PRESETS.map((preset) => {
                const isSelected = 
                  bannerColor === preset.color && 
                  bannerTextColor === preset.textColor;
                
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.modalPaletteCircle, 
                      { backgroundColor: preset.color },
                      isSelected && styles.modalPaletteCircleSelected
                    ]}
                    onPress={() => onSelectPreset(preset.color, preset.textColor)}
                  >
                    {isSelected && (
                      <Check 
                        size={18} 
                        color={preset.textColor} 
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
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
  modalColorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalPaletteCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  modalPaletteCircleSelected: {
    borderWidth: 3,
    borderColor: '#0D9488',
    transform: [{ scale: 1.05 }],
  },
});

export default ThemePresetsModal;
