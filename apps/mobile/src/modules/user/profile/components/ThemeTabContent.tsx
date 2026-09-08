import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Plus, ChevronDown } from 'lucide-react-native';
import Theme from '../../../../app/theme';

export const BANNER_PRESETS = [
  { id: 'white', color: '#FFFFFF', textColor: '#111827', name: 'White' },
  { id: 'warm_beige', color: '#F5F5F4', textColor: '#44403C', name: 'Warm Beige' },
  { id: 'lavender_gray', color: '#7E8F9B', textColor: '#FFFFFF', name: 'Lavender Gray' },
  { id: 'slate_gray', color: '#475569', textColor: '#FFFFFF', name: 'Slate Gray' },
  { id: 'matte_black', color: '#1E1E1E', textColor: '#FFFFFF', name: 'Matte Black' },
  { id: 'primary_dark', color: '#111827', textColor: '#FFFFFF', name: 'Charcoal (Primary)' },
  { id: 'navy_blue', color: '#172554', textColor: '#FFFFFF', name: 'Midnight Navy' },
  { id: 'steel_blue', color: '#0369A1', textColor: '#FFFFFF', name: 'Steel Blue' },
  { id: 'brand_accent', color: '#0F766E', textColor: '#FFFFFF', name: 'Deep Teal (Accent)' },
  { id: 'forest_green', color: '#064E3B', textColor: '#FFFFFF', name: 'Forest Green' },
  { id: 'olive_green', color: '#606C38', textColor: '#FFFFFF', name: 'Olive Green' },
  { id: 'premium_gold', color: '#C5A059', textColor: '#FFFFFF', name: 'Premium Gold' },
  { id: 'terracotta', color: '#B45309', textColor: '#FFFFFF', name: 'Terracotta' },
  { id: 'crimson_red', color: '#BE123C', textColor: '#FFFFFF', name: 'Crimson Red' },
  { id: 'plum_purple', color: '#701A75', textColor: '#FFFFFF', name: 'Plum Purple' },
  { id: 'deep_rose', color: '#9F1239', textColor: '#FFFFFF', name: 'Deep Rose' },
];

interface ThemeTabContentProps {
  bannerColor: string;
  bannerTextColor: string;
  onSelectPreset: (color: string, textColor: string) => void;
  selectedStatusLabel: string;
  onOpenStatusModal: () => void;
  onOpenPresetsModal: () => void;
}

export const ThemeTabContent: React.FC<ThemeTabContentProps> = ({
  bannerColor,
  bannerTextColor,
  onSelectPreset,
  selectedStatusLabel,
  onOpenStatusModal,
  onOpenPresetsModal,
}) => {
  const visiblePresets = BANNER_PRESETS.slice(0, 7);
  const isSelectedVisible = visiblePresets.some(
    preset => bannerColor === preset.color && bannerTextColor === preset.textColor
  );
  
  let displayPresets = [...visiblePresets];
  if (!isSelectedVisible) {
    const currentPreset = BANNER_PRESETS.find(
      preset => bannerColor === preset.color && bannerTextColor === preset.textColor
    );
    if (currentPreset) {
      displayPresets[6] = currentPreset;
    }
  }

  return (
    <View style={styles.animatedSection}>
      {/* Presets Selector Row */}
      <View style={styles.presetSection}>
        <Text style={styles.pickerLabel}>Choose Profile Theme Preset</Text>
        <View style={styles.presetsContainer}>
          {displayPresets.map((preset) => {
            const isSelected = 
              bannerColor === preset.color && 
              bannerTextColor === preset.textColor;
            
            return (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetDot, 
                  { backgroundColor: preset.color },
                  isSelected && styles.presetDotSelected
                ]}
                onPress={() => onSelectPreset(preset.color, preset.textColor)}
              >
                {isSelected && (
                  <Check 
                    size={14} 
                    color={preset.textColor} 
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {/* More (+) button */}
          <TouchableOpacity 
            style={styles.morePresetsBtn}
            onPress={onOpenPresetsModal}
          >
            <Plus size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Selector Badge */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Status Badge</Text>
        <TouchableOpacity 
          style={styles.pickerTrigger} 
          onPress={onOpenStatusModal}
        >
          <Text style={styles.pickerTriggerText}>{selectedStatusLabel}</Text>
          <ChevronDown size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedSection: {
    width: '100%',
  },
  presetSection: {
    marginBottom: 20,
  },
  presetsContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  presetDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  presetDotSelected: {
    borderWidth: 3,
    borderColor: '#0D9488',
  },
  morePresetsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  pickerTrigger: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerTriggerText: {
    fontSize: 14.5,
    color: '#0F172A',
  },
});

export default ThemeTabContent;
