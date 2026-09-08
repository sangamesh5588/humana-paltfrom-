import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../../app/theme';

interface Option {
  label: string;
  value: string;
}

interface SDUIPickerProps {
  label: string;
  value: string;
  options?: Option[] | null;
  onSelect: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export const SDUIPicker: React.FC<SDUIPickerProps> = ({
  label,
  value,
  options = [],
  onSelect,
  error,
  isRequired,
}) => {
  const defaultOptions: Option[] = options && options.length > 0 
    ? options 
    : [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      
      <View style={styles.optionsRow}>
        {defaultOptions.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.capsule,
                isSelected ? styles.capsuleSelected : null,
              ]}
              onPress={() => onSelect(opt.value)}
            >
              <Text style={[styles.capsuleText, isSelected ? styles.capsuleTextSelected : null]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
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
  optionsRow: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    padding: 4,
  },
  capsule: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.sm,
  },
  capsuleSelected: {
    backgroundColor: Theme.colors.primary,
  },
  capsuleText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  capsuleTextSelected: {
    color: Theme.colors.textMain,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 12,
    marginTop: Theme.spacing.xs,
  },
});

export default SDUIPicker;
