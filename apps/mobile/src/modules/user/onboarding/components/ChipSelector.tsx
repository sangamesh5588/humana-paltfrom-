import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../../../../app/theme';

interface ChipSelectorProps {
  label?: string;
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const toggleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.labelText}>{label}</Text>}
      <View style={styles.chipsWrapper}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, isSelected && styles.selectedChip]}
              onPress={() => toggleSelect(option)}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.sm,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedChip: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ChipSelector;
