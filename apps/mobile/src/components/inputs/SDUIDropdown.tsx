import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import Theme from '../../app/theme';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: Option[];
  onSelect: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export const SDUIDropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options = [],
  onSelect,
  error,
  isRequired,
}) => {
  const [visible, setVisible] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.button, error ? styles.buttonError : null]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.buttonText, !selectedOption ? styles.placeholder : null]}>
          {selectedOption ? selectedOption.label : 'Select an option...'}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select {label}</Text>
            <ScrollView style={styles.scroll}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, opt.value === value ? styles.optionSelected : null]}
                  onPress={() => {
                    onSelect(opt.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

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
  button: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    justifyContent: 'center',
  },
  buttonError: {
    borderColor: Theme.colors.error,
  },
  buttonText: {
    color: Theme.colors.textMain,
    fontSize: 15,
  },
  placeholder: {
    color: Theme.colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    maxHeight: '50%',
  },
  modalHeader: {
    color: Theme.colors.textMain,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
  },
  scroll: {
    width: '100%',
  },
  option: {
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  optionSelected: {
    backgroundColor: 'rgba(127, 90, 240, 0.1)',
  },
  optionText: {
    color: Theme.colors.textMain,
    fontSize: 16,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 12,
    marginTop: Theme.spacing.xs,
  },
});

export default SDUIDropdown;
