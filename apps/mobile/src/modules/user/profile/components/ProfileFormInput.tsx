import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ProfileFormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  placeholderTextColor?: string;
}

export const ProfileFormInput: React.FC<ProfileFormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  multiline = false,
  numberOfLines,
  disabled = false,
  placeholderTextColor = '#94A3B8',
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label} {required && '*'}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          disabled && styles.disabledInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={!disabled}
        selectTextOnFocus={!disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  disabledInput: {
    backgroundColor: '#E2E8F0',
    color: '#64748B',
    borderColor: '#CBD5E1',
  },
});

export default ProfileFormInput;
