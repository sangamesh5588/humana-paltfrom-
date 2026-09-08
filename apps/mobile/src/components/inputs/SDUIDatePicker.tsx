import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Theme from '../../app/theme';

interface DatePickerProps {
  label: string;
  value: string; // expects YYYY-MM-DD
  onChange: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export const SDUIDatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  isRequired,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={Theme.colors.textSecondary}
        keyboardType="numeric"
        maxLength={10}
      />
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
  input: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    color: Theme.colors.textMain,
    padding: Theme.spacing.md,
    fontSize: 15,
  },
  inputError: {
    borderColor: Theme.colors.error,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 12,
    marginTop: Theme.spacing.xs,
  },
});

export default SDUIDatePicker;
