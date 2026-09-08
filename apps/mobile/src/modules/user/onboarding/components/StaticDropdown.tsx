import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Theme from '../../../../app/theme';

interface Option {
  label: string;
  value: string;
}

interface StaticDropdownProps {
  label: string;
  placeholder: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const StaticDropdown: React.FC<StaticDropdownProps> = ({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayLabel = selectedOption ? selectedOption.label : '';

  const handleSelect = (val: string) => {
    onSelect(val);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>

      <TouchableOpacity
        style={[styles.inputWrapper, isOpen && styles.inputWrapperFocused]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.inputText,
            !displayLabel && { color: Theme.colors.textSecondary },
          ]}
        >
          {displayLabel || placeholder}
        </Text>
        <Text style={styles.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownListContainer}>
          <ScrollView
            style={styles.dropdownScrollView}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionRow,
                  selectedValue === opt.value && styles.optionRowSelected,
                ]}
                onPress={() => handleSelect(opt.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === opt.value && styles.optionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
    zIndex: 10,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  inputWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrapperFocused: {
    borderColor: Theme.colors.primary,
  },
  inputText: {
    fontSize: 15,
    color: Theme.colors.textMain,
  },
  arrowIcon: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
  },
  dropdownListContainer: {
    marginTop: 4,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScrollView: {
    paddingVertical: Theme.spacing.xs,
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.md,
  },
  optionRowSelected: {
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
  },
  optionText: {
    fontSize: 14,
    color: Theme.colors.textMain,
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
});

export default StaticDropdown;
