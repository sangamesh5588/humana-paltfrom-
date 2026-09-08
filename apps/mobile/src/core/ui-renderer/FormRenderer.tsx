import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SDUIForm } from './types';
import { getComponent } from './ComponentRegistry';
import Theme from '../../app/theme';

interface FormRendererProps {
  form: SDUIForm;
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any> | null;
  submitLabel?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  form,
  onSubmit,
  initialValues,
  submitLabel = 'Submit',
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    } else {
      // Set empty initial values for each field
      const empty: Record<string, any> = {};
      form.fields.forEach((field) => {
        empty[field.name] = '';
      });
      setValues(empty);
    }
    setErrors({});
  }, [form, initialValues]);

  const handleFieldChange = (fieldName: string, val: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: val }));
    // Clear error on change
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleValidation = (): boolean => {
    const nextErrors: Record<string, string> = {};
    
    form.fields.forEach((field) => {
      const val = values[field.name];
      
      // 1. Required Check
      if (field.isRequired && (val === undefined || val === null || val === '')) {
        nextErrors[field.name] = `${field.label} is required`;
        return;
      }

      // 2. Validation Pattern (RegEx) Check
      if (val && field.validationRule?.pattern) {
        const regex = new RegExp(field.validationRule.pattern);
        if (!regex.test(val)) {
          nextErrors[field.name] = field.validationRule.message || `Invalid format for ${field.label}`;
        }
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      onSubmit(values);
    }
  };

  return (
    <View style={styles.formContainer}>
      {form.fields.map((field) => {
        const InputComponent = getComponent(field.type);
        const fieldValue = values[field.name] !== undefined ? values[field.name] : '';
        const fieldError = errors[field.name];

        return (
          <InputComponent
            key={field.id}
            label={field.label}
            value={fieldValue}
            options={field.options}
            onChangeText={(text: string) => handleFieldChange(field.name, text)}
            onSelect={(val: string) => handleFieldChange(field.name, val)}
            onChange={(val: string) => handleFieldChange(field.name, val)}
            error={fieldError}
            isRequired={field.isRequired}
          />
        );
      })}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  submitBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  submitBtnText: {
    color: Theme.colors.textMain,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormRenderer;
