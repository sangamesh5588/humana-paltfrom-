import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import useJourneyStore from '../../store/journeyStore';
import { VerificationFieldConfig } from '../../../../shared/types/expert.types';

interface TextFieldStepProps {
  fields?: VerificationFieldConfig[];
}

export const TextFieldStep: React.FC<TextFieldStepProps> = ({ fields }) => {
  const { answers, updateAnswer } = useJourneyStore();

  if (!fields || fields.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No input fields configured for this step.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <View key={field.fieldKey} style={styles.fieldGroup}>
          <Text style={styles.label}>
            {field.label} {field.required && <Text style={styles.requiredStar}>*</Text>}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            placeholderTextColor="#94A3B8"
            value={answers[field.fieldKey] || ''}
            onChangeText={(val) => updateAnswer(field.fieldKey, val)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  requiredStar: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default TextFieldStep;
